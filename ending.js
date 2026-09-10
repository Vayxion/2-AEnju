const endingNumber = Number(document.body.dataset.ending);

if (endingNumber >= 1 && endingNumber <= 4) {
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

document.addEventListener("DOMContentLoaded", () => {

    const terminal = document.getElementById("terminal");

    if (!terminal) return;

    const lines = Array.from(terminal.children);

    // Save the original text
    const dialogue = lines.map(line => ({
        element: line,
        text: line.textContent,
        isSpace: line.classList.contains("terminal-space")
    }));

    // Clear everything
    terminal.innerHTML = "";

    let lineIndex = 0;

    // Typing speed
    const typingSpeed = 35;

    // Delay between lines
    const lineDelay = 350;

    function typeLine() {

        if (lineIndex >= dialogue.length) {
            showReturnButton();
            return;
        }

        const current = dialogue[lineIndex];

        // Empty line
        if (current.isSpace) {

            const space = document.createElement("div");
            space.className = "terminal-space";

            terminal.appendChild(space);

            lineIndex++;

            setTimeout(typeLine, 100);
            return;
        }

        const line = document.createElement("div");
        terminal.appendChild(line);

        let characterIndex = 0;

        function typeCharacter() {

            if (characterIndex < current.text.length) {

                line.textContent += current.text.charAt(characterIndex);

                characterIndex++;

                setTimeout(typeCharacter, typingSpeed);

            } else {

                lineIndex++;

                setTimeout(typeLine, lineDelay);
            }
        }

        typeCharacter();
    }


    function showReturnButton() {

    // Add cursor to the very end of the report
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    cursor.textContent = "▋";

    terminal.appendChild(cursor);

    // Show return button
    const button = document.querySelector(".truereturn-container");

    if (button) {
        button.classList.add("visible");
    }
}


    // Start typing after a short delay
    setTimeout(typeLine, 1000);

});