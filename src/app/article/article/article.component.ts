import { Component, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Article } from 'src/app/models/article';
import { firestore } from 'firebase';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  articlesCollections: AngularFirestoreCollection<Article>;
  // creating object of editorjs
  public editor: any;
  uid: string;
  articleID: string;
  outputArray: Article = {
    uid: '',
    time: '',
    articleJSON: []
  };
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    this.articlesCollections = this.afs.collection('articles');
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.uid = user.uid;
      } else {
        this.uid = null;
      }
    });
  }

  ngOnInit(): void {
    this.editor = new EditorJS({
      placeholder: 'Let\'s write an article',
      holder: 'editorjs',
      tools: {
        header: {
          class: Header,
          shortcut: 'CMD+SHIFT+H',
          config: {
            inlineToolbar: true,
            levels: [1, 2, 3, 4],
            defaultLevel: 1,
          }
        },
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: 'http://localhost:8008/fetchUrl',
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true
            }
          }
        },
        table: {
          class: Table,
          inlineToolbar: true,
        }
      },
      onChange: () => { console.log('Editor\'s content changed!'); }
    });
  }
  publish() {
    this.editor.save()
      .then((output: any) => {
        this.outputArray.uid = this.uid;
        this.outputArray.time = Date.now().toString();
        this.outputArray.articleJSON = output.blocks;
        // adding to the collection
        this.articlesCollections.add(this.outputArray)
          .then((docRef: any) => {
            this.articleID = docRef.id;
            this.addArticleIdToUser(this.articleID);
          })
          .catch((err: any) => console.error('Error while adding: ', err)
          );
      });
  }
  async addArticleIdToUser(articleID: string) {
    const userRef: AngularFirestoreDocument = this.afs.collection('users').doc(this.uid);
    userRef.update({
      articles: firestore.FieldValue.arrayUnion(this.articleID)
    });
  }
}
