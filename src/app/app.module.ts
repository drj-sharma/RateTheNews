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
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';


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
    AdminComponent
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
    ArticleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
