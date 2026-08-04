const t = "4570667f2cc4ebf308288c3b166d3acb"
const s = "T2ef7UUcycuy"

document.addEventListener("DOMContentLoaded", function () {
    let containers = document.getElementsByClassName("subsonic-container")
    for (let i = 0; i < containers.length; i++) {
        load(containers[i])
    }
});

function load(el) {
    getSubsonic().then(data => {
        console.log(data)
        let repl_html = ""
        if (data.length == 0) {
            repl_html = htmlWrapper
                .replaceAll(` style="background-image: url(%cover_art);"`, "")
                .replaceAll("%title", "Nothing playing")
                .replaceAll("%artist", "no players found from clear skies at morning")
                .replaceAll("%album", "")
        }
        for (let i = 0; i < data.length; i++) {
            console.log(data[i])
            repl_html = repl_html + htmlWrapper
                .replaceAll("%cover_art", data[i][4])
                .replaceAll("%title", data[i][1])
                .replaceAll("%artist", data[i][2])
                .replaceAll("%album", data[i][3].replace("[Unknown Album]", ""))
        }
        el.innerHTML = repl_html
    })
}

const api_url = `https://clear.skiesatmorning.com/rest/%e.view?u=redskiesatmorning&t=${t}&s=${s}&v=1.13.0&c=redskies_website_apicall&f=json`
async function getSubsonic() {
    let response = await fetch(api_url.replace("%e", "getNowPlaying"))
    if (!response.ok) return null
    response = await response.json()
    response = response["subsonic-response"]
    if (!response) return null
    if (!response.nowPlaying) return null
    if (!response.nowPlaying.entry) return []
    let out = []
    for (let i = 0; i < response.nowPlaying.entry.length; i++) {
        let entry = response.nowPlaying.entry[i]
        out[i] = []
        out[i][0] = entry
        out[i][1] = entry.title
        out[i][2] = entry.artist
        out[i][3] = entry.album
        let art_url = api_url.replace("%e", "getCoverArt") + "&id=" + entry.coverArt
        out[i][4] = art_url
    }
    return out
}

const htmlWrapper = `
<div class="subsonic-song-container" style="background-image: url(%cover_art);">
    <div class="subsonic-background">
        <p style="font-size:16px;"><b>%title</b></p>
        <p>%artist</p>
        <p>%album</p>
    </div>
</div>
`