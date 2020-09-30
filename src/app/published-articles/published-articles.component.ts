import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-published-articles',
    templateUrl: './published-articles.component.html',
    styleUrls: ['./published-articles.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PublishedArticlesComponent implements OnInit {
    showSpinner = true;
    vis = false;
    article: any;   // parent
    data: any;      // child
    time: any;      // child
    uid: string;
    articleRef: any;
    constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private route: ActivatedRoute) {

    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.getArticles(params.id);
        });
    }
    async getArticles(article: string) {
        if (article === undefined) {
            this.vis = true;
            return;
        }
        const articleRef: AngularFirestoreDocument = this.afs.collection('articles').doc(article);
        await articleRef.get().toPromise().then((doc) => {
            this.article = doc.data();
        });
        this.uid = this.article.uid;
        this.data = this.article.articleJSON;
        this.time = this.article.time;
        this.showSpinner = false;
    }
}
