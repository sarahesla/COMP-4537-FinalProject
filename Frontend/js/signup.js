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
    let signupBtn = H._(document, ".signupBtn")
    signupBtn.addEventListener("click", async(event) => {

        let username = H._(document, ".usernameInput").value
        let password = H._(document, ".passwordInput").value
        let password2 = H._(document, ".passwordInput2").value
        if (password != password2) {
            alert("Passwords must match")
            return false
        }
        console.log(username, password)
        try {
            let result = await User.register(username, password, password2)
            console.log(result)
            if (!result.isError) {
                localStorage.setItem("uauthToken", result.success.authToken)
                window.location.href = "home.html"
            } else {
                throw result.error
            }
        } catch (e) {
            console.log("we here!!")
            alert("Error", e)
            console.log(e)
        }
    })
})