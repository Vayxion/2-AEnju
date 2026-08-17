const flap = document.getElementById("flap");
const paper = document.getElementById("paper");
const transition = document.getElementById("transition");

let dragging = false;
let startY = 0;
let opened = false;

flap.addEventListener("pointerdown", (e) => {

    if (opened) return;

    dragging = true;
    startY = e.clientY;

    flap.setPointerCapture(e.pointerId);
});

flap.addEventListener("pointermove", (e) => {

    if (!dragging || opened) return;

    let distance = startY - e.clientY;

    distance = Math.max(0, distance);

    let angle = distance * 1.2;
    angle = Math.min(angle, 130);

    flap.style.transform = `rotateX(${angle}deg)`;

    if (angle >= 120) {

        opened = true;
        dragging = false;

        flap.style.transform = "rotateX(130deg)";

        // Slide paper out
        paper.classList.add("out");

        // Fade screen after paper finishes moving
        setTimeout(() => {

            transition.classList.add("show");

        }, 800);

        // Go to next page
        setTimeout(() => {

            window.location.href = "page1.html";

        }, 2200);

    }

});

flap.addEventListener("pointerup", () => {

    dragging = false;

});