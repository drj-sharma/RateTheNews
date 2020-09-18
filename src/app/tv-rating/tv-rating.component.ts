import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tv-rating',
  templateUrl: './tv-rating.component.html',
  styleUrls: ['./tv-rating.component.scss']
})
export class TvRatingComponent implements OnInit {
  state$: Observable<object>;

  constructor(public activatedRoute: ActivatedRoute, private db: AngularFirestore) { }

  anchor = '';
  timing = '5pm to 6pm';
  isHidden = false;
  sub;
  id;
  show : any[] = [];
  @ViewChild('anchor') span: ElementRef;

  ngOnInit(): void {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      });
      this.fetchdata();
      console.log(this.show)
  }
  
  open() {
    this.isHidden = !this.isHidden;
  }
  fetchdata(){
    this.show;
    var parent = this;
    var docRef = this.db.collection("news-shows").doc(this.id);
    docRef.get().toPromise().then(function(doc) {
        if (doc.exists) {
          parent.show.push(doc.data());
          console.log(parent.show);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
  }
}
