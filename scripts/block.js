document.addEventListener("DOMContentLoaded", function () {
    let uuid = getCookie("uuid")
    if (!uuid) { setInvisible() }
    let hash = Number(getCookie("hash"))
    if (!hash) { setInvisible() }

    let calc = stringToInt(window.location.pathname.replace(".html", "").replace(/^\//g, "")) * stringToInt(uuid)
    // alert(window.location.pathname.replace(".html", "").replace(/^\//g, "") + " " + uuid + ": " + hash)
    console.log(calc)
    // console.log(hash)
    if (!(calc === hash)) { setInvisible() }
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

function stringToInt(str) {
    let array = Array.from(str)
    return array.map(function (e) {
        return e.charCodeAt(0)
    }).reduce((partialSum, a) => partialSum + a, 0);
}