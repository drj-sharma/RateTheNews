var express = require("express");
var cors = require("cors");
const path = require("path");
const { format } = require("util");
var bodyparser = require("body-parser");
var admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
var app = express();
("use strict");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
const storage = new Storage({
  projectId: "ratethenews-20e78",
  keyFilename: path.join(__dirname, "./ratethenews-20e78-aa1bc0399669.json"),
});
const bucketref = storage.bucket("ratethenews-20e78.appspot.com");
var serviceAccount = require("./ratethenews-20e78-firebase-adminsdk-fe5k4-741d5391f5.json");

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
          helpful: doc.data().helpful,
          totalvotes: doc.data().totalvotes,
          reviewid: doc.id,
          uservote: null,
          voteid: null
        });
        console.log(data);
      });
      res.send(data);
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
});
// fetch show
app.get("/fetchshows", (req, res) => {
  let data = [];
  db.collection("news-shows")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        data.push({
          title: doc.data().title,
          rating: doc.data().rating,
          poster: doc.data().poster,
          avgrating: doc.data().avgrating,
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
/** fetch articles
 * @return (articles: JSON)
 */
app.get("/fetchArticles", (req, res) => {
  let data = [];
  db.collection("articles")
    .orderBy('votes', "desc")
    .orderBy('time','desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log("Doc Id:", doc.id);
        data.push({
          docId: doc.id,
          title: doc.data().title,
          time: doc.data().time,
          votes: doc.data().votes,
          uid: doc.data().uid,
        });
        console.log(data);
      });
      res.send(data);
    })
    .catch((e) => console.error("Errow While Fetching Articles", e));
});

app.get("/fetchArticlesbynew", (req, res) => {
  let data = [];
  db.collection("articles")
    .orderBy('time','desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log("Doc Id:", doc.id);
        data.push({
          docId: doc.id,
          title: doc.data().title,
          time: doc.data().time,
          votes: doc.data().votes,
          uid: doc.data().uid,
        });
        console.log(data);
      });
      res.send(data);
    })
    .catch((e) => console.error("Errow While Fetching Articles", e));
});
// editorjs image uploader
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
// editorjs link previewer
app.get("/fetchUrl", async (req, res) => {
  let url = req.query.url;
  let resHTML = await fetch(new URL(url)).catch((e) => console.log(e));
  const html = await resHTML.text();
  const $ = cheerio.load(html);
  // custom meta-tag function
  const getMetaTag = (value) => {
    return (
      $(`meta[name=${value}]`).attr("content") ||
      $(`meta[property="og:${value}"]`).attr("content") ||
      $(`meta[property="twitter:${value}"]`).attr("content")
    );
  };
  const resi = {
    success: 1,
    meta: {
      title: $("title").first().text(),
      description: getMetaTag("description"),
      image: {
        url: getMetaTag("image"),
      },
    },
  };
  res.send(resi);
  return;
});
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
/**
 * @params (uid, showId)
 * @return (show rating of showId of the requested user uid)
 **/
app.get("/getMyRating", (req, res) => {
  id = "";
  data = [];
  const query = req.query.query;
  const i = query.indexOf("-");
  const showId = query.substring(0, i);
  const uid = query.substring(i + 1);
  db.collection("show-ratings")
    .where("showid", "==", showId)
    .where("user", "==", uid)
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        data.push(doc.data());
        id = doc.id;
      });
    })
    .then(() => data.push(id))
    .then(() => res.send(data))
    .catch((e) => console.error(e));
});

app.get("/getRatedTvShowsByUid", (req, res) => {
  const data = [];
  const uid = req.query.id;
  db.collection("show-ratings")
    .where("user", "==", uid)
    .get()
    .then((snapShot) => {
      snapShot.forEach((doc) => {
        data.push(doc.data());
      });
    })
    .then(() => res.send(data))
    .catch((e) => console.log(e));
});

app.get("/getShowById", (req, res) => {
  const id = req.query.id;
  db.collection("news-shows")
    .doc(id)
    .get()
    .then((doc) => {
      const data = doc.data();
      data["showID"] = doc.id;
      res.send(data);
    })
    .catch((e) => console.error(e));
});

const PORT = process.env.port || 3000;

app.listen(PORT, () => console.log(`Node.js server is running on ${PORT}`));
