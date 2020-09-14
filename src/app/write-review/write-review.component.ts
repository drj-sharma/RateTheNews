import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { reviews } from '../models/reviews';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from "firebase/app";

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewComponent implements OnInit {
  reviewsCollection: AngularFirestoreCollection<reviews>;
  date = new Date();
  revs: reviews = {
    title: '',
    content: '',
    user: '',
    rating: 0,
    helpful: 0,
    nothelpful: 0,
    time: this.date,
    show:''
  };

  constructor(private afs: AngularFirestore, private snackBar: MatSnackBar) { 
    this.reviewsCollection = this.afs.collection('show-ratings');
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }

  ngOnInit(): void {
  }
  submitReview(revs: reviews) {
    var user = firebase.auth().currentUser;
    revs.user = user.uid;
    this.reviewsCollection.add(revs);
    this.openSnackBar('Rating Added Successfully', 'OKAY');
    this.clearFields();
  }
  clearFields() {
    this.revs = {};
  }


}
