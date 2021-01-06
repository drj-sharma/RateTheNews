import { Component, OnInit } from '@angular/core';
import { NewsShow } from '../models/NewsShow';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReloadService } from '../reload.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  submit = false;
  isHovering: boolean;
  mySubscription: any;
  file: File;
  isAuthorized: boolean;

  show: NewsShow = {
    title: '',
    description: '',
    anchor: '',
    poster: ''
  };
  constructor(
    private snackBar: MatSnackBar,
    private reload: ReloadService
  ) {}
  openSnackBar(msg: string, action: string) {
    this.snackBar.open(msg, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
    const userRole = sessionStorage.getItem("role");
    this.isAuthorized = userRole && userRole != null && userRole === 'admin_user';
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
    this.file = files.item(0);
  }
  reloadthis() {
    this.clearFields();
    this.submit = false;
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
