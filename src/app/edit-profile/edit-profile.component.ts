import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  date: any;
  minDate = new Date(1990, 0, 1);
  userData: User;
  uid: string;
  gender: string;
  constructor(private dialogRef: MatDialog, private auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
    return this.fetchUser();
  }
  fetchUser() {
    this.userData = JSON.parse(localStorage.getItem('user'));
    this.uid = this.userData['uid'];
    this.userData.dob = Date.parse(this.userData.dob).toString();
    if (this.userData.gender === undefined) {
      this.userData.gender = 'M';
    }
    this.date = Date.parse(this.userData.dob);
  }
  upload() {
    const userRef: AngularFirestoreDocument<User> = this.afs.collection('users').doc(this.uid);
    const data = {
      uid: this.userData.uid,
      displayName: this.userData.displayName,
      email: this.userData.email,
      dob: this.userData.dob,
      gender: this.userData.gender,
      photoURL: this.userData.photoURL
    };
    return userRef.set(data, { merge: true });
  }
}
