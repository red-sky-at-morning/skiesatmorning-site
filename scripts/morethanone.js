const KEY = "sk_-oXzaYU0Zea2SORPe7Vt5RzfEuwLIaZBqIELzqB0IYk"
const API_URL = "/v1"
const BASE_URL = "https://many.skiesatmorning.com"
// const BASE_URL = "https://test.sheaf.sh"

document.addEventListener("DOMContentLoaded", function () {
    health_check(`${BASE_URL}/v1/auth/config`, 500).then(data => {
        if (!data) {
            let front = document.getElementById("track-front")
            front.innerHTML = front_chip
                .replaceAll("%name", "Sever seems down.")
                .replaceAll(`<div class="small-dot" style="background-color: %color;"></div>`, "")
                .replaceAll("%time", "")
        }
    })
    get_current_front().then((data) => console.log(data))
});

async function health_check(url, mseconds) {
    let controller = new AbortController();
    let timer = setTimeout(() => controller.abort(), mseconds)

    try {
        let health = await fetch(url,
            { signal: controller.signal }
        )
        clearTimeout(timer)

        // console.log(await health.json())
        console.log("server up probably")
        return true
    }
    catch {
        console.log("server down probably")
        let status = document.getElementById("health-status")
        status.style.backgroundColor = "#cb2956"
        return false
    }
}

async function get_current_front() {
    let fronts = await fetch_current_front()
    if (!fronts) { return }

    let members = fronts["member_ids"]
    let status = fronts["custom_status"]

    let time = new Date(fronts["started_at"])
    let now = Date.now()
    let elapsed = now-time
    let hours = Math.floor(elapsed / (3600 * 1000))
    console.log(hours)
    if (hours === 0) {
        hours = "just now"
    } else {
        hours = hours + "h"
    }

    let htmlText = ""
    if (status) {
        htmlText += `<p style="color:#a5adcb; font-size:12px; margin:10px 5px">currently: ${status}</p>`
    }
    
    for (let i = 0; i < members.length; i++) {
        let member = await fetch_member(members[i])
        console.log(member)
        let name = member.display_name ? member.display_name : member.name
        console.log(name)
        let color = member.color
        htmlText += front_chip
            .replaceAll("%name", name)
            .replaceAll("%color", color)
            .replaceAll("%time", hours)
    }
    let front = document.getElementById("track-front")
    front.innerHTML = htmlText
}

async function fetch_current_front() {
    let response = await fetch(BASE_URL + API_URL + "/fronts/current", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${KEY}`
        }
        // mode: "no-cors",
    })
    response = await response.json()
    let ids = response[0]
    console.log(ids)
    return ids
}

async function fetch_member(id) {
    let response = await fetch(BASE_URL + API_URL + `/members/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${KEY}`
        }
    })
    response = await response.json()
    // console.log(response)
    return response
}

const front_chip = `
<div class="front-chip">
<p>%name</p><div class="small-dot" style="background-color: %color;"></div><p style="color:#8087a2">%time</p>
</div>
`