import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';
  hide = true;
  errorMessage: string ='';

  constructor(private db: AngularFirestore, private angularfirebaseAuth: AngularFireAuth,
  private dialog: MatDialog) { }

  ngOnInit(): void {
  }


  onsignup(){
    //const parent= this
    /*firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('User Logged Out!');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });*/
    this.angularfirebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then(fireBaseUser => {
      this.updateUserProfile(fireBaseUser.user);
    }).then(userProfile =>{
      this.userLogin();
      this.dialog.closeAll();
    }).catch(error => {
      var errorCode = error.code;
      this.errorMessage = error.message;

    });
  }

  updateUserProfile(user) {
    return this.db.collection("users").doc(user.uid).set({
      displayName: this.username,
      email: user.email,
      role: 'registered_user',
      photoURL: user.photoURL,
      uid: user.uid
    });
  }

  userLogin() {
    this.angularfirebaseAuth.signInWithEmailAndPassword(this.email, this.password)
    .then(loggedInUser=> {
      sessionStorage.setItem("role", 'registered_user');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
  });
    /*var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: this.username
    }).then(function() {
      // Update successful.
      console.log('User Profile Updated Successfully');
      console.log(user.displayName);
      parent.db.collection("users").doc(user.uid).set({
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    }).catch(function(error) {
      // An error happened.
    });*/
  }

}
