import Helper from './Helper'
import Result from './Result'
let crypto = require('crypto')
let sha256 = require('js-sha256')
let fs = require("fs");
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");
let jwt = require("jsonwebtoken")
const Joi = require('joi')


export default class Admin{
    static schemaLogin(){
        return Joi.object({
            username:  Joi.string()
            .min(3)
            .max(30)
            .required(),
            
            password: Joi.string()
            .min(3)
            .max(30)
            .required()
        })
    }
    
    static schema(){
        return Admin.schemaLogin().keys({
            repeat_password: Joi.ref('password')
        }).with("password", "repeat_password")
    }
    
    static async create(admin, db){
        try{
            let value = await Admin.schema().validateAsync(admin)
            admin.admin_id = Helper.genId()
            let salt = crypto.randomBytes(20).toString('hex');
            let password_hash = sha256.hmac(salt, admin.password); 
            let insert_result = await db.insert("admin", 
            ["admin_id", "username", "password_hash", "salt"], 
            [admin.admin_id, admin.username, password_hash, salt])
            return Result.Success(insert_result)
        }catch(e){
            console.log("WE HERE")
            console.log(e)
            if("details" in e){
                e = e.details
                e.code = "JOI"
            }    
            throw Result.Error(e)
        }
    }
    
    static async login(data, db){
        try{
            let value = await Admin.schemaLogin().validateAsync(data)
            let user = await db.select("admin", "*", {"username": data.username})
            if(user.length == 0){
                throw {message: "Incorrect username/password. Please try again."}
            }
            user = user[0]
            let password_hash = sha256.hmac(user.salt, data.password);
            if(password_hash != user.password_hash){
                throw {message: "Incorrect username/password. Please try again."}
            }
            let payload = user
            let signOptions = {subject: payload.admin_id, algorithm: "RS256"}
            let authToken = jwt.sign(payload, privateKey, signOptions)
            return Result.Success({authToken})
        }catch(e){
            console.log("WE HERE")
            console.log(e)
            if("details" in e){
                e = e.details
                e.code = "JOI"
            }    
            throw Result.Error(e)
        }
    }
    
    static async fetch_endpoint_data(admin_id, db){
        try{
            let api_data = await db.select_grouped("api_request", 
            ["endpoint", "method"], 
            {"admin_id": admin_id},
            ["endpoint", "method"]
            )
            return Result.Success(api_data)
        }catch(e){
            console.log("WE HERE")
            console.log(e)
            if("details" in e){
                e = e.details
                e.code = "SQL"
            }    
            throw Result.Error(e)
        }
    }
    
}