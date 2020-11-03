import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from '../services/user.model';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-published-articles',
  templateUrl: './published-articles.component.html',
  styleUrls: ['./published-articles.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PublishedArticlesComponent implements OnInit {
  showSpinner = true;
  vis = false;
  article: any; // parent
  data: any; // child
  time: any; // child
  uid: string;
  articleRef: any;
  author: User;
  title: string;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.getArticles(params.id);
    });
  }
  async getArticles(article: string) {
    if (article === undefined) {
      this.vis = true;
      return;
    }
    const articleRef: AngularFirestoreDocument = this.afs
      .collection('articles')
      .doc(article);
    await articleRef
      .get()
      .toPromise()
      .then((doc) => {
        this.article = doc.data();
      });
    this.uid = this.article.uid;
    this.getUserByUID(this.uid);
    this.data = this.article.articleJSON;
    this.time = this.article.time;
    this.title = this.article.title;
    this.showSpinner = false;
  }
  async getUserByUID(uid: string) {
    this.http
      .get('http://localhost:3000/getUserByUid?uid=' + uid, {
        responseType: 'json',
      })
      .subscribe(
        async (res: User) => {
          this.author = res;
          console.log(this.author);
        },
        (err) => console.log(err)
      );
  }
  openComments(): void {
    this._bottomSheet.open(CommentsComponent);
  }
}
