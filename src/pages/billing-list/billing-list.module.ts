import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BillingListPage } from './billing-list';

@NgModule({
  declarations: [
    BillingListPage,
  ],
  imports: [
    IonicPageModule.forChild(BillingListPage),
  ],
})
export class BillingListPageModule {}
