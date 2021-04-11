import Helper from './Helper'
import Result from './Result'
let crypto = require('crypto')
let sha256 = require('js-sha256')
let fs = require("fs");
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");
let jwt = require("jsonwebtoken")
const Joi = require('joi')


export default class Transaction {
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

    static async create(tr_name, ledger_id, amount, db) {
        try {
            let tr_id = Helper.genId()
            let res1 = await db.insert("tr_ledger", ["tr_id", "tr_name", "ledger_id", "amount"], [tr_id, tr_name, ledger_id, Number(amount)])
            let res2 = await Transaction.get(tr_id, ledger_id, db)
            return Result.Success(res2.get())
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


    static async get_all(ledger_id, db) {
        try {
            let results = await db.exec("SELECT * FROM tr_ledger WHERE ledger_id=?", [ledger_id])
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

    static async get(tr_id, ledger_id, db) {
        try {
            let results = await db.exec("SELECT * FROM tr_ledger JOIN ledger ON ledger.ledger_id = tr_ledger.ledger_id WHERE tr_id=? AND tr_ledger.ledger_id=?", [tr_id, ledger_id])
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


    static async edit(tr_id, name, amount db) {
        try {
            let results = await db.exec("UPDATE tr_ledger SET tr_id=?, tr_name=?, amount=?", [tr_id, ledger_id])

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

    static async delete(tr_id, ledger_id, db) {
        try {
            let results = await db.exec("SELECT * FROM tr_ledger JOIN ledger ON ledger.ledger_id = tr_ledger.ledger_id WHERE tr_id=? AND tr_ledger.ledger_id=?", [tr_id, ledger_id])
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