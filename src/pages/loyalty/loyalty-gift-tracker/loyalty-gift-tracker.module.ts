import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyGiftTrackerPage } from './loyalty-gift-tracker';

@NgModule({
  declarations: [
    LoyaltyGiftTrackerPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyGiftTrackerPage),
  ],
})
export class LoyaltyGiftTrackerPageModule {}
