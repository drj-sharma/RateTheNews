import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-your-ratings',
  templateUrl: './your-ratings.component.html',
  styleUrls: ['./your-ratings.component.scss'],
})
export class YourRatingsComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  uid: string;
  ratedTvShowsDetails = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.uid = param.id;
    });
    this.getRatedTvShowsByUid(this.uid);
  }
  getRatedTvShowsByUid(uid: string) {
    this.http
      .get('http://localhost:3000/getRatedTvShowsByUid?id=' + uid, {
        responseType: 'json',
      })
      .subscribe(
        (res: any[]) => {
          res.forEach((show) => {
            this.http
              .get('http://localhost:3000/getShowById?id=' + show.showid, {
                responseType: 'json',
              })
              .subscribe((showInstance: any[]) => {
                showInstance['myReviewRating'] = show.rating;
                showInstance['myReviewDesciption'] = show.content;
                showInstance['myReviewTitle'] = show.title;
                showInstance['myReviewTime'] = show.time;
                this.ratedTvShowsDetails.push(showInstance);
                if (this.ratedTvShowsDetails.length >= 1) {
                }
              });
          });
        },
        (err) => console.log(err)
      );
  }
  goToShow(id: string) {
    console.log(id);
    this.router.navigate(['tv-rating', id]);
  }
}
