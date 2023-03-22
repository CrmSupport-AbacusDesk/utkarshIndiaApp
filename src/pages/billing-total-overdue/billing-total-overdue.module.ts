import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingTotalOverduePage } from './billing-total-overdue';

@NgModule({
  declarations: [
    BillingTotalOverduePage,
  ],
  imports: [
    IonicPageModule.forChild(BillingTotalOverduePage),
  ],
})
export class BillingTotalOverduePageModule {}
