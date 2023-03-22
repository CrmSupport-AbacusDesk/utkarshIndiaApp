import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyAboutPage } from './loyalty-about';

@NgModule({
  declarations: [
    LoyaltyAboutPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyAboutPage),
  ],
})
export class LoyaltyAboutPageModule {}
