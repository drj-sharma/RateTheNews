import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AuthComponent } from './auth/auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './material/material/material.module';
import { AnchorComponent } from './anchor/anchor.component';
import { ArticleModule } from './article/article/article.module';
import { ReviewCompComponent } from './review-comp/review-comp.component';
import { WriteReviewComponent } from './write-review/write-review.component';
import { TvRatingComponent } from './tv-rating/tv-rating.component';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { PublishedArticlesComponent } from './published-articles/published-articles.component';
import { SafePipe } from './safe.pipe';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { DropzoneDirective } from './dropzone.directive';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { YourArticlesComponent } from './your-articles/your-articles.component';
import { RegisterUserComponent } from './register-user/register-user.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    AnchorComponent,
    ReviewCompComponent,
    WriteReviewComponent,
    TvRatingComponent,
    AdminComponent,
    PublishedArticlesComponent,
    SafePipe,
    DropzoneDirective,
    UploadTaskComponent,
    YourArticlesComponent,
    RegisterUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ArticleModule,
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
