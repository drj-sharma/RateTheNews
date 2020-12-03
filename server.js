var express = require("express");
var cors = require("cors");
const path = require("path");
const { format } = require("util");
var bodyparser = require("body-parser");
var admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
const storage = new Storage({
  projectId: "ratethenews-20e78",
  keyFilename: path.join(__dirname, "./ratethenews-20e78-aa1bc0399669.json"),
});
console.log(__dirname);
const bucketref = storage.bucket("ratethenews-20e78.appspot.com");
var serviceAccount = require("./ratethenews-20e78-firebase-adminsdk-fe5k4-741d5391f5.json");
const { resolve } = require("path");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ratethenews-20e78.firebaseio.com",
});
// database initialize
const db = admin.firestore();
var ref = db.collection("news-shows");
const userRef = db.collection("users");
var articleRef = db.collection("articles");
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

app.put("/submitshow", (req, res) => {
  console.log(req.body);
  var data = {
    title: req.body.title,
    tv_channel: req.body.tv_channel,
    anchor: req.body.anchor,
    timings: req.body.timings,
    length: req.body.length,
  };
  ref.doc(req.body.title).set(data);
});

app.put("/fetchreviews", (req, res) => {
  data = [];
  db.collection("show-ratings")
    .where("showid", "==", req.body.showid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        data.push({
          title: doc.data().title,
          content: doc.data().content,
          user: doc.data().user,
          rating: doc.data().rating,
        });
        console.log(data);
      });
      res.send(data);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
});

app.get("/fetchshows", (req, res) => {
  data = [];
  db.collection("news-shows")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        data.push({
          title: doc.data().title,
          rating: doc.data().rating,
          poster: doc.data().poster,
          id: doc.id,
          image: "",
        });
        console.log(data);
      });
      res.send(data);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
});
app.post("/image-upload", upload.single("image"), (req, res) => {
  const file = req.file;
  if (file) {
    uploadImageToStorage(file)
      .then((data) => {
        res.send({
          success: 1,
          file: {
            url: data,
          },
        });
      })
      .catch((e) => console.log(e));
  }
});
async function uploadImageToStorage(imageFile) {
  console.log(imageFile);
  return new Promise((resolve, reject) => {
    if (!imageFile) {
      reject("No image file");
      return;
    }
    let newFileName = Date.now() + "-" + imageFile.originalname;
    let fileUpload = bucketref.file(newFileName);
    const blobStream = fileUpload.createWriteStream({
      resumable: false,
      gzip: true,
    });
    blobStream.on("error", (error) => {
      console.error(error);
    });
    blobStream.on("finish", () => {
      const url = format(
        `http://storage.googleapis.com/${bucketref.name}/${fileUpload.name}`
      );
      resolve(url);
      console.log("Uploaded Successfully");
    });
    blobStream.end(imageFile.buffer);
  });
}
// get user data by UID
app.get("/getUserByUid", (req, res) => {
  userRef
    .doc(req.query.uid)
    .get()
    .then((val) => res.send(val.data()))
    .catch((e) => {
      console.log(e);
    });
});
app.get("/getArticleHeadings", (req, res) => {
  articleRef
    .doc(req.query.article)
    .get()
    .then((val) => res.send(val.data()))
    .catch((e) => console.log(e));
});
// request apis

app.listen(3000, () => console.log("Node.js server is running on port 3000"));
