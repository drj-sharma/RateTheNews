import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NewsShow } from '../models/NewsShow';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showCollection: AngularFirestoreCollection<NewsShow>;
  show: NewsShow = {
    title: '',
    description: '',
    tv_channel: '',
    anchor: '',
    timings: '',
    length: ''
  };
  constructor(private afs: AngularFirestore, private snackBar: MatSnackBar) {
    this.showCollection = this.afs.collection('news-shows');
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
  }
  submitShow(show: NewsShow) {
    this.showCollection.add(show);
    this.openSnackBar('Show Added Successfully', 'OKAY');
    this.clearFields();
  }
  clearFields() {
    this.show = {};
  }
}
