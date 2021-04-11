// TODO : Can we decompose this raw code into functions? not a fan of spaghetti code.
function render(l) {
    let id = l.ledger_id
        // H.d(".ledger_template").className = id
    H.d(".ledger_template").id = "ledger_template-" + id
    let t = H.d("#ledger_template-" + id)
    let c = document.importNode(t.content, true)
    c.id = "ledger-" + id

    H._(c, ".card-title").id = "card-title-" + id
    H._(c, "#card-title-" + id).innerHTML = l.ledger_name

    H._(c, ".card-subtitle").id = "card-subtitle-" + id
    let subtitle = H._(c, "#card-subtitle-" + id)
    H._(c, ".accessBtn").id = "accessBtn-" + id
    H._(c, "#accessBtn-" + id).setAttribute("href", "ledger.html?id=" + id)
    for (let u of l.users) {
        let utag = document.createElement("span")
        utag.className = "tag-" + id + "-" + u.username
        let tagt = document.createElement("span")
        tagt.className = "title-" + id
        tagt.textContent = "@" + u.username
        utag.appendChild(tagt)
        console.log(utag)
        subtitle.appendChild(utag)

        if (u.user_id == l.created_by) {
            utag.style.cssText = "display:-webkit-inline-box;display:inline-flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:start;align-items:flex-start;position:relative;margin:2px;padding:0;height:26px;line-height:26px;background-color:#7a7a7a;cursor:default"
            tagt.style.cssText = "color:#fff; display:block;position:relative;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin:0 8px"
        } else {
            utag.style.cssText = "display:-webkit-inline-box;display:inline-flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:start;align-items:flex-start;position:relative;margin:2px;padding:0;height:26px;line-height:26px;background-color:#c4c4c4;cursor:default"
            tagt.style.cssText = "color:#000; display:block;position:relative;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin:0 8px"
        }

        H._(c, ".ledger_card").style.cssText = "padding: 0% 15%"

    }
    document.body.appendChild(c)
}

async function renderLedgers() {
    try {

        let authToken = localStorage.getItem("uauthToken")
        let ledgers = await Ledger.get_all(authToken)
        console.log(ledgers)
       
        for (const l of ledgers) {
            render(l)
        }

         if(ledgers.length == 0){
             H.d(".page_status").textContent = "You don't have any ledgers yet."
        }else{
             H.d(".page_status").textContent = ""
        }
    } catch (e) {
        console.log(e)
        console.log("Something went wrong")
    }
}

document.addEventListener("DOMContentLoaded", async(event) => {
    try {
        let result = await User.verifyLogin()
        console.log(result)
        if (!result.user_id) {
            window.location.href = "index.html"
        }
        let authToken = localStorage.getItem("uauthToken")
        let userData = await User.fetch_data(authToken)
        console.log(userData)
        if (userData.user_id) {
            H._(document, ".username").textContent = userData.username
        }
    } catch (e) {
        // window.location.href = "index.html"
        console.log(e)
            // window.location.href = "auth.html"
    }
    let logoutBtn = H._(document, ".logoutBtn")
    logoutBtn.addEventListener("click", async(event) => {
        try {
            localStorage.setItem("uauthToken", null)
            window.location.href = "index.html"
        } catch (e) {
            alert("Unauthorized")
            console.log(e)
        }
    })

    await renderLedgers()




    /**
     * Trigger a custom event
     * @param {*} el the element 
     * @param {*} etype event type
     */
    function eventFire(el, etype) {
        if (el.fireEvent) {
            (el.fireEvent('on' + etype));
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }


    createBtn.addEventListener("click", async(event) => {
            try {
                // TODO : Ledger form validation and error handling
                var myModal = document.getElementById('newLedgerModal')
                let ledger_name = H.d("#ledger-name").value
                let users = H.d("#ledger-users").value
                users = users.split(",")
                let authToken = localStorage.getItem("uauthToken")
                let create_result = await Ledger.createLedger(ledger_name, users, authToken)
                if (create_result) {
                    H.d("#ledger-name").value = ""
                    H.d("#ledger-users").value = ""
                    let tags = Array.from(document.getElementsByClassName("tag"))
                    console.log(tags)
                    tags.forEach(element => {
                        element.remove()
                    });
                    let cancelBtn = H.d("#cancelBtn")
                    eventFire(cancelBtn, 'click');
                    console.log(create_result)

                    render(create_result[0])
                }

            } catch (e) {
                console.log(e)
            }
        })
        // TODO : Validate usernames on change
        // let tagInput = H.d(".tag-input")
        // tagInput.addEventListener("DOMNodeInserted", async (event) => {
        //     if(event.srcElement.className == "title"){

    //     }
    // })

    // let usersTF = H.d("#ledger-users")
    // usersTF.addEventListener("change", async (event) =>{
    //     console.log("hello")
    // })



})