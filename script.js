var osc = require("node-osc");
var firebase = require("firebase");
var config = require("./config.js");

var firebaseConfig = config.config;
var dt = Date.now();

var app = firebase.initializeApp(firebaseConfig);
var oscClient = new osc.Client("localhost", 6000);
var messagesRef = app
  .database()
  .ref()
  .child("users");

messagesRef.on("child_added", function(snapshot) {
  var msg = snapshot.val();
  if (dt > msg.time) {
    return;
  }
  console.log("追加されたぞ", msg);
  oscClient.send("/", msg.url, msg.name, function() {});
});
