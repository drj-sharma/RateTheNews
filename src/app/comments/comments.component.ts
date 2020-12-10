import { Component, Inject, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  commentbox = '';
  replybox = '';
  comments: any[] = [];
  comment: any;
  i = 10;
  subscription;
  uservote=0;
  tempdate = new Date('July 21, 1993 01:15:00');

  public show = false;
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { articleID: string }
  ) {}

  ngOnInit(): void {
    this.getComments();
  }

  postComment() {
    const user = firebase.auth().currentUser;
    var parent = this;

    if (user !== null) {
      const date = new Date();
      this.db
        .collection('comments')
        .add({ uid: user.uid, comment: this.commentbox, time: date, articleID: this.data.articleID }).then(function(docRef) {
          console.log('jsnniiiu')
          parent.db.collection('votes').add({allvotes: []}).then(function(docRef2) {
            parent.db.collection('comments').doc(docRef.id).update({voteid: docRef2.id})
          });
      });
     
    } else {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to comment', 'OKAY');
    }
  }

  getComments() {
    const parent = this;
    console.log(this.i);
    this.db
      .collection('comments', (ref) =>
        ref.orderBy('time').where('articleID', '==', `${this.data.articleID}`).startAfter(this.tempdate).limit(this.i)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          parent.comments.push(doc.data());
          parent.comments[parent.comments.length - 1].commentid = doc.id;
          parent.comments[parent.comments.length - 1].replies = [];
          parent.comments[parent.comments.length - 1].loadrepliesvar = true;
          parent.comments[parent.comments.length - 1].tempreplydate = new Date(
            'July 21, 1993 01:15:00'
          );
          parent.tempdate = parent.comments[parent.comments.length - 1].time;
          parent.db.collection('votes',(ref) => ref.where('upvotes','array-contains',doc.data().uid)).doc(parent.comment[parent.comment.length -1].voteid).snapshotChanges().pipe(
            map(actions => {
              const data = actions.payload.data();
              const id = actions.payload.id;
              console.log(data,id);
            }));
        });
        this.getuser();
        this.addreply();
        
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });

  }

  getuser() {
    const parent = this;
    Object.keys(this.comments).forEach((key) => {
      const docRef = parent.db
        .collection('users')
        .doc(parent.comments[key].uid);
      docRef
        .get()
        .toPromise()
        .then((doc) => {
          if (doc.exists) {
            parent.comments[key].user = doc.data().displayName;
            parent.comments[key].userphoto = doc.data().photoURL;
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.log('Error getting document:', error);
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

  addreply(): void {
    this.comment = null;
    // for (this.comment in this.comments) {
    //   this.comment.show = this.show;
    // }
  }

  postReply(com) {
    const date = new Date();
    const user = firebase.auth().currentUser;

    if (user != null) {
      this.db.collection('replies').add({
        reply: this.replybox,
        time: date,
        uid: user.uid,
        commentid: com.commentid,
      });
    } else {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to reply', 'OKAY');
    }
  }

  getreplies(arrayItem) {
    const parent = this;
    parent.db
      .collection('replies', (ref) =>
        ref
          .where('commentid', '==', arrayItem.commentid)
          .orderBy('time')
          .startAfter(arrayItem.tempreplydate)
          .limit(5)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          arrayItem.replies.push({
            reply: doc.data().reply,
            uid: doc.data().uid,
            commentid: doc.data().commentid,
            time: doc.data().time,
          });
          parent.getuserdata();
          arrayItem.tempreplydate = doc.data().time;
          console.log(arrayItem);
        });
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      });
    console.log(this.comments);
  }

  getuserdata() {
    const parent = this;
    this.comments.forEach((arrayItem) => {
      arrayItem.replies.forEach((element) => {
        const docRef = parent.db.collection('users').doc(element.uid);

        docRef
          .get()
          .toPromise()
          .then((doc) => {
            if (doc.exists) {
              element.user = doc.data().displayName;
              element.userphoto = doc.data().photoURL;
            } else {
              console.log('No such document!');
            }
          })
          .catch((error) => {
            console.log('Error getting document:', error);
          });
      });
    });
  }
  getmoreComments() {
    this.i = this.i + 10;
    this.getComments();
  }
  loadreplies(com) {
    com.loadrepliesvar = false;
    this.getreplies(com);
  }
  morereplies(com) {
    this.getreplies(com);
  }

  upvote(voteid){
    var vote = this.uservote == 1 ? 0 : 1;
    this.db.collection('votes').doc(voteid).update({})
  }
  downvote(voteid){

  }


}
