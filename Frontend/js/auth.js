document.addEventListener("DOMContentLoaded", async (event)=>{
    try{
        let result = await Admin.verifyLogin()
        if(result.admin_id){
            console.log(result)
            window.location.href = "admin.html"
          
        }
    }catch(e){
        console.log(e)
    }
    let loginBtn = H._(document, ".loginBtn")
    loginBtn.addEventListener("click", async (event) => {
        let username = H._(document, ".usernameInput").value
        let password = H._(document, ".passwordInput").value
        console.log(username, password)
        try{
            let result = await Admin.login(username, password)
            console.log(result)
            if(!result.isError){
                localStorage.setItem("authToken", result.success.authToken)
                window.location.href = "admin.html"
                // window.location.href = "admin.html"
            }else{
                throw result.error
            }
            
        }catch(e){

            alert("Incorrect Username/Password")
            console.log(e)
        }
    })
})


