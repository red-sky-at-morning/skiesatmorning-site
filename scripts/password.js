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
                        switch(type[0]) {
                            case "redirect":
                                window.location.replace("/"+type[1])
                            case "alert":
                                alert(type[1].replace("_", " "))
                            case "default":
                                console.log("unexpected password field type")
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