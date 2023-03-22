import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyProfilePage } from './loyalty-profile';

@NgModule({
  declarations: [
    LoyaltyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyProfilePage),
  ],
})
export class LoyaltyProfilePageModule {}
