document.addEventListener("DOMContentLoaded", function () {
    const els = document.getElementById("delay-load").children;
    let hash = window.location.hash
    if (hash === "#skipall") { hideall(els) }
    else if (!(hash === "#navigation")) {
        fadedown(els)
    }
});

var timeouts = [];

function fadedown(els) {
    for (let i = 0; i < els.length; i++) {
        els[i].style.display = "none"
        timeouts.push(setTimeout(function () {
            els[i].style.display = "block"
            els[i].classList.add("fade-in")
        }, i * 1000))
    }
}

function hideall(els) {
    for (let i = 0; i < els.length - 1; i++) {
        els[i].style.display = "none"
    }
}

function override() {
    let els = document.getElementById("delay-load").children;
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i])
    }
    for (let i = 0; i < els.length; i++) {
        els[i].style.display = "block"
        els[i].classList.remove("fade-in")
    }
}

function redir_to_hideall() {
    let urlPieces = [location.protocol, '//', location.host, location.pathname]
    let url = urlPieces.join('')
    window.location.href = url + "#skipall"
    let els = document.getElementById("delay-load").children;
    override()
    hideall(els)
}

// async function sleep(seconds) {
//     return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
// }