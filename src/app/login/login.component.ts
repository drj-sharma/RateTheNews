import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-loginsignup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  email: string = '';
  password: string = '';

  constructor(public auth: AuthService, private dialog: MatDialog, private db: AngularFirestore,
    private angularfirebaseAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }
  login(){
    this.angularfirebaseAuth.signInWithEmailAndPassword(this.email, this.password).then(loggedInUser => {
      this.userDetails(loggedInUser.user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
  });
  }

  async userDetails(user) {
    const userDoc: AngularFirestoreDocument = this.db
      .collection('users')
      .doc(user.uid);
    await userDoc
      .get()
      .toPromise()
      .then(doc => {
        const user = doc.data();
        console.log('logged in user', user);
        sessionStorage.setItem("role", user.role);
        this.dialog.closeAll();
      });
  }
}
