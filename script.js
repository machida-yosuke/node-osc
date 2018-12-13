var osc = require("node-osc");
var firebase = require("firebase");

var dt = Date.now();

var firebaseCongfig = {
  apiKey: "AIzaSyDC8mkz4ogcuBXg67n2dN4fEqvY2fH9Gsw",
  authDomain: "td-qiita-firebase.firebaseapp.com",
  databaseURL: "https://td-qiita-firebase.firebaseio.com",
  projectId: "td-qiita-firebase",
  storageBucket: "td-qiita-firebase.appspot.com",
  messagingSenderId: "338016839351"
};

var app = firebase.initializeApp(firebaseCongfig);
var oscClient = new osc.Client("localhost", 6000);
var messagesRef = app
  .database()
  .ref()
  .child("users");

messagesRef.on("child_added", function(snapshot) {
  var msg = snapshot.val();
  if (dt > msg.timestamp) {
    return;
  }
  console.log("追加されたぞ");

  oscClient.send("/", msg.url, msg.name, function() {
    // console.log(msg);
  });
});
