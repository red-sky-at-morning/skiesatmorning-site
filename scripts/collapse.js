document.addEventListener("DOMContentLoaded", function () {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display !== "none") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }

            let inner = this.innerHTML + ""
            if (inner.includes("down")) {
                this.innerHTML = inner.replace("down", "up");
            } else {
                this.innerHTML = inner.replace("up", "down");
            }
        });
    }
});