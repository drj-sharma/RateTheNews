import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-articles',
  templateUrl: './your-articles.component.html',
  styleUrls: ['./your-articles.component.scss'],
})
export class YourArticlesComponent implements OnInit {
  vis = false;
  article: any;
  articleMap = new Map();
  data: any;
  time: any;
  uid: string;
  articleRef: any;
  articlesID: string[];

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient
  ) {
    this.articleRef = this.afs.collection('articles');
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.getArticles(this.uid);
      } else {
        this.uid = null;
      }
    });
  }

  ngOnInit(): void {}
  async getArticles(uid: string) {
    const userRef: AngularFirestoreDocument = this.afs
      .collection('users')
      .doc(uid);
    await userRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.data().articles.length === 0) {
          this.vis = true;
          return;
        }
        this.articlesID = doc.data().articles;
        this.getArticleHeadingWithDate(this.articlesID);
      });
    if (this.articlesID === undefined) {
      return;
    }
    const articleRef: AngularFirestoreDocument = this.afs
      .collection('articles')
      .doc(this.articlesID[0]);
    await articleRef
      .get()
      .toPromise()
      .then((doc) => {
        this.article = doc.data();
      });
    this.data = this.article.articleJSON;
    this.time = this.article.time;
  }
  viewArticle(article: string) {
    this.router.navigate(['published', article]);
  }
  goToArticle() {
    this.router.navigate(['article']);
  }
  async getArticleHeadingWithDate(articlesID: string[]) {
    console.log(this.articlesID); 
    for (const article of articlesID) {
      this.http
        .get('http://localhost:3000/getArticleHeadings?article=' + article, {
          responseType: 'json',
        })
        .subscribe(
          async (res) => (this.articleMap.set(article, res)),
          (err) => console.log(err)
        );
    }
    console.log(this.articleMap);
  }
}
