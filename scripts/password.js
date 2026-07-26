document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.getElementsByClassName("password-entry");
    const encoder = new TextEncoder

    readyInputs(inputs, encoder)
});

function readyInputs(inputs, encoder) {
    fetch("/scripts/meta/hashes.json").then(x => x.json()).then(data => {
        let hashes = data;
        for (var i = 0; i < inputs.length; i++) {
            let input = inputs[i]
            input.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    // console.log(input.classList)
                    let classes = input.classList
                    let index = parseInt(classes[1].replace("idx-", ""))
                    if (index === NaN) {
                        index = 0;
                    }
                    let val = input.value

                    let type = classes[2].split("-")

                    checkHash(val, hashes[index], encoder).then((result) => {
                        // console.log(result)
                        if (!result) {
                            return
                        }
                        switch (type[0]) {
                            case "redirect":
                                window.location = ("/" + type[1])
                                break
                            case "redirect_secure":
                                // let x = document.cookie
                                let uuid = getCookie("uuid")
                                if (!uuid) {
                                    uuid = window.crypto.randomUUID()
                                    setCookie("uuid", uuid, 7)
                                }
                                // console.log(document.cookie)
                                let hash = stringToInt(type[1].replace(".html", "")) * stringToInt(uuid)
                                // alert(type[1].replace(".html", "") + " " + uuid + ": " + hash)
                                setCookie("hash", hash, 7)
                                // console.log(hash)
                                window.location = ("/"+type[1])
                                break
                            case "alert":
                                alert(type[1].replace("_", " "))
                                break
                            case "default":
                                console.log("unexpected password field type")
                                break
                        }
                    }
                    )
                }
            }
            )
        }
    });
}

async function checkHash(val, hash, encoder) {
    let data = encoder.encode(val)
    let newHash = await window.crypto.subtle.digest("SHA-512", data)
    let hashHex = new Uint8Array(newHash).toHex()

    return (hashHex === hash)
}


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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