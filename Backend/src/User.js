import Helper from './Helper'
import Result from './Result'
let crypto = require('crypto')
let sha256 = require('js-sha256')
let fs = require("fs");
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");
let jwt = require("jsonwebtoken")
const Joi = require('joi')


export default class User {
    static schemaLogin() {
        return Joi.object({
            username: Joi.string()
                .min(3)
                .max(30)
                .required(),

            password: Joi.string()
                .min(3)
                .max(30)
                .required()
        })
    }

    static schema() {
        return User.schemaLogin().keys({
            repeat_password: Joi.ref('password')
        }).with("password", "repeat_password")
    }

    static async create(user, db) {
        try {
            let value = await User.schema().validateAsync(user)
            user.user_id = Helper.genId()
            let salt = crypto.randomBytes(20).toString('hex');
            let password_hash = sha256.hmac(salt, user.password);
            let insert_result = await db.insert("user", ["user_id", "username", "password_hash", "salt"], [user.user_id, user.username, password_hash, salt])
            return Result.Success(insert_result)
        } catch (e) {
            console.log("WE HERE")
            console.log(e)
            if ("details" in e) {
                e = e.details
                e.code = "JOI"
            }
            throw Result.Error(e)
        }
    }

    static async login(data, db) {
        try {
            let value = await User.schemaLogin().validateAsync(data)
            let user = await db.select("user", "*", { "username": data.username })
            if (user.length == 0) {
                throw { message: "Incorrect username/password. Please try again." }
            }
            user = user[0]
            let password_hash = sha256.hmac(user.salt, data.password);
            if (password_hash != user.password_hash) {
                throw { message: "Incorrect username/password. Please try again." }
            }
            let payload = user
            let signOptions = { subject: payload.user_id, algorithm: "RS256" }
            let authToken = jwt.sign(payload, privateKey, signOptions)
            return Result.Success({ authToken })
        } catch (e) {
            console.log("WE HERE")
            console.log(e)
            if ("details" in e) {
                e = e.details
                e.code = "JOI"
            }
            throw Result.Error(e)
        }
    }


    static async get_id(username, db) {
        try {
            let user = await db.select("user", "user_id", { "username": username })
            if (user.length == 0) {
                return ""
            }
            user = user[0]
            return user
        } catch (e) {
            console.log("WE HERE")
            console.log(e)
            if ("details" in e) {
                e = e.details
                e.code = "GET_ID"
            }
            throw Result.Error(e)
        }
    }



}