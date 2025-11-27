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

async function getFeed() {
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
<div class="article" style="width: 23vw">
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

function formatData(data, feed) {
    if (!(data.constructor === Array)) {
        return getError("Got a response from api call that was not an array (we think)")
    }

    console.log(data)

    let title = `<p><a href=${data[0].url}>${data[0].account.display_name}</a></p>`
    let content = `<p>${data[0].content}</p>`
    let htmlString = articleWrapper.replace("%{article-title}", title).replace("%{article-content}", content)
    feed.innerHTML = htmlString
}

function getError(el) {
    return `<p>${el}</p>`
}