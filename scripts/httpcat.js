document.addEventListener("DOMContentLoaded", function () {
    const links = document.getElementsByClassName("errorcat");
    let code = window.location.search.replace("?src=", "")
    if (!code) {
        code = "404"
    }

    for (let i = 0; i < links.length; i++) {
        links[i].src = "https://http.cat/"+code
    }
});