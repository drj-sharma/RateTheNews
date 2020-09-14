import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {WriteReviewComponent} from '../write-review/write-review.component'
import { LoginComponent } from 'src/app/login/login.component';
import * as firebase from "firebase/app";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-review-comp',
  templateUrl: './review-comp.component.html',
  styleUrls: ['./review-comp.component.scss']
})
export class ReviewCompComponent implements OnInit {
  a =false;

  constructor(public dialog: MatDialog,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
  
  openDialog(){
    var user = firebase.auth().currentUser;

    if (user!= null) {
        const dialogRef = this.dialog.open(WriteReviewComponent);

        dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        });
      } else {
        const dialogRef2 = this.dialog.open(LoginComponent);

        dialogRef2.afterClosed().subscribe(result => {
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
}
