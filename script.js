const micBtn = document.getElementById("micBtn");
const micText = document.getElementById("micText");
const userText = document.getElementById("userText");
const aiText = document.getElementById("aiText");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

/* 🎙 Click Speak */
micBtn.onclick = () => {
    micBtn.classList.add("listening");
    micText.innerText = "Listening...";
    recognition.start();
};

/* 🧠 When user finishes speaking */
recognition.onresult = async (event) => {
    const speech = event.results[0][0].transcript;
    userText.innerText = speech;

    // ⛔ Stop listening animation immediately
    micBtn.classList.remove("listening");
    micText.innerText = "Speak";

    const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speech })
    });

    const data = await response.json();
    aiText.innerText = data.reply;

    speak(data.reply);
};

/* 🔊 AI speaking */
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // When AI finishes speaking → ensure button is reset
    utterance.onend = () => {
        micBtn.classList.remove("listening");
        micText.innerText = "Speak";
    };

    speechSynthesis.speak(utterance);
}

/* ❌ If speech recognition errors */
recognition.onerror = () => {
    micBtn.classList.remove("listening");
    micText.innerText = "Speak";
};
/* 🌊 Inject waveform inside mic button (NO HTML changes) */
const waveform = document.createElement("div");
waveform.className = "waveform";

for (let i = 0; i < 4; i++) {
    const bar = document.createElement("span");
    waveform.appendChild(bar);
}

micBtn.insertBefore(waveform, micText);
