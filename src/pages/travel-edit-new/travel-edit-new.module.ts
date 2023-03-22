import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { TravelEditNewPage } from './travel-edit-new';

@NgModule({
  declarations: [
    TravelEditNewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelEditNewPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class TravelEditNewPageModule {}
