// writing this myself because i cant think of a better way to do this <3

document.addEventListener("DOMContentLoaded", function () {
    let feedEl = document.getElementById("feed-container")

    let feed
    getFeed().then(
        function (value) {
            feed = formatData(value, feedEl)
            // feedEl.appendChild(feed)
        },
        function (error) {
            feed = getError(error)
            feedEl.appendChild(feed)
        }
    );
});

async function getPageDesc(page) {
    const post_limit = 30;
    const url = `https://pink.skiesatmorning.com/api/v1/accounts/B0cp25N1v9cXFm9cLw/statuses?limit=${post_limit}`
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const result = await response.json()
        return result

    } catch (error) {
        console.error(error.message)
        return error;
    }
}

const articleWrapper = `
<div class="article" style="width: 20vw">
    <div class="article-header">
        <div class="article-header-tab">
            %{article-title}
        </div>
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
    audio: "<audio src=$1 type=audio/$2>"
}

function formatData(data, feed) {
    if (!(data.constructor === Array)) {
        return getError("Got a response from api call that was not an array (we think)")
    }

    console.log(data)

    let htmlString = ""
    data.forEach(element => {
        let title = `<img src=${element.account.avatar} style="max-width:25px;max-height:25px;"><p><a href=${element.url} style="padding-vertical:-2px;">${element.account.display_name}</a></p>`
        let content = `<p>${element.content}</p>`
        let mediaString = ""
        if (element.media_attachments) {
            console.log(element.media_attachments)
            element.media_attachments.forEach(attachment => {
                let wrapper = mediaWrappers[attachment.type]
                wrapper = wrapper.replace("$1", attachment.url)
                if (attachment.type == "audio") {
                    wrapper = wrapper.replace("$2", attachment.meta.audio_encode)
                }
                mediaString = mediaString + wrapper
            })
        }

        htmlString = htmlString + articleWrapper.replace("%{article-title}", title).replace("%{article-content}", content + mediaString)
    });
    feed.innerHTML = htmlString
}

function getError(el) {
    return `<p>${el}</p>`
}