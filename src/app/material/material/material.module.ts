import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';

const material = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatMenuModule,
  MatIconModule,
  MatDialogModule,
  MatSliderModule,
  MatTabsModule,
  MatSnackBarModule
];


@NgModule({
  declarations: [],
  imports: [
    material,
  ],
  exports: [
    material
  ]
})
export class MaterialModule { }
