import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tv-rating',
  templateUrl: './tv-rating.component.html',
  styleUrls: ['./tv-rating.component.scss']
})
export class TvRatingComponent implements OnInit {

  constructor() { }

  anchor = '';
  timing = '5pm to 6pm';
  isHidden = false;

  ngOnInit(): void {
  }
  
  open() {
    this.isHidden = !this.isHidden;
  }
}
