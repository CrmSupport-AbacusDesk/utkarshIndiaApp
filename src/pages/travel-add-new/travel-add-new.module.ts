import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelAddNewPage } from './travel-add-new';

@NgModule({
  declarations: [
    TravelAddNewPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelAddNewPage),
  ],
})
export class TravelAddNewPageModule {}
