import Helper from './Helper'
import Result from './Result'
let crypto = require('crypto')
let sha256 = require('js-sha256')
let fs = require("fs");
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");
let jwt = require("jsonwebtoken")
const Joi = require('joi')


export default class Ledger {
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

    static async create(ledger_name, user_id, userIDs, db) {
        try {
            let ledger_id = Helper.genId()
            let inserts = []
            userIDs.forEach(u => {
                inserts.push([ledger_id, u])
            })
            let insert_result = await db.insert("ledger", ["ledger_id", "ledger_name", "created_by"], [ledger_id, ledger_name, user_id])
            let lu_insert_result = await db.insertT("ledger_user", ["ledger_id", "user_id"], inserts)
            let result = await Ledger.get(ledger_id, user_id, db)

            return Result.Success(result.get())
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


    static async get_all(user_id, db) {
        try {
            let results = await db.exec("SELECT * FROM ledger_user JOIN ledger on ledger_user.ledger_id=ledger.ledger_id WHERE user_id=?", [user_id])
            for await (const res of results) {
                res.users = []
                let u_res = await db.exec("SELECT ledger_user.user_id, user.username FROM ledger_user JOIN user on ledger_user.user_id = user.user_id WHERE ledger_id=?", [res.ledger_id])
                res.users = u_res
            }
            return Result.Success(results)
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

    static async get(ledger_id, user_id, db) {
        try {
            let results = await db.exec("SELECT * FROM ledger_user JOIN ledger on ledger_user.ledger_id=ledger.ledger_id WHERE ledger_user.ledger_id=? AND user_id=?", [ledger_id, user_id])
            for await (const res of results) {
                res.users = []
                let u_res = await db.exec("SELECT ledger_user.user_id, user.username FROM ledger_user JOIN user on ledger_user.user_id = user.user_id WHERE ledger_id=?", [ledger_id])
                res.users = u_res
            }
            return Result.Success(results)
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



}