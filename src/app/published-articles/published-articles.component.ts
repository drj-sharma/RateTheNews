import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
    selector: 'app-published-articles',
    templateUrl: './published-articles.component.html',
    styleUrls: ['./published-articles.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PublishedArticlesComponent implements OnInit {
    vis = false;
    article: any;   // parent
    data: any;      // child
    time: any;      // child
    uid: string;
    articleRef: any;
    articlesID: string[];
    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
        this.articleRef = this.afs.collection('articles');
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.uid = user.uid;
                this.getArticles(this.uid);
            } else {
                this.uid = null;
            }
        });
    }

    ngOnInit(): void {
    }
    async getArticles(uid: string) {
        const userRef: AngularFirestoreDocument = this.afs.collection('users').doc(uid);
        await userRef.get().toPromise().then((doc) => {
            if (doc.data().articles.length === 0) {
                this.vis = true;
                return;
            }
            this.articlesID = doc.data().articles;
            console.log(this.articlesID);
        });
        if (this.articlesID === undefined) {
            return;
        }
        const articleRef: AngularFirestoreDocument = this.afs.collection('articles').doc(this.articlesID[0]);
        await articleRef.get().toPromise().then((doc) => {
            this.article = doc.data();
        });
        this.data = this.article.articleJSON;
        this.time = this.article.time;
    }
}
