import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AuthComponent } from './auth/auth/auth.component';
import {MainComponent} from './main/main.component'


const routes: Routes = [
  // {path: '', component: AuthComponent},
  {path: '',component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
