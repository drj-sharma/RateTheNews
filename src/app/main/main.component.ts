import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  @ViewChild('myimg') img: ElementRef;

  ngOnInit(): void {
    this.getshows();
    this.getArticles();
  }

  async getshows() {
    this.http
      .get('http://localhost:3000/fetchshows', { responseType: 'json' })
      .subscribe((response: any[]) => {
        console.log(response);
        this.shows = response;
        this.showSpinner = false;
      });
  }
  async getArticles() {
    this.http.get('http://localhost:3000/fetchArticles', { responseType: 'json', })
    .subscribe((res: any[]) => {
      console.log(res);
      this.articles = res;
      this.showSpinner = false;
    });
  }
  viewArticle(articleId: string) {
    this.router.navigate(['published', { id: articleId }]);
  }
}
