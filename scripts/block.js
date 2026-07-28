document.addEventListener("DOMContentLoaded", function () {
    if (window.location.search) {
        if (!isUuid(window.location.search.replace("?uuid=", ""))) {
            setInvisible()
            return
        } else {
            let uuid = window.location.search.replace("?uuid=", "")
            window.location.replace((window.location + "").replace(window.location.search, ""))
            setCookie("uuid", uuid, 7)
            let hash = stringToInt(window.location.pathname.replace(".html", "")) * stringToInt(uuid)
            setCookie("hash", hash, 7)
        }
    }

    let uuid = getCookie("uuid")
    // if (!uuid) { setInvisible() }
    let hash = Number(getCookie("hash"))
    if (!hash || !uuid) {
        setInvisible()
        return
    } else {
        let calc = stringToInt(window.location.pathname.replace(".html", "")) * stringToInt(uuid)
        // alert(window.location.pathname.replace(".html", "") + " " + uuid + ": " + hash)
        // console.log(calc)
        // console.log(hash)
        if (!(calc === hash)) { setInvisible() }
        return
    }
});

function setInvisible() {
    let content = document.getElementsByClassName("content")
    for (let i = 0; i < content.length; i++) {
        content[i].innerHTML = ""
    }
    window.location.replace("/error.html#404")
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function stringToInt(str) {
    let array = Array.from(str)
    return array.map(function (e) {
        return e.charCodeAt(0)
    }).reduce((partialSum, a) => (partialSum * a));
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function isUuid(str) {
    return uuidRegex.test(str)
}