// let BASE_URL = "http://localhost:4040/op/api/v1"
// let BASE_URL = "https://truffen.com/op/api/v1"
// let API_KEY = "e5bG9U2NwD"
class Transaction {
    static async create(tr_name, ledger_id, amount, authToken) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'POST',
                    url: BASE_URL + "/transaction",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000,
                        'Authorization': authToken,
                        "x-api-key": API_KEY
                    },
                    data: {
                        tr_name,
                        ledger_id,
                        amount
                    }
                })
                if (res) {
                    resolve(res.data)
                } else throw res

            } catch (e) {
                console.log(e)
                reject("Unauthorized")
            }
        })
    }




    static async get_all(ledger_id, authToken) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'GET',
                    url: BASE_URL + "/transactions",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000,
                        'Authorization': authToken,
                        "x-api-key": API_KEY
                    },
                    params: {
                        ledger_id
                    }

                })
                if (res) {
                    resolve(res.data)
                } else throw res

            } catch (e) {
                console.log(e)
                reject("Unauthorized")
            }
        })
    }



    static async edit(tr_id, name, amount, authToken) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'PUT',
                    url: BASE_URL + "/transaction",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000,
                        'Authorization': authToken,
                        "x-api-key": API_KEY
                    },
                    params: {
                        tr_id,
                        name,
                        amount
                    }

                })
                if (res) {
                    resolve(res.data)
                } else throw res

            } catch (e) {
                console.log(e)
                reject("Unauthorized")
            }
        })
    }



    static async delete(tr_id, authToken) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'DELETE',
                    url: BASE_URL + "/transaction",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000,
                        'Authorization': authToken,
                        "x-api-key": API_KEY
                    },
                    params: {
                        tr_id
                    }

                })
                if (res) {
                    resolve(res.data)
                } else throw res

            } catch (e) {
                console.log(e)
                reject("Unauthorized")
            }
        })
    }



}