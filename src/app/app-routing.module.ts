import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AnchorComponent } from './anchor/anchor.component';
import { ArticleComponent } from './article/article/article.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MainComponent } from './main/main.component';
import { PublishedArticlesComponent } from './published-articles/published-articles.component';
import { TvRatingComponent } from './tv-rating/tv-rating.component';
import { YourArticlesComponent } from './your-articles/your-articles.component';
import { YourRatingsComponent } from './your-ratings/your-ratings.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'anchor', component: AnchorComponent },
  { path: 'article', component: ArticleComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'article', component: ArticleComponent },
  { path: 'tv-rating/:id', component: TvRatingComponent },
  { path: 'your-articles', component: YourArticlesComponent },
  { path: 'published/:id', component: PublishedArticlesComponent },
  { path: 'edit-profile', component: EditProfileComponent },
  { path: 'your-rating/:id', component: YourRatingsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
