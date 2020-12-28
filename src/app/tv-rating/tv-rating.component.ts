import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WriteReviewComponent } from '../write-review/write-review.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tv-rating',
  templateUrl: './tv-rating.component.html',
  styleUrls: ['./tv-rating.component.scss'],
})
export class TvRatingComponent implements OnInit {
  state$: Observable<object>;
  vis = false;
  myRating: number;
  alreadyRated = false;
  constructor(
    public activatedRoute: ActivatedRoute,
    private db: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  anchor = '';
  timing = '5pm to 6pm';
  isHidden = false;
  sub: any;
  id: any;
  show: any[] = [];
  rating: number;
  @ViewChild('anchor') span: ElementRef;

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.id = params.id;
    });
    this.fetchdata();
    console.log(this.show);
    this.getMyRating();
  }
  open() {
    this.isHidden = !this.isHidden;
  }
  fetchdata() {
    const parent = this;
    const docRef = this.db.collection('news-shows').doc(this.id);
    docRef
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          parent.show.push(doc.data());
          console.log(parent.show);
          this.vis = true;
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
        }
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
  }
  toggle() {
    this.vis = true;
  }
  openDialog() {
    const user = firebase.auth().currentUser;

    if (user !== null) {
      const dialogRef = this.dialog.open(WriteReviewComponent, {
        data: {
          dataKey: this.id,
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
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
  async getMyRating() {
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = user.uid;
    this.http
      .get('http://localhost:3000/getMyRating?query=' + this.id + '-' + uid, {
        responseType: 'json',
      })
      .subscribe(
        (response: any[]) => {
          if (response.length >= 1) {
            this.alreadyRated = true;
            this.myRating = response[0].rating;
          }
        },
        (err) => console.log(err)
      );
  }
}
