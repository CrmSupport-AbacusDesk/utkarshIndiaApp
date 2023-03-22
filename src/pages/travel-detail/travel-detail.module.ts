import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TravelDetailPage } from './travel-detail';

@NgModule({
  declarations: [
    TravelDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TravelDetailPage),
  ],
})
export class TravelDetailPageModule {}
