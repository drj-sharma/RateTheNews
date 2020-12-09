import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  showSpinner = true;
  shows: any[] = [];
  images: any[] = [];
  articles: any[] = [];
  showid: string;
  constructor(private http: HttpClient, private router: Router) {}
  storage = firebase.storage();
  @ViewChild('myimg') img: ElementRef;

  ngOnInit(): void {
    this.getshows();
    this.getArticles();
  }

  getshows() {
    this.http
      .get('http://localhost:3000/fetchshows', { responseType: 'json' })
      .subscribe((response: any[]) => {
        this.shows = response;
        this.showSpinner = false;
      });
  }
  getArticles() {
    this.http.get('http://localhost:3000/fetchArticles', { responseType: 'json',})
    .subscribe((res: any[]) => {
      this.articles = res;
    })
  }
  viewArticle(articleId: string) {
    this.router.navigate(['published', { id: articleId }]);
  }
}
