var express = require("express");
var bodyparser = require("body-parser");
var admin = require("firebase-admin");
var app = express();
app.use(bodyParser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var serviceAccount = require("./ratethenews-20e78-firebase-adminsdk-fe5k4-741d5391f5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ratethenews-20e78.firebaseio.com",
});
// database initialize
const db = admin.firestore();

// request apis
