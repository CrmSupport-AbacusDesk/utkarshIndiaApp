import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingDetailPage } from './billing-detail';

@NgModule({
  declarations: [
    BillingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingDetailPage),
  ],
})
export class BillingDetailPageModule {}
