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

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.getreviews();
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

  getreviews() {
    const parent = this;
    this.http
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
        });
      });
  }

  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
}
