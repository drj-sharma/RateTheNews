import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnchorComponent } from './anchor/anchor.component';
import { ArticleComponent } from './article/article/article.component';
// import { AuthComponent } from './auth/auth/auth.component';
import {MainComponent} from './main/main.component';
import { TvRatingComponent } from './tv-rating/tv-rating.component';


const routes: Routes = [
  // {path: '', component: AuthComponent},
  { path: '', component: MainComponent },
  { path: 'anchor', component: AnchorComponent },
  { path: 'article', component: ArticleComponent},
  { path: 'tv-rating', component: TvRatingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
