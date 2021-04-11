let state = {
    tr_id: ""
}

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

    for (let u of l.users) {
        let utag = document.createElement("span")
        utag.className = "tag-" + id + "-" + u.username
        let tagt = document.createElement("span")
        tagt.className = "title-" + id
        tagt.textContent = "@" + u.username
        let balance = document.createElement("span")
        balance.className = "badge bg-primary badge_" + u.user_id
        balance.textContent = "$ 0"
        utag.appendChild(tagt)
        utag.insertAdjacentElement("beforeend", balance)
        console.log(utag)
        subtitle.appendChild(utag)

        balance.style.cssText = "color: #fff; font-size:15px"
        if (u.user_id == l.created_by) {
            utag.style.cssText = "display:-webkit-inline-box;display:inline-flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:start;align-items:flex-start;position:relative;margin:15px;padding:5px 20px;height:auto;line-height:26px;background-color:#7a7a7a;cursor:default"
            tagt.style.cssText = "color:#fff; display:block;position:relative;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin:0 8px"
        } else {
            utag.style.cssText = "display:-webkit-inline-box;display:inline-flex;-webkit-box-pack:justify;justify-content:space-between;-webkit-box-align:start;align-items:flex-start;position:relative;margin:15px;padding:5px 20px;height:auto;line-height:26px;background-color:#f8f8f8;cursor:default"
            tagt.style.cssText = "color:#000; display:block;position:relative;font-size:14px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin:0 8px"
        }



        H._(c, ".ledger_card").style.cssText = "padding: 0% 15%"

    }
    H.d(".ledger_section").appendChild(c)
}


function renderTR(tr) {
    let id = tr.tr_id
    H.d(".tr_template").id = "tr_template-" + id
    let t = H.d("#tr_template-" + id)
    let c = document.importNode(t.content, true)
    c.id = "tr-" + id
    H._(c, ".card-title").id = "card-title-" + id
    H._(c, "#card-title-" + id).innerHTML = tr.tr_name
    H._(c, ".card-subtitle").id = "card-subtitle-" + id

    H._(c, ".card-subtitle").id = "card-subtitle-" + id
    H._(c, ".editBtn").id = "editBtn-" + id
    H._(c, ".deleteBtn").id = "deleteBtn-" + id

    H._(c, "#editBtn-" + id).addEventListener("click", edit_tr(id))
    H._(c, "#deleteBtn-" + id).addEventListener("click", delete_tr(id))
    H._(c, "#card-subtitle-" + id).innerHTML = "$" + tr.amount
    H._(c, ".transaction_card").style.cssText = "padding: 0% 15%;background-color:#f8f8f8"
    H.d(".transaction_section").appendChild(c)
}

function edit_tr(id) {
    return async function() {
        H.d("#tr_name").value = H.d("#card-title-" + id).value
        H.d("#tr_amount").value = H.d("#card-subtitle-" + id).value

        let name = H.d("#tr_name").value
        let amount = H.d("#tr_amount").value
        try {
            let authToken = localStorage.getItem("uauthToken")
            let url = new URL(window.location.href)
            console.log(url)
            let lid = url.search.split("&")[0].split("?id=")[1]

            let edit_result = await Transaction.edit(id, name, amount, authToken)
            await updateamounts(lid)
        } catch (e) {
            console.log(e)
        }
    }
}


function delete_tr(id) {
    return async function() {
        try {
            let url = new URL(window.location.href)
            console.log(url)
            let lid = url.search.split("&")[0].split("?id=")[1]
            let authToken = localStorage.getItem("uauthToken")

            let edit_result = await Transaction.delete(id)
            await updateamounts(lid)
        } catch (e) {
            console.log(e)
        }
    }
}

async function updateamounts(id) {
    try {
        let authToken = localStorage.getItem("uauthToken")
        let trs = await Transaction.get_all(id, authToken)
        let ushares = {}
        let total = 0
        for (const tr of trs) {
            total += tr.amount
        }

        if (trs.length > 0) {
            for (const u of trs[0].users) {
                let amt = total / trs[0].users.length
                let uid = u.user_id
                ushares[uid] = amt
                H.d(".badge_" + uid).textContent = "$ " + String(amt.toFixed(2))
            }
        }


        console.log(ushares)

    } catch (e) {
        console.log(e)
        console.log("Something went wrong")
    }

}

async function render_trs(id) {
    try {

        let authToken = localStorage.getItem("uauthToken")
        let trs = await Transaction.get_all(id, authToken)
        console.log(trs)

        let ushares = {}


        console.log(ushares)

        let total = 0
        for (const tr of trs) {
            renderTR(tr)
            total += tr.amount
        }

        if (trs.length > 0) {
            for (const u of trs[0].users) {
                let amt = total / trs[0].users.length
                let uid = u.user_id
                ushares[uid] = amt
                H.d(".badge_" + uid).textContent = "$ " + String(amt.toFixed(2))
            }
        }


        console.log(ushares)

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
        let url = new URL(window.location.href)
        console.log(url)
        let lid = url.search.split("&")[0].split("?id=")[1]
        if (lid != null) {
            console.log(lid)
            let ledger = await Ledger.get_by_id(lid, authToken)
            render(ledger[0])

            await render_trs(lid)

            console.log(ledger)
        } else {
            H.d(".page_code").textContent = "404"
            H.d(".page_status").textContent = "Page Not Found"
            H.d(".page_status").style.cssText = "font-size:30px"
            H.d(".page_code").style.cssText = "font-size:80px"
            return false
        }

        // let userData = await Ledger.get(authToken)

        // if (userData.user_id) {
        //     H._(document, ".username").textContent = userData.username
        // }
    } catch (e) {
        // window.location.href = "index.html"
        console.log(e)
            // window.location.href = "auth.html"
    }







    let createBtn1 = H.d("#createBtn")
    createBtn1.addEventListener("click", async(event) => {
        try {
            var myModal = document.getElementById('newTrModal')
            let tr_name = H.d("#tr_name").value
            let tr_amount = Number(H.d("#tr_amount").value)
            let authToken = localStorage.getItem("uauthToken")
            let url = new URL(window.location.href)
            console.log(url)
            let lid = url.search.split("&")[0].split("?id=")[1]

            let create_result = await Transaction.create(tr_name, lid, tr_amount, authToken)
            console.log("WE HERE!!", create_result)
            if (create_result) {

                let cancelBtn = H.d("#cancelBtn")
                eventFire(cancelBtn, 'click');
                console.log(create_result)

                renderTR(create_result[0])
                await updateamounts(lid)
            }

        } catch (e) {
            console.log(e)
        }
    })



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
})