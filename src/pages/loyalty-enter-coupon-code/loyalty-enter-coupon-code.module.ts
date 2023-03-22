import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyEnterCouponCodePage } from './loyalty-enter-coupon-code';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    LoyaltyEnterCouponCodePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyEnterCouponCodePage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class LoyaltyEnterCouponCodePageModule {}
