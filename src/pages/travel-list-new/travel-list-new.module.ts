import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { TravelListNewPage } from './travel-list-new';


@NgModule({
  declarations: [
    TravelListNewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelListNewPage),
    IonicSelectableModule
  ],
})
export class TravelListNewPageModule {}
