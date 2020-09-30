import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import { AngularFirestore } from '@angular/fire/firestore';

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

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
  }

 
  onsignup(){
    var parent= this
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('User Logged Out!');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(function(){
      parent.updateUser(); 
    }).catch(function(error) {
      var errorCode = error.code;
      parent.errorMessage = error.message;
      
    });
  }
  updateUser() {
    var parent =this;
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code; 
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
  });
    var user = firebase.auth().currentUser;user.updateProfile({
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
    });
    
      
    
  }

}
