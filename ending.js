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
