const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sos = functions.https.onRequest(async (req, res) => {
const { lat, lng, time } = req.body;

await admin.firestore().collection("sos").add({
lat,
lng,
time,
active: true,
});

// TODO: Find nearby users & send notifications
res.send({ status: "SOS SENT" });
});

admin.messaging().sendToTopic("nearby", {
notification: {
title: "🚨 SOS ALERT",
body: "Someone near you needs help",
},
})