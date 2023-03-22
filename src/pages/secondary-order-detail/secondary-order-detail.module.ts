import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryOrderDetailPage } from './secondary-order-detail';

@NgModule({
  declarations: [
    SecondaryOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryOrderDetailPage),
  ],
})
export class SecondaryOrderDetailPageModule {}
