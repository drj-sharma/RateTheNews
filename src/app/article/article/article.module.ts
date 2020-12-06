import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { MaterialModule } from '../../material/material/material.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ArticleComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  exports: [
    ArticleComponent,
    MaterialModule
  ]
})
export class ArticleModule { }
