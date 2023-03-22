import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScanningPage } from './scanning';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    ScanningPage,
  ],
  imports: [
    IonicPageModule.forChild(ScanningPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class ScanningPageModule {}
