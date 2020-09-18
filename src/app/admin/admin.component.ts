import { Component, OnInit} from '@angular/core';
import { NewsShow } from '../models/NewsShow';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../reload.service';
import { Router,NavigationEnd  } from '@angular/router'; 

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  submit: boolean = false;

  isHovering: boolean;
  mySubscription: any;
  file: File;

  show: NewsShow = {
    title: '',
    description: '',
    anchor: '',
    poster: ''

  };
  constructor(private router: Router, private snackBar: MatSnackBar, private reload: ReloadService) {
  }
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
    this.reload.action.subscribe(async (op) => {
      await this.reloadthis();
    });
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
  reloadthis(){
    this.clearFields();
    this.submit = false;
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  
  }
  
  }
