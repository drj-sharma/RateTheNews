import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          }
        })
      );
  }

  // googleSignin
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.updateUserData(credential.user);
    window.location.reload();
  }
  async facebookSignin() {
    const provider = new auth.FacebookAuthProvider();
    const credential = await this.afAuth.signInWithRedirect(provider);
    // return this.updateUserData(credential.user);
    // need to add privacy policy URL
  }
  // signout
  async signOut() {
    await this.afAuth.signOut()
    .then(() => {
        console.log('Signout successfully!');
        localStorage.removeItem('user');
        this.user$ = of(null);
      })
    .catch(() => {
      console.log('Error while signing out!');
    });
    this.router.navigate(['/']);
    window.location.reload();
    //return;
  }
  updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<User> = this.afs.collection('users').doc(user.uid);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      articles: []
    };
    localStorage.setItem('user', JSON.stringify(user));
    return userRef.set(data, { merge: true });
  }
}
