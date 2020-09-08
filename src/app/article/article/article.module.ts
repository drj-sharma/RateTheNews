import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { MaterialModule } from '../../material/material/material.module';

@NgModule({
  declarations: [
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ArticleComponent,
    MaterialModule
  ]
})
export class ArticleModule { }
