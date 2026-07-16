document.addEventListener("DOMContentLoaded", function () {
    const artFeed = document.getElementById("art-container")
    const poemFeed = document.getElementById("poetry-container")
    const essayFeed = document.getElementById("writing-container")
    const limit = 18

    fetch("/scripts/meta/gallery.json").then(x => x.json()).then(data => {
        let artLocs = data.art;
        let poemLocs = data.poems;
        let essayLocs = data.writing;

        collectLocations(artLocs, limit).then(data => {
            artFeed.innerHTML = data
        })
        collectLocations(poemLocs, limit).then(data => {
            poemFeed.innerHTML = data
        })
        collectLocations(essayLocs, limit).then(data => {
            essayFeed.innerHTML = data
        })
    });
});

async function collectLocations(locs, limit) {
    locs.slice(0, limit)

    let out = ""
    for (var loc of locs) {
        let data = await handleWrapping(loc)
        if (data !== null) {
            out = out + data
        }
    }
    return out
}

async function handleWrapping(loc) {
    try {
        let page = await fetch(loc)
        if (!page.ok) {
            return null
        }
        // console.log(await page.text())
        // <meta name="desc" type=(".*?") desc=(".*?").*>
        let text = await page.text()
        let head = headRegex.exec(text)[0]
        // console.log(text)
        let match = dataRegex.exec(head)
        let titleMatch = titleRegex.exec(head)
        // console.log(title)
        // console.log(match)
        if (match === null) {
            return null
        }
        if (titleMatch === null) {
            return null
        }
        // match.forEach((match, groupIndex) => {
        // console.log(`Found match, group ${groupIndex}: ${match}`);
        // })

        let title = titleMatch[1].replace(" | red skies at morning", "")
        let type = match[1].replaceAll("\"", "")
        let desc = match[2].replaceAll("\\n", "<br>").replaceAll("\"", "")
        // console.log(title, type, desc)


        let content = mediaWrappers[type]
        content = content.replace("$1", desc)
        // if (type == "audio") {
        // content = content.replace("$2", meta.audio_encode)
        // }

        let wrapper = articleWrapper
            .replace("%{article-title}", `<a href='${loc}'><h1>${title}</h1></a>`)
            .replace("%{article-content}", content)
            .replace("%{article-url}", loc)
        return wrapper

    } catch (error) {
        // console.error(error)
        return null
    }
}

const headRegex = /<head>.*<\/head>/gms;
const titleRegex = /<title>(.*?)<\/title>/gm;
const dataRegex = /<meta name="desc" type=(".*?") desc=(".*?").*>/gm;

const articleWrapper = `
<div class="article" style="width: 23vw">
    <div class="article-header">
        <div class="article-header-tab">
            %{article-title}
        </div>
        <a href="%{article-url}">
            <div class="action-dot" style="background-color: #49ace3;"></div>
        </a>
    </div>
    <div class="article-content">
        %{article-content}
    </div>
</div>
`;

const mediaWrappers = {
    image: "<img src=$1>",
    gifv: "<img src=$1>",
    video: "<video src=$1>",
    audio: "<audio src=$1 type=audio/$2>",
    text: "<p>$1</p>",
    text_short: "<p><i>$1</i></p>"
}