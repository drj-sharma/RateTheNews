import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from 'src/app/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from 'src/app/register/register.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog, public auth: AuthService) { }

  ngOnInit(): void {
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  openRegisterDialog(): void {
    const dialogRef2 = this.dialog.open(RegisterComponent);

    dialogRef2.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
