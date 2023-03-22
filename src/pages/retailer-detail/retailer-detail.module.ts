import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetailerDetailPage } from './retailer-detail';

@NgModule({
  declarations: [
    RetailerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RetailerDetailPage),
  ],
})
export class RetailerDetailPageModule {}
