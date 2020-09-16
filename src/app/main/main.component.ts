import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebase from "firebase/app";
import 'firebase/storage';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  shows : any[] = [];
  images: any[] = [];
  constructor(private http: HttpClient) {}
  storage = firebase.storage();
  @ViewChild('myimg') img: ElementRef;
  


  ngOnInit(): void {
    this.getshows();
  }

  getshows(){
    this.http.get('http://localhost:3000/fetchshows', {responseType: 'json'}).subscribe((response: any[]) => {
      this.shows= response;
      console.log(this.shows);
      for (const show of this.shows) {
        var gsReference = this.storage.refFromURL(show.poster);
        gsReference.getDownloadURL().then(function(url) {
          console.log(url);
          show.image= url;
          console.log(show.image);
        }).catch(function(error) {
          // Handle any errors
        });
        

      }
      });
      
      

}
}
