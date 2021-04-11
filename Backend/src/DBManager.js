import Result from "./Result";
let mysql = require("mysql")
    /**
     * DBManager provides an interface for all use cases.
     * 
     */
export default class DBManager {
    constructor(config) {
        try {
            this.con = mysql.createConnection(config)
            this.con.connect()
        } catch (e) {
            throw 1 / 0
        }
    }

    async insert(table, columns, values) {
        return new Promise((resolve, reject) => {
            try {
                let sql = "INSERT INTO ?? (??) VALUES (?)"
                sql = mysql.format(sql, [table, columns, values])
                this.con.query(sql, (error, results, fields) => {
                    if (error) reject(error)
                    else {
                        resolve(results)
                    }
                })

            } catch (e) {
                reject("Database error: cannot register admin")
            } finally {
                // this.con.end()
            }
        })
    }

    async insertT(table, columns, values) {
        return new Promise((resolve, reject) => {
            try {
                let sql = "INSERT INTO ?? (??) VALUES ?"
                sql = mysql.format(sql, [table, columns, values])
                this.con.query(sql, (error, results, fields) => {
                    if (error) reject(error)
                    else {
                        resolve(results)
                    }
                })

            } catch (e) {
                reject("Database error: cannot register admin")
            } finally {
                // this.con.end()
            }
        })
    }

    async select(table, columns, values) {
        return new Promise((resolve, reject) => {
            try {
                let sql = "SELECT ?? FROM ?? WHERE ?"
                sql = mysql.format(sql, [columns, table, values])
                this.con.query(sql, (error, results, fields) => {
                    if (error) reject(error)
                    else {
                        resolve(JSON.parse(JSON.stringify(results)))
                    }
                })

            } catch (e) {
                reject("Database error: cannot fetch data")
            } finally {
                // this.con.end()
            }
        })
    }

    async select_grouped(table, columns, values, group) {
        return new Promise((resolve, reject) => {
            try {
                let sql = "SELECT ??, COUNT(*) as count FROM ?? WHERE ? GROUP BY ??"
                sql = mysql.format(sql, [columns, table, values, group])
                this.con.query(sql, (error, results, fields) => {
                    if (error) reject(error)
                    else {
                        resolve(JSON.parse(JSON.stringify(results)))
                    }
                })

            } catch (e) {
                reject("Database error: cannot fetch grouped data")
            } finally {
                // this.con.end()
            }
        })
    }


    async exec(sql, values) {
        return new Promise((resolve, reject) => {
            try {
                sql = mysql.format(sql, values)
                this.con.query(sql, (error, results, fields) => {
                    if (error) reject(error)
                    else {
                        resolve(JSON.parse(JSON.stringify(results)))
                    }
                })

            } catch (e) {
                reject("Database error: cannot fetch data")
            } finally {
                // this.con.end()
            }
        })
    }

}