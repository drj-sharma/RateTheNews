import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnchorComponent } from './anchor/anchor.component';
// import { AuthComponent } from './auth/auth/auth.component';
import {MainComponent} from './main/main.component';


const routes: Routes = [
  // {path: '', component: AuthComponent},
  { path: '', component: MainComponent },
  { path: 'anchor', component: AnchorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
