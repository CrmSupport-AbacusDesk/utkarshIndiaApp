import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyTrackerDetailPage } from './loyalty-tracker-detail';

@NgModule({
  declarations: [
    LoyaltyTrackerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyTrackerDetailPage),
  ],
})
export class LoyaltyTrackerDetailPageModule {}
