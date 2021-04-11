//let BASE_URL = "http://localhost:4040/op/api/v1"
let BASE_URL = "https://truffen.com/op/api/v1"
let API_KEY = "e5bG9U2NwD"
class User {
    static async verifyLogin() {
        return new Promise(async(resolve, reject) => {
            try {
                let authToken = localStorage.getItem("uauthToken")
                if (authToken != null) {

                    let res = await axios({
                        method: 'get',
                        url: BASE_URL + "/user",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Max-Age': 2592000, // 30 days
                            'Authorization': authToken,
                            "x-api-key": API_KEY
                        }
                    })
                    if (res) {
                        resolve(res.data)
                    } else throw res
                }
                throw "err"
            } catch (e) {
                console.log(e)
                reject("Unauthorized")
            }
        })
    }

    static async login(username, password) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'POST',
                    url: BASE_URL + "/user/login",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000 // 30 days
                    },
                    data: {
                        username,
                        password
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

    static async register(username, password, repeat_password) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'POST',
                    url: BASE_URL + "/user/register",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000 // 30 days
                    },
                    data: {
                        username,
                        password,
                        repeat_password
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

    static async fetch_data(authToken) {
        return new Promise(async(resolve, reject) => {
            try {
                let res = await axios({
                    method: 'GET',
                    url: BASE_URL + "/user",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000, // 30 days
                        'Authorization': authToken,
                        "x-api-key": API_KEY
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