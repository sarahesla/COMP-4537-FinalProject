document.addEventListener("DOMContentLoaded", async (event)=>{
    try{
        let result = await Admin.verifyLogin()
        if(!result.admin_id){
            window.location.href = "auth.html"
        }
        let authToken = localStorage.getItem("authToken")
        let adminData = await Admin.fetch_data(authToken)
        console.log(adminData)
        if(adminData.admin_id){
            H._(document, ".username").textContent = adminData.username
            H._(document, ".api_token").textContent = adminData.admin_id
            let api_data = adminData.api_data
            let api_table = H._(document, ".api_table")
            for(let i = 0; i < api_data.length; i++){
                let row = api_table.insertRow(i+1)
                let method_cell = row.insertCell(0)
                let endpoint_cell = row.insertCell(1)
                let count_cell = row.insertCell(2)
                
                method_cell.innerHTML =  api_data[i].method
                endpoint_cell.innerHTML =  api_data[i].endpoint
                count_cell.innerHTML =  api_data[i].count
            }
        }
    }catch(e){
        window.location.href = "auth.html"
        console.log(e)
        // window.location.href = "auth.html"
    }
    let logoutBtn = H._(document, ".logoutBtn")
    logoutBtn.addEventListener("click", async (event) => {
        try{
            localStorage.setItem("authToken", null)
            window.location.href = "auth.html"
        }catch(e){
            alert("Unauthorized")
            console.log(e)
        }
    })
})


