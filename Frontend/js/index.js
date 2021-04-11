document.addEventListener("DOMContentLoaded", async(event) => {
    try {
        let result = await User.verifyLogin()
        if (result.user_id) {
            console.log(result)
            window.location.href = "home.html"

        }
    } catch (e) {
        console.log(e)
    }
    let loginBtn = H._(document, ".loginBtn")
    loginBtn.addEventListener("click", async(event) => {
        let username = H._(document, ".usernameInput").value
        let password = H._(document, ".passwordInput").value
        console.log(username, password)
        try {
            let result = await User.login(username, password)
            console.log(result)
            if (!result.isError) {
                localStorage.setItem("uauthToken", result.success.authToken)
                window.location.href = "home.html"
            } else {
                throw result.error
            }
        } catch (e) {
            console.log("we here!!")
            alert("Incorrect Username/Password")
            console.log(e)
        }
    })
})