import { Component, Input, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  @Input() articleID: string;
  commentbox = '';
  replybox = '';
  comments: any[] = [];
  comment: any;
  subscription;
  uservote = 0;
  tempdate = new Date();
  tempvote = 0;
  curruser: string;
  upvoteimg = '../../assets/images/up-arrow.png';
  increment = firebase.firestore.FieldValue.increment(1);
  decrement = firebase.firestore.FieldValue.increment(-1);
  increment2 = firebase.firestore.FieldValue.increment(2);
  decrement2 = firebase.firestore.FieldValue.increment(-2);
  wait = false;
  loadingOff = true;
  public show = false;
  commentsort: string = 'votes';


  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
  ) {}

  ngOnInit(): void {
    this.fetchcurruserid();
    this.getCommentsvotes();
  }
  fetchcurruserid() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.curruser = user['uid'];
      } else {
        // No user is signed in.
        this.curruser = null;
      }
    });
  }

  postComment() {
    const user = firebase.auth().currentUser;

    if (user !== null) {
      const date = new Date();
      this.db
        .collection('comments')
        .add({
          uid: user.uid,
          comment: this.commentbox,
          time: date,
          articleID: this.articleID,
          votes: 0,
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
    this.db
      .collection('comments', (ref) =>
        ref
          .orderBy('time','desc')
          .where('articleID', '==', `${this.articleID}`)
          .startAfter(this.tempdate)
          .limit(10)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id)
          parent.comments.push(doc.data());

          parent.comments[parent.comments.length - 1].commentid = doc.id;
          parent.comments[parent.comments.length - 1].replies = [];
          parent.comments[parent.comments.length - 1].loadrepliesvar = true;
          parent.comments[parent.comments.length - 1].uservote = 0;
          parent.comments[parent.comments.length - 1].voteid = null;
          parent.comments[parent.comments.length - 1].tempreplydate = new Date(
            'July 21, 1993 01:15:00'
          );
          parent.tempdate = parent.comments[parent.comments.length - 1].time;
        });
        this.getuser();
        this.addreply();
        this.getuservote();
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      })
      .finally(() => {
        this.loadingOff = false;
      })
      ;
  }

 async getCommentsvotes(){
    const parent = this;
    await this.db
      .collection('comments', (ref) =>
        ref
          .orderBy('votes', "desc")
          .orderBy('time','desc')
          .where('articleID', '==', `${this.articleID}`)
          .limit(10)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id)
          parent.comments.push(doc.data());

          parent.comments[parent.comments.length - 1].commentid = doc.id;
          parent.comments[parent.comments.length - 1].replies = [];
          parent.comments[parent.comments.length - 1].loadrepliesvar = true;
          parent.comments[parent.comments.length - 1].uservote = 0;
          parent.comments[parent.comments.length - 1].voteid = null;
          parent.comments[parent.comments.length - 1].tempreplydate = new Date(
            'July 21, 1993 01:15:00'
          );
          parent.tempvote = parent.comments[parent.comments.length - 1].votes;
          parent.tempdate = parent.comments[parent.comments.length - 1].time;
        });
      })
      .catch((error) => {
        console.log('Error getting document:', error);
      })
      .finally(() => {
        this.loadingOff = false;
      })

        await this.db
      .collection('comments', (ref) =>
        ref
          .orderBy('time', "desc")
          .where('articleID', '==', `${this.articleID}`)
          .where('votes','==',this.tempvote)
          .startAfter(this.tempdate)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          parent.comments.push(doc.data());

          parent.comments[parent.comments.length - 1].commentid = doc.id;
          parent.comments[parent.comments.length - 1].replies = [];
          parent.comments[parent.comments.length - 1].loadrepliesvar = true;
          parent.comments[parent.comments.length - 1].uservote = 0;
          parent.comments[parent.comments.length - 1].voteid = null;
          parent.comments[parent.comments.length - 1].tempreplydate = new Date(
            'July 21, 1993 01:15:00'
          );
          parent.tempvote = parent.comments[parent.comments.length - 1].votes;
          parent.tempdate = parent.comments[parent.comments.length - 1].time;
        });
      })

        
         
        this.getuser();
        this.addreply();
        this.getuservote();
      
      ;
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
        vote: 0,
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
            replyid: doc.id,
            uservote: 0,
            votes: doc.data().votes,
            voteid: null,
          });
          parent.getuserdata();
          arrayItem.tempreplydate = doc.data().time;

          console.log(arrayItem);
        });
        this.getuservotereply();
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
  async getmoreComments() {
    if(this.commentsort == 'newest'){
      this.getComments();
    }
    else if(this.commentsort == 'votes'){
      const parent = this;
      await this.db
        .collection('comments', (ref) =>
          ref
            .orderBy('votes', "desc")
            .orderBy('time','desc')
            .where('articleID', '==', `${this.articleID}`)
            .startAfter(this.tempvote,this.tempdate)
            .limit(10)
        )
        .get()
        .toPromise()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log('1');
            console.log(doc.data())
            parent.comments.push(doc.data());
  
            parent.comments[parent.comments.length - 1].commentid = doc.id;
            parent.comments[parent.comments.length - 1].replies = [];
            parent.comments[parent.comments.length - 1].loadrepliesvar = true;
            parent.comments[parent.comments.length - 1].uservote = 0;
            parent.comments[parent.comments.length - 1].voteid = null;
            parent.comments[parent.comments.length - 1].tempreplydate = new Date(
              'July 21, 1993 01:15:00'
            );
            parent.tempvote = parent.comments[parent.comments.length - 1].votes;
            parent.tempdate = parent.comments[parent.comments.length - 1].time;
          });
        })
        .catch((error) => {
          console.log('Error getting document:', error);
        })
        .finally(() => {
          this.loadingOff = false;
        });

        await  this.db
        .collection('comments', (ref) =>
        ref
          .orderBy('time', "desc")
          .where('articleID', '==', `${this.articleID}`)
          .where('votes','==',this.tempvote)
          .startAfter(this.tempdate)
      )
      .get()
      .toPromise()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          parent.comments.push(doc.data());

          parent.comments[parent.comments.length - 1].commentid = doc.id;
          parent.comments[parent.comments.length - 1].replies = [];
          parent.comments[parent.comments.length - 1].loadrepliesvar = true;
          parent.comments[parent.comments.length - 1].uservote = 0;
          parent.comments[parent.comments.length - 1].voteid = null;
          parent.comments[parent.comments.length - 1].tempreplydate = new Date(
            'July 21, 1993 01:15:00'
          );
          parent.tempvote = parent.comments[parent.comments.length - 1].votes;
          parent.tempdate = parent.comments[parent.comments.length - 1].time;
        });
      })
           
          this.getuser();
          this.addreply();
          this.getuservote();
        

    }
    
  }
  loadreplies(com) {
    com.loadrepliesvar = false;
    this.getreplies(com);
  }
  morereplies(com) {
    this.getreplies(com);
  }

  upvote(commentid, voteid, uservote) {
    var vote = uservote == 1 ? 0 : 1;
    var parent = this;
    this.wait = true;
    var curruser = this.curruser;
    var index = this.comments.findIndex((obj) => obj.commentid === commentid);
    console.log(voteid);
    if (curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      if (voteid != null) {
        console.log('yes');
        this.db
          .collection('comments')
          .doc(commentid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: vote,
          })
          .then(function (docRef) {
            console.log(parent.wait);
            parent.comments[index].uservote = vote;
            if (uservote == 0) {
              console.log(parent.wait);
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == 1) {
              console.log(parent.wait);
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == -1) {
              console.log(parent.wait);
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment2,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 2;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            }
          });
      } else {
        this.db
          .collection('comments')
          .doc(commentid)
          .collection('votes')
          .add({
            uid: curruser,
            vote: vote,
          })
          .then(function (docRef) {
            parent.comments[index].uservote = vote;
            parent.comments[index].voteid = docRef.id;
            if (uservote == 0) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 1;
                  parent.wait = false;
                });
            } else if (uservote == 1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 1;
                  parent.wait = false;
                });
            } else if (uservote == -1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment2,
                })
                .then(function (docRef) {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 2;
                  parent.wait = false;
                });
            }
          });
      }
    }
  }
  downvote(commentid, voteid, uservote) {
    var vote = uservote == -1 ? 0 : -1;
    var parent = this;
    this.wait = true;
    var index = this.comments.findIndex((obj) => obj.commentid === commentid);
    var curruser = this.curruser;
    console.log(voteid);
    if (curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      if (voteid != null) {
        this.db
          .collection('comments')
          .doc(commentid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: vote,
          })
          .then(function () {
            parent.comments[index].uservote = vote;
            if (uservote == 0) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 1;
                  parent.wait = false;
                });
            } else if (uservote == -1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 1;
                  parent.wait = false;
                });
            } else if (uservote == 1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement2,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 2;
                  parent.wait = false;
                });
            }
          });
      } else {
        this.db
          .collection('comments')
          .doc(commentid)
          .collection('votes')
          .add({
            uid: curruser,
            vote: vote,
          })
          .then(function (docRef) {
            parent.comments[index].uservote = vote;
            parent.comments[index].voteid = docRef.id;
            if (uservote == 0) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 1;
                  parent.wait = false;
                });
            } else if (uservote == -1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.increment,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes + 1;
                  parent.wait = false;
                });
            } else if (uservote == 1) {
              parent.db
                .collection('comments')
                .doc(commentid)
                .update({
                  votes: parent.decrement2,
                })
                .then(function () {
                  parent.comments[index].votes =
                    parent.comments[index].votes - 2;
                  parent.wait = false;
                });
            }
          });
      }
    }
  }
  getuservote() {
    this.comments.forEach((array) => {
      if (this.curruser == null) {
        return;
      } else {
        this.db
          .collection('comments')
          .doc(array.commentid)
          .collection('votes', (ref) => ref.where('uid', '==', this.curruser))
          .get()
          .toPromise()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(this.curruser);
              console.log(doc.data());
              array.uservote = doc.data().vote;
              array.voteid = doc.id;
              console.log(this.comments);
            });
          });
      }
    });
  }
  upvotereply(commentid, replyid, voteid, uservote) {
    var vote = uservote == 1 ? 0 : 1;
    var parent = this;
    this.wait = true;
    var curruser = this.curruser;
    var index1 = this.comments.findIndex((obj) => obj.commentid === commentid);
    var index = this.comments[index1].replies.findIndex(
      (obj) => obj.replyid === replyid
    );
    console.log(voteid);
    if (curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      if (voteid != null) {
        console.log('yes');
        this.db
          .collection('replies')
          .doc(replyid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: vote,
          })
          .then(function (docRef) {
            console.log(parent.wait);
            parent.comments[index1].replies[index].uservote = vote;
            if (uservote == 0) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == 1) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == -1) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment2,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 2;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            }
          });
      } else {
        this.db
          .collection('replies')
          .doc(replyid)
          .collection('votes')
          .add({
            uid: curruser,
            vote: vote,
          })
          .then(function (docRef) {
            parent.comments[index1].replies[index].uservote = vote;
            parent.comments[index1].replies[index].voteid = docRef.id;
            if (uservote == 0) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 1;
                  parent.wait = false;
                });
            } else if (uservote == 1) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 1;
                  parent.wait = false;
                });
            } else if (uservote == -1) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment2,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 2;
                  parent.wait = false;
                });
            }
          });
      }
    }
  }
  downvotereply(commentid, replyid, voteid, uservote) {
    var vote = uservote == -1 ? 0 : -1;
    var parent = this;
    this.wait = true;
    var curruser = this.curruser;
    var index1 = this.comments.findIndex((obj) => obj.commentid === commentid);
    var index = this.comments[index1].replies.findIndex(
      (obj) => obj.replyid === replyid
    );
    console.log(voteid);
    if (curruser == null) {
      const dialogRef2 = this.dialog.open(LoginComponent);

      dialogRef2.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
      this.openSnackBar('Login to vote', 'OKAY');
    } else {
      if (voteid != null) {
        console.log('yes');
        this.db
          .collection('replies')
          .doc(replyid)
          .collection('votes')
          .doc(voteid)
          .update({
            vote: vote,
          })
          .then(function (docRef) {
            console.log(parent.wait);
            parent.comments[index1].replies[index].uservote = vote;
            if (uservote == 0) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == 1) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement2,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 2;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            } else if (uservote == -1) {
              console.log(parent.wait);
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 1;
                  parent.wait = false;
                  console.log(parent.wait);
                });
            }
          });
      } else {
        this.db
          .collection('replies')
          .doc(replyid)
          .collection('votes')
          .add({
            uid: curruser,
            vote: vote,
          })
          .then(function (docRef) {
            parent.comments[index1].replies[index].uservote = vote;
            parent.comments[index1].replies[index].voteid = docRef.id;
            if (uservote == 0) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 1;
                  parent.wait = false;
                });
            } else if (uservote == 1) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.decrement2,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes - 2;
                  parent.wait = false;
                });
            } else if (uservote == -1) {
              parent.db
                .collection('replies')
                .doc(replyid)
                .update({
                  votes: parent.increment,
                })
                .then(function (docRef) {
                  parent.comments[index1].replies[index].votes =
                    parent.comments[index1].replies[index].votes + 1;
                  parent.wait = false;
                });
            }
          });
      }
    }
  }
  getuservotereply() {
    this.comments.forEach((array) => {
      array.replies.forEach((reply) => {
        if (this.curruser == null) {
          return;
        } else {
          this.db
            .collection('replies')
            .doc(reply.replyid)
            .collection('votes', (ref) => ref.where('uid', '==', this.curruser))
            .get()
            .toPromise()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                console.log(this.curruser);
                console.log(doc.data());
                reply.uservote = doc.data().vote;
                reply.voteid = doc.id;
                console.log(this.comments);
              });
            });
        }
      });
    });
  }

  onChange(value){
    if (value == 'newest'){
      this.tempdate =  new Date();
      this.commentsort = value;
      this.comments = [];
      this.getComments()
    }
    else if(value == 'votes'){
      this.tempdate =  new Date();
      this.commentsort = value;
      this.comments = [];
      this.getCommentsvotes()
    }
  }
}
