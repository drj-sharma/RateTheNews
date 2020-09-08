import { Component, OnInit } from '@angular/core';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  // creating object of editorjs
  public editor: any;
  constructor() { }

  ngOnInit(): void {
    this.editor = new EditorJS({
      placeholder: 'Let\'s write an article',
      holder: 'editorjs',
      /**
       * Available Tools list.
       * Pass Tool's class or Settings object for each Tool you want to use
       */
      tools: {
        header: {
          class: Header,
          inlineToolbar: true
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
      onChange: () => { console.log('Now I know that Editor\'s content changed!'); }
    });
  }

}
