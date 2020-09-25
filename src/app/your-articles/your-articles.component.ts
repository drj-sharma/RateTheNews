import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-articles',
  templateUrl: './your-articles.component.html',
  styleUrls: ['./your-articles.component.scss']
})
export class YourArticlesComponent implements OnInit {

  vis = false;
  article: any;
  data: any;
  time: any;
  uid: string;
  articleRef: any;
  articlesID: string[];

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private router: Router) {
    this.articleRef = this.afs.collection('articles');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.getArticles(this.uid);
      } else {
        this.uid = null;
      }
    });
  }

  ngOnInit(): void {
  }
  async getArticles(uid: string) {
    const userRef: AngularFirestoreDocument = this.afs.collection('users').doc(uid);
    await userRef.get().toPromise().then((doc) => {
      if (doc.data().articles.length === 0) {
        this.vis = true;
        return;
      }
      console.log(doc.data());
      this.articlesID = doc.data().articles;
      console.log(this.articlesID);
    });
    if (this.articlesID === undefined) {
      return;
    }
    const articleRef: AngularFirestoreDocument = this.afs.collection('articles').doc(this.articlesID[0]);
    await articleRef.get().toPromise().then((doc) => {
      this.article = doc.data();
    });
    this.data = this.article.articleJSON;
    this.time = this.article.time;
  }
  viewArticle(article: string) {
    console.log(article);
    this.router.navigate(['published', { id: article }]);
  }
  goToArticle() {
    this.router.navigate(['article']);
  }
}
