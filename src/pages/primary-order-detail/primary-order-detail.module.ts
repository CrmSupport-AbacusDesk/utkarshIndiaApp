import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimaryOrderDetailPage } from './primary-order-detail';

@NgModule({
  declarations: [
    PrimaryOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryOrderDetailPage),
  ],
})
export class PrimaryOrderDetailPageModule {}
