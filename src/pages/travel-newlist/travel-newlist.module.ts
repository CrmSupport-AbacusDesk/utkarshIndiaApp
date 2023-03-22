import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelNewlistPage } from './travel-newlist';

@NgModule({
  declarations: [
    TravelNewlistPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelNewlistPage),
  ],
})
export class TravelNewlistPageModule {}
