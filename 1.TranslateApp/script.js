const selectTag = document.querySelectorAll("select");
const translateBtn = document.querySelector("#transfer");
const fromText = document.querySelector("#fromText");
const toText = document.querySelector("#toText");
const icons = document.querySelectorAll("img");

selectTag.forEach((tag, id) => {
    for (const countriesCode in countries) {
        let selected;
        if (id == 0 && countriesCode == "en-GB") {
            selected = " selected";
        } else if (id == 1 && countriesCode == "hi-IN") {
            selected = " selected";
        }
        let option = `<option value="${countriesCode}" ${selected}>${countries[countriesCode]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

translateBtn.addEventListener("click", () => {
    let Text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;

    // Updated API URL with your API key
    let apiURL = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyD5VEc7BCMTrHj7dTM0E2ZaIP92Jk9m-wQ&q=${encodeURIComponent(Text)}&source=${translateFrom}&target=${translateTo}`;

    fetch(apiURL)
        .then(res => res.json())
        .then(data => {
            // Ensure to handle possible errors
            if (data && data.data && data.data.translations && data.data.translations.length > 0) {
                toText.value = data.data.translations[0].translatedText;
            } else {
                toText.value = "Translation error.";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            toText.value = "Error occurred while translating.";
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });
});
