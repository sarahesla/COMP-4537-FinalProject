import fs from 'fs'
import express from "express"
import jwt from "jsonwebtoken"
import Result from '../../src/Result'
import Admin from '../../src/Admin'
import DBManager from '../../src/DBManager'
import { verify } from 'crypto'
import Helper from '../../src/Helper'
import User from '../../src/User'
import Ledger from '../../src/Ledger'
import Transaction from '../../src/Transaction'
let path = require("path")
let api = express.Router()
let privateKey = fs.readFileSync("./src/security/private.key", "utf8");
let publicKey = fs.readFileSync("./src/security/public.key", "utf8");

let CONFIG = {
    user: "harryx",
    host: "db-mysql-nyc1-53815-do-user-1754324-0.b.db.ondigitalocean.com",
    password: "iz1udqdoydn51yas",
    port: 25060,
    insecureAuth: true,
    database: "tproj",
    max_connections: 40000
}

// let CONFIG = {
//     user: "sarahesl_admin",
//     host: "s11.fcomet.com",
//     password: "thisisapassword",
//     database: "sarahesl_finalproj"
// }

api.use(express.static(__dirname))

/**Admin Resource
 * Endpoints:
 * 1. POST /admin/register
 * 2. POST /admin/login
 * 3. GET /admin
 */
api.post("/admin/register", async(req, res) => {
    try {
        // validate the request
        let { username, password, repeat_password } = req.body

        //create a DBManager instance (dependecy injection)
        let db = new DBManager(CONFIG)

        //validate, create, and register admin using db
        let result = await Admin.create({ username, password, repeat_password }, db)
        if (result.get().isError) { throw result }
        console.log(result)
            //if error result will be thrown as an error
            // by default, its a success.
        return res.status(200).json(result)

    } catch (e) {
        if ("get" in e) {
            return res.status(400).json({ error: e.get() })
        }
        console.log(e)
        return res.status(400).json({ error: "Invalid Request." })
    }
})



api.post("/user/register", async(req, res) => {

    //create a DBManager instance (dependecy injection)
    let db = new DBManager(CONFIG)
    try {
        // validate the request
        let { username, password, repeat_password } = req.body

        //validate, create, and register admin using db
        let result = await User.create({ username, password, repeat_password }, db)
        if (result.get().isError) { throw result }
        console.log(result)
        let result1 = await User.login({ username, password }, db)
        return res.status(200).json(result1)
            //if error result will be thrown as an error
            // by default, its a success.

    } catch (e) {
        if ("get" in e) {
            return res.status(400).json({ error: e.get() })
        }
        console.log(e)
        return res.status(400).json({ error: "Invalid Request." })
    } finally {
        db.con.end()
    }
})

api.post("/admin/login", async(req, res) => {
    let db = new DBManager(CONFIG)
    try {
        let { username, password } = req.body
        let result = await Admin.login({ username, password }, db)
        return res.status(200).json(result)
    } catch (e) {
        if ("get" in e) {
            return res.status(400).json({ error: e.get() })
        }
        console.log(e)
        return res.status(400).json({ error: "Invalid Request." })
    } finally {
        db.con.end()
    }
})

api.post("/user/login", async(req, res) => {
    let db = new DBManager(CONFIG)
    try {
        let { username, password } = req.body
        let result = await User.login({ username, password }, db)
        return res.status(200).json(result)
    } catch (e) {
        if ("get" in e) {
            return res.status(400).json({ error: e.get() })
        }
        console.log(e)
        return res.status(400).json({ error: "Invalid Request." })
    } finally {
        db.con.end()
    }
})

api.get("/admin", Helper.verifyAuthToken, async(req, res) => {
    let db = new DBManager(CONFIG)
    try {
        let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            // get user data and merge it into user object
        let api_data = await Admin.fetch_endpoint_data(currentUser.admin_id, db)
        console.log("api_data", api_data.get())
        return res.json({...currentUser, "api_data": api_data.get() })
    } catch (e) {
        if ("get" in e) {
            return res.status(400).json({ error: e.get() })
        }
        console.log(e)
        return res.status(400).json({ error: "Invalid Request." })
    } finally {
        db.con.end()
    }
})

api.get("/user",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
                // get user data -> ledgers and shit and merge it into user object
            return res.json({...currentUser })
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        }
    }
)


api.get("/ledgers",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let ledgers = await Ledger.get_all(currentUser.user_id, db)
                // get user data -> ledgers and shit and merge it into user object

            return res.json(ledgers.get())
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)



// create a new ledger
api.post("/ledger",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { user_id } = currentUser
            let { ledger_name, users } = req.body
            let userIDs = []

            for await (const u of users) {
                let ux = await User.get_id(u, db)
                if (ux.user_id)
                    userIDs.push(ux.user_id)
            }
            userIDs.push(user_id)
            let result = await Ledger.create(ledger_name, user_id, userIDs, db)
            let ledger = result.get()
            return res.json(ledger)

        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)



api.get("/ledger/:id",
    async(req, res, next) => {
        let r = req
        r.url = "/ledger/:id"
        await Helper.verifyRequest(r, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { user_id } = currentUser
            let ledger_id = req.params.id
            let result = await Ledger.get(ledger_id, user_id, db)
            let ledger = result.get()
            return res.json(ledger)
                // get user data and merge it into user object
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)



// create a new transaction
api.post("/transaction",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { user_id } = currentUser
            let { tr_name, ledger_id, amount } = req.body
            let userIDs = []

            let result = await Transaction.create(tr_name, ledger_id, amount, db)
            let tr = result.get()
            return res.json(tr)

        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)


api.get("/transactions",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { ledger_id } = req.query
            let trs = await Transaction.get_all(ledger_id, db)
                // get user data -> ledgers and shit and merge it into user object
            return res.json(trs.get())
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)



api.put("/transaction",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { tr_id, name, amount } = req.body
            let trs = await Transaction.edit(tid, name, amount, db)
                // get user data -> ledgers and shit and merge it into user object
            return res.json(trs.get())
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)



api.delete("/transaction",
    async(req, res, next) => {
        await Helper.verifyRequest(req, res, next, new DBManager(CONFIG))
    },
    Helper.verifyAuthToken,
    async(req, res) => {
        let db = new DBManager(CONFIG)
        try {
            let currentUser = await Helper.jwtVerifyUser(req.token, publicKey)
            let { tr_id } = req.body
            let trs = await Transaction.get_all(tr_id, db)
                // get user data -> ledgers and shit and merge it into user object
            return res.json(trs.get())
        } catch (e) {
            if ("get" in e) {
                return res.status(400).json({ error: e.get() })
            }
            console.log(e)
            return res.status(400).json({ error: "Invalid Request." })
        } finally {
            db.con.end()
        }
    }
)


module.exports = api