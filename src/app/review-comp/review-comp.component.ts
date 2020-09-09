import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {WriteReviewComponent} from '../write-review/write-review.component'

@Component({
  selector: 'app-review-comp',
  templateUrl: './review-comp.component.html',
  styleUrls: ['./review-comp.component.scss']
})
export class ReviewCompComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(WriteReviewComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
