const endingNumber = Number(document.body.dataset.ending);

if (endingNumber >= 1 && endingNumber <= 6) {
    const endings = JSON.parse(
        localStorage.getItem("recoveredEndings") || "[]"
    );

    if (!endings.includes(endingNumber)) {
        endings.push(endingNumber);

        localStorage.setItem(
            "recoveredEndings",
            JSON.stringify(endings)
        );
    }
}

// ------------------------------------------------------------
// Page transition — matches index.html / mission.html / main.js
// ------------------------------------------------------------

const transition = document.getElementById("page-transition");
const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (transition) {

    setTimeout(() => {

        void transition.offsetWidth;

        transition.classList.remove("covered");
        transition.classList.add("arrival");

        setTimeout(() => {

            transition.classList.remove("arrival");
            transition.setAttribute("aria-hidden", "true");

        }, reducedMotion ? 40 : 940);

    }, reducedMotion ? 24 : 128);

    const backLink = document.getElementById("back-to-archive");

    if (backLink) {

        backLink.addEventListener("click", (event) => {

            event.preventDefault();

            transition.classList.remove("arrival", "covered");
            transition.classList.add("active");
            transition.setAttribute("aria-hidden", "false");

            setTimeout(() => {
                window.location.href = backLink.href;
            }, reducedMotion ? 40 : 920);

        });

    }

}