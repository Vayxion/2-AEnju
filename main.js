const flap = document.getElementById("flap");
const paper = document.getElementById("paper");
const transition = document.getElementById("transition");

let dragging = false;
let startY = 0;
let opened = false;

// Only the envelope page (index.html) has these elements.
// Guard so this doesn't crash — and block the rest of this
// script — on every other page that loads main.js.
if (flap) {

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

}

// ============================================================
// PAGE TRANSITION — matches index.html / mission.html
// ============================================================

const pageTransition = document.getElementById("page-transition");
const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (pageTransition) {

    setTimeout(() => {

        void pageTransition.offsetWidth;

        pageTransition.classList.remove("covered");
        pageTransition.classList.add("arrival");

        setTimeout(() => {

            pageTransition.classList.remove("arrival");
            pageTransition.setAttribute("aria-hidden", "true");

        }, reducedMotion ? 40 : 940);

    }, reducedMotion ? 24 : 128);

}

function navigateWithTransition(url) {

    if (!pageTransition) {
        window.location.href = url;
        return;
    }

    pageTransition.classList.remove("arrival", "covered");
    pageTransition.classList.add("active");
    pageTransition.setAttribute("aria-hidden", "false");

    setTimeout(() => {
        window.location.href = url;
    }, reducedMotion ? 40 : 920);

}

// ============================================================
// CASE FILE / ENDING TRACKER
// ============================================================

const TOTAL_ENDINGS = 4;
const STORAGE_KEY = "recoveredEndings";

// ------------------------------------------------------------
// Storage helpers
// ------------------------------------------------------------

function getRecoveredEndings() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved
            .map(Number)
            .filter(
                number =>
                    Number.isInteger(number) &&
                    number >= 1 &&
                    number <= TOTAL_ENDINGS
            );

    } catch (error) {
        console.error("Could not read recovered endings:", error);
        return [];
    }
}

function saveRecoveredEndings(endings) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            [...new Set(endings)].sort((a, b) => a - b)
        )
    );
}

// ------------------------------------------------------------
// Unlock an ending
// ------------------------------------------------------------

function unlockEnding(number) {

    number = Number(number);

    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > TOTAL_ENDINGS
    ) {
        return;
    }

    const endings = getRecoveredEndings();

    if (!endings.includes(number)) {
        endings.push(number);
        saveRecoveredEndings(endings);
    }
}

// ------------------------------------------------------------
// Unlock a case-file box
// ------------------------------------------------------------

function renderEnding(number) {

    const box = document.getElementById(`ending${number}`);

    if (!box) return;

    const endings = getRecoveredEndings();
    const unlocked = endings.includes(number);

    if (unlocked) {

        box.classList.remove("locked");
        box.classList.add("unlocked");

        box.innerHTML = `
            <a href="ending${number}.html"
               aria-label="エンディング${number}を開く">

                <span class="tab">
                    FILE 0${number}
                </span>

                <span class="label">
                    エンディング${number}
                </span>

                <span class="status recovered">
                    回収済み
                </span>

            </a>
        `;

    } else {

        box.classList.remove("unlocked");
        box.classList.add("locked");

        box.innerHTML = `
            <span class="tab">
                FILE 0${number}
            </span>

            <span class="lockline"></span>
            <span class="lockline"></span>

            <span class="status">
                未開封
            </span>
        `;
    }
}

// ------------------------------------------------------------
// Update all six files
// ------------------------------------------------------------

function renderArchive() {

    for (let number = 1; number <= TOTAL_ENDINGS; number++) {
        renderEnding(number);
    }

    updateProgress();
}

// ------------------------------------------------------------
// Progress counter
// ------------------------------------------------------------

function updateProgress() {

    const progressText =
        document.getElementById("progress-text");

    if (!progressText) return;

    const count = getRecoveredEndings().length;

    progressText.textContent =
        `RECOVERED: ${count} / ${TOTAL_ENDINGS}`;

    if (count === TOTAL_ENDINGS) {
        progressText.classList.add("complete");
    } else {
        progressText.classList.remove("complete");
    }
}

// ------------------------------------------------------------
// Reset button
// ------------------------------------------------------------

const resetButton =
    document.getElementById("reset-progress");

if (resetButton) {

    resetButton.addEventListener("click", () => {

        const confirmed = confirm(
            "すべての回収記録を削除しますか？"
        );

        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);

        renderArchive();
    });
}

// ------------------------------------------------------------
// Initial render
// ------------------------------------------------------------

renderArchive();

const backHomeButton = document.getElementById("back-home");

if (backHomeButton) {
    backHomeButton.addEventListener("click", () => {
        navigateWithTransition("index.html");
    });
}

const cursor = document.createElement("span");
cursor.className = "typing-cursor";
cursor.textContent = "▋";
terminal.appendChild(cursor);