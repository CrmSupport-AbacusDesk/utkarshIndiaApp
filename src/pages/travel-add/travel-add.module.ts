import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { TravelAddPage } from './travel-add';

@NgModule({
  declarations: [
    TravelAddPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelAddPage),
    IonicSelectableModule
  ],
})
export class TravelAddPageModule {}
