import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyPointHistoryPage } from './loyalty-point-history';

@NgModule({
  declarations: [
    LoyaltyPointHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyPointHistoryPage),
  ],
})
export class LoyaltyPointHistoryPageModule {}
