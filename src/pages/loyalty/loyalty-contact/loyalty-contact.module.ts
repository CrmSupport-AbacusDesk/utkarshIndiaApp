import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyContactPage } from './loyalty-contact';

@NgModule({
  declarations: [
    LoyaltyContactPage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyContactPage),
  ],
})
export class LoyaltyContactPageModule {}
