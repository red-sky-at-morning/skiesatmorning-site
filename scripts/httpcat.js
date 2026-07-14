document.addEventListener("DOMContentLoaded", function () {
    const links = document.getElementsByClassName("errorcat");
    let code = window.location.hash
    if (!code) {
        code = "404"
    }

    for (let i = 0; i < links.length; i++) {
        links[i].src = "https://http.cat/"+code
    }
});