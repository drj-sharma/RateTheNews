import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WriteReviewComponent } from '../write-review/write-review.component';
import { LoginComponent } from 'src/app/login/login.component';
import * as firebase from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-review-comp',
  templateUrl: './review-comp.component.html',
  styleUrls: ['./review-comp.component.scss'],
})
export class ReviewCompComponent implements OnInit {
  reviews: any[] = [];
  @Input() id: string;
  @Input() myReviewId: string;
  @Input() myRatingObj: any[];
  users: any[] = [];
  curruser: string;
  increment = firebase.firestore.FieldValue.increment(1);
  decrement = firebase.firestore.FieldValue.increment(-1);
  wait = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.fetchcurruserid();
    this.getreviews();
  }

  fetchcurruserid() {
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

  openDialog() {
    const user = firebase.auth().currentUser;

    if (user !== null) {
      const dialogRef = this.dialog.open(WriteReviewComponent, {
        data: {
          dataKey: this.id,
          myReviewId: this.myReviewId,
          myRatingObj: this.myRatingObj
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    } else {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to write review', 'OKAY');
    }
  }

 async getreviews() {
    const parent = this;
   await this.http
      .put(
        'http://localhost:3000/fetchreviews',
        { showid: this.id },
        { responseType: 'json' }
      )
      .subscribe((response: any[]) => {
        this.reviews = response;

        Object.keys(this.reviews).forEach((key) => {
          const docRef = parent.db
            .collection('users')
            .doc(parent.reviews[key].user);
          console.log(docRef);
          docRef
            .get()
            .toPromise()
            .then((doc) => {
              if (doc.exists) {
                parent.reviews[key].user = doc.data().displayName;
              } else {
                // doc.data() will be undefined in this case
                console.log('No such document!');
              }
            })
            .catch((error) => {
              console.log('Error getting document:', error);
            });


            parent.db
            .collection('show-ratings')
            .doc(parent.reviews[key].reviewid)
            .collection('votes', (ref) => ref.where('uid', '==', this.curruser))
            .get()
            .toPromise()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(this.curruser);
                console.log(doc.data());
                parent.reviews[key].uservote = doc.data().vote;
                parent.reviews[key].voteid = doc.id
              });
            });
        });
      });



  }

  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }

  helpful(reviewid,uservote,voteid){
    var parent = this;
    this.wait = true;
    if (this.curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      var index = this.reviews.findIndex((obj) => obj.reviewid === reviewid);
      if (uservote == null){
        this.db
          .collection('show-ratings')
          .doc(reviewid)
          .collection('votes')
          .add({
            uid: parent.curruser,
            vote: true,
          }).then(function (docRef) {
              parent.reviews[index].uservote = true;
              parent.reviews[index].voteid = docRef.id;
              console.log(parent.reviews)
              parent.db
                .collection('show-ratings')
                .doc(reviewid)
                .update({
                  helpful: parent.increment,
                  totalvotes: parent.increment
                })
          }).then(function () {
            parent.reviews[index].helpful += 1;
            parent.reviews[index].totalvotes += 1;
            parent.wait = false
          })
      }
      else if(uservote == false){
        this.db
          .collection('show-ratings')
          .doc(reviewid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: true,
          }).then(function () {
              parent.reviews[index].uservote = true;
              parent.db
                .collection('show-ratings')
                .doc(reviewid)
                .update({
                  helpful: parent.increment
                })
          }).then(function () {
            parent.reviews[index].helpful += 1;
            parent.wait = false
          })
      }
      else{
        parent.wait = false
      }
    }
    
  }
  nothelpful(reviewid, uservote,voteid){
    var parent = this;
    this.wait = true;
    if (this.curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      var index = this.reviews.findIndex((obj) => obj.reviewid === reviewid);
      if (uservote == null){
        this.db
          .collection('show-ratings')
          .doc(reviewid)
          .collection('votes')
          .add({
            uid: parent.curruser,
            vote: false,
          }).then(function (docRef) {
              parent.reviews[index].uservote = false;
              parent.reviews[index].voteid = docRef.id;
              parent.db
                .collection('show-ratings')
                .doc(reviewid)
                .update({
                  totalvotes: parent.increment
                })
          }).then(function () {
            parent.reviews[index].totalvotes += 1;
            parent.wait = false
          })
      }
      else if (uservote == true){
        this.db
          .collection('show-ratings')
          .doc(reviewid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: false,
          }).then(function () {
            console.log('ds')
            parent.reviews[index].uservote = false;
              parent.db
                .collection('show-ratings')
                .doc(reviewid)
                .update({
                  helpful: parent.decrement
                })
          }).then(function () {
            parent.reviews[index].helpful -= 1;
            parent.wait = false
          })
      }
      else{
        parent.wait = false
      }
    }
  }
}
