document.addEventListener("DOMContentLoaded", function () {
    const links = document.getElementsByClassName("random-link");
    // console.log(links)
    randomizeLinks(links)
});

function randomizeLinks(links) {
    fetch("/scripts/meta/pages.json").then(x => x.json()).then(data => {
        for (i = 0; i < links.length; i++) {
            let link = links[i]
            idx = Math.floor(Math.random() * data.length);
            // console.log(idx)
            // console.log(link.href)
            link.href = data[idx]
        }
    });
}