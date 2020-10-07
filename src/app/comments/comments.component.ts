import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  commentbox: string = '';
  replybox: string = '';
  comments: any[]=[];
  comment: any;
  public show:boolean = false;
  constructor(public dialog: MatDialog,private snackBar: MatSnackBar, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getComments();
    
  }
  onClick(){
    var user = firebase.auth().currentUser;

    if (user!= null) {
      var date = new Date();
      this.db.collection('comments').add( {uid: user.uid, comment: this.commentbox,time: date});
      this.commentbox = '';
      } else {
        const dialogRef2 = this.dialog.open(LoginComponent);

        dialogRef2.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        });
        this.openSnackBar('Login to comment', 'OKAY');

      }

  }
  getComments(){
    var parent = this;  
    this.db.collection("comments").get().toPromise().then( (querySnapshot) => {
      querySnapshot.forEach(function(doc) {
        parent.comments.push(doc.data());
        parent.comments[parent.comments.length-1].commentid = doc.id;
        parent.comments[parent.comments.length-1].replies = []
    });
    this.getuser();
    this.getreplies();
    this.addreply();

    }).catch( (error) => {
        console.log('Error getting document:', error);
    });
  }

  getuser(){
    var parent = this
    Object.keys(this.comments).forEach(function(key) {
        var docRef = parent.db.collection("users").doc(parent.comments[key].uid);
        docRef.get().toPromise().then(function(doc) {
            if (doc.exists) {;
              parent.comments[key].uid = doc.data().displayName;

            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
      });
  }

  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }

  toggle(com) {
    com.show = !com.show;
  }
  addreply(){
    this.comment = null;
    for (this.comment in this.comments){
      this.comment.show = this.show;
    }
  }
  onClickreply(com){
    var date = new Date();
    var user = firebase.auth().currentUser;

    if (user!= null) {
      this.db.collection('replies').add({reply: this.replybox,time: date, uid: user.uid,commentid: com.commentid})
    } else {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      });
      this.openSnackBar('Login to reply', 'OKAY');

    }
  }
  getreplies(){
    var parent = this;
    this.comments.forEach(function (arrayItem) {
      parent.db.collection("replies", ref => ref.where('commentid', '==', arrayItem.commentid)).get().toPromise().then( (querySnapshot) => {
      querySnapshot.forEach(function(doc) {
      arrayItem.replies.push({reply: doc.data().reply,uid: doc.data().uid,commentid: doc.data().commentid,time: doc.data().time});
      console.log(arrayItem)

      });

      }).catch( (error) => {
        console.log('Error getting document:', error);
    });

    });
    console.log(this.comments)
  }

}
