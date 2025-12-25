let holdTimer = null;
let holdSeconds = 3;
let currentCount = holdSeconds;

const sosBtn = document.getElementById("sosBtn");
const countdownText = document.getElementById("countdownText");

function startHold() {
if (holdTimer) return;

sosBtn.classList.add("holding");
currentCount = holdSeconds;
countdownText.textContent = `Hold for ${currentCount}...`;

// Vibration feedback
if (navigator.vibrate) {
navigator.vibrate(200);
}

holdTimer = setInterval(() => {
currentCount--;
if (currentCount > 0) {
countdownText.textContent = `Hold for ${currentCount}...`;
if (navigator.vibrate) navigator.vibrate(100);
} else {
activateSOS();
cancelHold();
}
}, 1000);
}

function cancelHold() {
clearInterval(holdTimer);
holdTimer = null;
sosBtn.classList.remove("holding");
countdownText.textContent = "";
}

function activateSOS() {
countdownText.textContent = "🚨 SOS ACTIVATED";
startAlarm();
getLocation();
startRecording();
}

/* ---------- EXISTING SOS LOGIC ---------- */

function startAlarm() {
const alarm = document.getElementById("alarm");
alarm.play();
}

function getLocation() {
if (!navigator.geolocation) {
alert("Geolocation not supported");
return;
}

navigator.geolocation.getCurrentPosition(
(position) => {
const data = {
lat: position.coords.latitude,
lng: position.coords.longitude,
time: new Date().toISOString(),
};

sendSOS(data);
},
() => {
alert("Location access denied");
}
);
}

function sendSOS(data) {
fetch("https://YOUR_FIREBASE_FUNCTION_URL/sos", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
});
}

let mediaRecorder;
let audioChunks = [];

async function startRecording() {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
mediaRecorder = new MediaRecorder(stream);
mediaRecorder.start();

mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

mediaRecorder.onstop = () => {
const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
uploadAudio(audioBlob);
};

setTimeout(() => mediaRecorder.stop(), 60000);
}

function uploadAudio(blob) {
const formData = new FormData();
formData.append("file", blob);

fetch("https://YOUR_FIREBASE_FUNCTION_URL/upload", {
method: "POST",
body: formData,
});
}