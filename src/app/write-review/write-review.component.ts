import { Component, OnInit, Inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { reviews } from '../models/reviews';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase/app';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss'],
})
export class WriteReviewComponent implements OnInit {
  reviewsCollection: AngularFirestoreCollection<reviews>;
  date = new Date();
  strating: string;
  revs: reviews = {
    title: '',
    content: '',
    user: '',
    rating: 0,
    helpful: 0,
    nothelpful: 0,
    time: this.date,
    showid: '',
  };

  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.reviewsCollection = this.afs.collection('show-ratings');
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }

  ngOnInit(): void {
    console.log(this.data);
  }
  submitReview(revs: reviews) {
    const user = firebase.auth().currentUser;
    revs.user = user.uid;
    revs.showid = this.data.dataKey;
    const myReviewId = this.data.myReviewId;
    revs.rating = parseFloat(this.strating);
    console.log(revs);
    if (myReviewId === undefined) {
      this.reviewsCollection.add(revs);
    } else {
      this.reviewsCollection.doc(myReviewId).set(revs, { merge: true });
    }
    const docRef = this.afs.collection('news-shows').doc(revs.showid);
    docRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          const newNumRatings = parseInt(doc.data().numrating + 1);

          const oldRatingTotal = doc.data().avgrating * doc.data().numrating;
          console.log(oldRatingTotal);
          const newAvgRating = parseFloat(
            ((oldRatingTotal + revs.rating) / newNumRatings).toFixed(1)
          );
          docRef.update({ avgrating: newAvgRating, numrating: newNumRatings });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      })
      .finally(() => {
        window.location.reload();
      });
    this.openSnackBar('Rating Added Successfully', 'OKAY');
    this.clearFields();
  }
  clearFields() {
    this.revs = {};
  }
}
