import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { LoginComponent } from 'src/app/login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { User } from '../services/user.model';

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
  votes: number;
  title: string;
  articleID: string;
  increment = firebase.firestore.FieldValue.increment(1);
  decrement = firebase.firestore.FieldValue.increment(-1);
  increment2 = firebase.firestore.FieldValue.increment(2);
  decrement2= firebase.firestore.FieldValue.increment(-2);
  wait = false;
  curruser: string;
  uservote = 0;
  voteid:string = null;


  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private http: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.fetchcurruserid();
    this.route.params.subscribe((params) => {
      this.getArticles(params.id);
      this.articleID = params.id;
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
    await articleRef.collection('votes', (ref) => ref.where('uid','==',this.curruser))
    .get().toPromise().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.uservote = doc.data().vote;
        this.voteid = doc.id;
      })
    })

    this.uid = this.article.uid;
    this.getUserByUID(this.uid);
    this.data = this.article.articleJSON;
    this.time = this.article.time;
    this.title = this.article.title;
    this.votes = this.article.votes;
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
  scrollToEnd(element: any): void {
    console.log(element);
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  fetchcurruserid(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.curruser = user['uid'];
      } else {
        // No user is signed in.
        this.curruser = null;
      }
    });
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }

  upvote(){
    var vote = this.uservote == 1 ? 0 : 1;
    var parent = this;
    this.wait = true;
    var curruser = this.curruser;
    if(curruser == null){
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    }
    else{
    if (this.voteid != null){
      console.log('yes')
      this.afs.collection('articles').doc(this.articleID).collection('votes').doc(this.voteid).update({
        vote: vote
      }).then(function(docRef) {
        console.log(parent.wait);
        if (parent.uservote == 0){
          console.log(parent.wait);
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.increment 
          }).then(function(docRef) {
          parent.votes =parent.votes+ 1
          parent.wait = false;
          parent.uservote = vote;
          })
        }
        else if(parent.uservote == 1){
          console.log(parent.wait);
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.decrement 
          }).then(function(docRef) {
          parent.votes =parent.votes- 1
          parent.wait = false;
          parent.uservote = vote;
          })
        }
        else if(parent.uservote == -1){
          console.log(parent.wait);
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.increment2 
          }).then(function(docRef) {
          parent.votes =parent.votes+ 2
          parent.wait = false;
          parent.uservote = vote;
          })
        }
      })
    }else{
      this.afs.collection('articles').doc(this.articleID).collection('votes').add({
        uid: curruser,
        vote: vote
      }).then(function(docRef) {
        parent.voteid = docRef.id
        if (parent.uservote == 0){
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.increment 
          }).then(function(docRef) {
          parent.votes = parent.votes +1
          parent.wait = false;
          parent.uservote = vote;
          })
        }
        else if(parent.uservote == 1){
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.decrement 
          }).then(function(docRef) {
          parent.votes = parent.votes -1
          parent.wait = false;
          parent.uservote = vote;
          })
        }
        else if(parent.uservote == -1){
          parent.afs.collection('articles').doc(parent.articleID).update({
            votes: parent.increment2
          }).then(function(docRef) {
          parent.votes = parent.votes +2
          parent.wait = false;
          parent.uservote = vote;
          })
        }
      })
  }}
}
  downvote(){
    var vote = this.uservote == -1 ? 0 : -1;
    var parent = this;
    this.wait = true
     var curruser = this.curruser;
      if(curruser == null){
        const dialogRef2 = this.dialog.open(LoginComponent);

        dialogRef2.afterClosed().subscribe((result) => {
          console.log('The dialog was closed');
        });
        this.openSnackBar('Login to vote', 'OKAY');
      }
      else{
        if (this.voteid != null){
          console.log('yes')
          this.afs.collection('articles').doc(this.articleID).collection('votes').doc(this.voteid).update({
            vote: vote
          }).then(function(docRef) {
            console.log(parent.wait);
            if (parent.uservote == 0){
              console.log(parent.wait);
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.decrement 
              }).then(function(docRef) {
              parent.votes =parent.votes - 1
              parent.wait = false;
              parent.uservote = vote;
              })
            }
            else if(parent.uservote == 1){
              console.log(parent.wait);
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.decrement2
              }).then(function(docRef) {
              parent.votes =parent.votes- 2
              parent.wait = false;
              parent.uservote = vote;
              })
            }
            else if(parent.uservote == -1){
              console.log(parent.wait);
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.increment
              }).then(function(docRef) {
              parent.votes =parent.votes+ 1
              parent.wait = false;
              parent.uservote = vote;
              })
            }
          })
        }else{
          this.afs.collection('articles').doc(this.articleID).collection('votes').add({
            uid: curruser,
            vote: vote
          }).then(function(docRef) {
            parent.voteid = docRef.id
            if (parent.uservote == 0){
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.decrement 
              }).then(function(docRef) {
              parent.votes = parent.votes -1
              parent.wait = false;
              parent.uservote = vote;
              })
            }
            else if(parent.uservote == 1){
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.decrement2 
              }).then(function(docRef) {
              parent.votes = parent.votes -2
              parent.wait = false;
              parent.uservote = vote;
              })
            }
            else if(parent.uservote == -1){
              parent.afs.collection('articles').doc(parent.articleID).update({
                votes: parent.increment
              }).then(function(docRef) {
              parent.votes = parent.votes +1
              parent.wait = false;
              parent.uservote = vote;
              })
            }
          })
      }}
  }


}
