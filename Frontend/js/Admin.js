let BASE_URL = "http://localhost:4040/op/api/v1"
//let BASE_URL = "https://truffen.com/op/api/v1"

class Admin{
    static async verifyLogin(){
        return new Promise(async (resolve, reject) => {
            try{
                let authToken = localStorage.getItem("authToken")
                if(authToken != null){

                    let res = await axios({
                        method: 'get',
                        url: BASE_URL + "/admin",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Max-Age': 2592000, // 30 days
                            'Authorization': authToken
                        }   
                    })
                    if (res){
                        resolve(res.data)
                    }
                    else throw res
                }
                throw "err"
            }catch(e){
                console.log(e)
                reject("Unauthorized")
            }
        })
    }

    static async login(username, password){
        return new Promise(async (resolve, reject) => {
            try{
                let res = await axios({
                    method: 'POST',
                    url: BASE_URL + "/admin/login",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000// 30 days
                    },
                    data: {
                        username,
                        password
                    }
                })
                if (res){
                    resolve(res.data)
                }
                else throw res
            
            }catch(e){
                console.log(e)
                reject("Unauthorized")
            }
        })
    }

    static async fetch_data(authToken){
        return new Promise(async (resolve, reject) => {
            try{
                let res = await axios({
                    method: 'GET',
                    url: BASE_URL + "/admin",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Max-Age': 2592000,// 30 days
                        'Authorization': authToken
                    }
                })
                if (res){
                    resolve(res.data)
                }
                else throw res
            
            }catch(e){
                console.log(e)
                reject("Unauthorized")
            }
        })
    }


}