import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import {MatDividerModule} from '@angular/material/divider'; 

const material = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatMenuModule,
  MatIconModule,
  MatDialogModule,
  MatSliderModule,
  MatTabsModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatChipsModule,
  MatBottomSheetModule,
  MatDividerModule
];

@NgModule({
  declarations: [],
  imports: [material],
  exports: [material],
})
export class MaterialModule {}
