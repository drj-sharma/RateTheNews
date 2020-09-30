import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {RegisterUserComponent} from 'src/app/register-user/register-user.component'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public dialog: MatDialog,public auth: AuthService) { }

  ngOnInit(): void {
  }
  openDialog(){
    const dialogRef2 = this.dialog.open(RegisterUserComponent);

    dialogRef2.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
