// thank you to petrapixel (https://petrapixel.neocities.org/coding/layout-base-code) for this code.

document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains("no-layout")) return;
    document.body.insertAdjacentHTML("afterbegin", headerEl);
    document.body.insertAdjacentHTML("beforeend", footerEl);

    initActiveLinks();
    motd();
});
function initActiveLinks() {
    const pathname = window.location.pathname;
    [...document.querySelectorAll("a")].forEach((el) => {
        const elHref = el.getAttribute("href").replace(".html", "").replace("/public", "");

        if (pathname == "/" || pathname == "") {
            // homepage
            if (elHref == "/" || elHref == "/index.html") el.classList.add("active");
        } else {
            // other pages
            if (elHref != "/" && elHref != "/index.html")
                if (window.location.href.startsWith("https://m1dnight__sun.neocities.org" + elHref)) el.classList.add("active");
        }
    });
}

function getNestingString() {
    const currentUrl = window.location.href.replace("http://", "").replace("https://", "").replace("/public/", "/");
    const numberOfSlahes = currentUrl.split("/").length - 1;
    if (numberOfSlahes == 1) return ".";
    if (numberOfSlahes == 2) return "..";
    return ".." + "/..".repeat(numberOfSlahes - 2);
}

const colors = ["#cb2956", "#ea8526", "#f4bd29", "#991c8d"]
function getPageTags() {
    let tags = document.querySelector("[name~=tags]").content
    const tagsList = tags.split(",")
    // console.log(tagsList);
    let tags_string = ""
    tagsList.forEach((tag, i) => {
        tag = tag.trim()
        let color = colors[i]
        tags_string += (`<div class=page-tag style="background-color:${color}">#${tag}</div>`)
    });
    return tags_string
}

function motd() {
    let tags = document.querySelector("[name~=tags]").content.split(",")
    let mainTag = tags.at(0).toLowerCase();
    // console.log(mainTag);
    if (mainTag === undefined) {
        mainTag = "_";
    }
    var out;
    fetch("/scripts/meta.json").then(x => x.json()).then(data => {
        let messages = data.messages;
        // console.log(messages);
        out = messages[mainTag];
        if (!out) {
            out = messages["_"];
        }
        // console.log(out);
        let motdEl = document.getElementById("motd");
        motdEl.innerHTML = `<p>${out}</p>`;
    });
}

function toggleFooter() {
    let footer = document.getElementById("footer");
    let collapsable = footer.children[0];
    let button = footer.children[1];
    if (collapsable.style.display !== "none") {
        collapsable.style.display = "none";
    } else {
        collapsable.style.display = "inline-block";
    }
    // console.log(button.innerHTML);
    
    if (button.innerHTML !== "<i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i>") {
        button.innerHTML = "<i class=\"fa fa-chevron-left\"></i>";
    } else {
        button.innerHTML = "<i class=\"fa fa-chevron-right\"></i>";
    }
}

const nesting = getNestingString();
const tags = getPageTags();
// console.log(message);

const headerEl = `
        <div id="header">
        <p>${document.title.replace(" | red skies at morning", "")}</p>
        <vl>&nbsp</vl>
        <div id="page-tags">${tags}</div>
        <vl>&nbsp</vl>
        <div id="motd"></div>
        </div>
    `;

const footerEl = `
        <div id="footer">
        <div class="collapsable">
        <a href="/">home</a>
        <vl>&nbsp</vl>
        <a href="/writing">writing</a>
        <vl>&nbsp</vl>
        <a href="/world">world</a>
        <vl>&nbsp</vl>
        <a href="/hb">homebrew</a>
        <vl>&nbsp</vl>
        </div>
        <button class="footer-toggle" onclick="toggleFooter()"><i class="fa fa-chevron-left"></i></button>
        </div>
    `;