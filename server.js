var express = require("express");
var bodyparser = require("body-parser");
var admin = require("firebase-admin");
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//for cors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
 });

var serviceAccount = require("./ratethenews-20e78-firebase-adminsdk-fe5k4-741d5391f5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ratethenews-20e78.firebaseio.com",
});
// database initialize
const db = admin.firestore();
var ref = db.collection('news-shows');
var storageRef = admin.storage();
console.log(storageRef);


app.put("/submitshow", (req, res) => {
  console.log(req.body);
  var data = {
    title: req.body.title,
    tv_channel: req.body.tv_channel,
    anchor: req.body.anchor,
    timings: req.body.timings,
    length: req.body.length
  }
  ref.doc(req.body.title).set(data);
});

// request apis

app.listen(3000, () => console.log('Node.js server is running on port 3000'))