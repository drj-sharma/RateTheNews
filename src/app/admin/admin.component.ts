import { Component, OnInit} from '@angular/core';
import { NewsShow } from '../models/NewsShow';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  submit: boolean = false;

  isHovering: boolean;

  file: File;

  show: NewsShow = {
    title: '',
    description: '',
    anchor: '',
    poster: ''

  };
  constructor( private snackBar: MatSnackBar) {
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
  }
  submitShow(show: NewsShow) {
    this.openSnackBar('Show Added Successfully', 'OKAY');
    this.submit = true;
  }
  clearFields() {
    this.show = {};
  }


  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
      this.file = files.item(0)
  }
  
  }
