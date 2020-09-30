import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from "firebase/app";

@Component({
  selector: 'app-loginsignup',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hide = true;
  email: string = '';
  password: string = '';

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }
  login(){
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(){
      
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
  });
  }

}
