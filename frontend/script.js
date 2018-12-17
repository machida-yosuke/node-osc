import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import config from "./config";
import "./style.scss";

firebase.initializeApp(config);
let filename;
let filetype;
let blob;
let inputValue;
const storageRef = firebase.storage().ref();
const databaseRef = firebase.database().ref("/users");

const reader = new FileReader();
const button = document.querySelector(".button");
const preview = document.querySelector(".imege-preview");
const imgaeInput = document.querySelector(".input-image input");

imgaeInput.addEventListener(
  "change",
  e => {
    const file = e.target.files[0];
    filename = file.name;
    filetype = file.type;
    reader.readAsDataURL(file);
  },
  false
);

reader.addEventListener(
  "load",
  () => {
    const ImageBase64 = reader.result;
    blob = toBlob(ImageBase64);
    preview.src = window.URL.createObjectURL(blob);
  },
  false
);

button.addEventListener(
  "click",
  () => {
    inputValue = document.querySelector(".input-text input").value;
    if (inputValue.length === 0 || !preview.src) {
      return;
    }
    postImage();
  },
  false
);

async function postImage() {
  const uploadRef = await storageRef.child(filename);
  const snapshot = await uploadRef.put(blob);
  const url = await uploadRef.getDownloadURL();
  const createdTime = Date.now();
  databaseRef.push({
    url,
    name: inputValue,
    time: createdTime
  });
}

function toBlob(base64) {
  var bin = atob(base64.replace(/^.*,/, ""));
  var buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  try {
    var blob = new Blob([buffer.buffer], {
      type: filetype
    });
  } catch (e) {
    return false;
  }
  return blob;
}
