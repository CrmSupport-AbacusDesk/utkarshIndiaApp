import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimaryOrderPage } from './primary-order';

@NgModule({
  declarations: [
    PrimaryOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryOrderPage),
  ],
})
export class PrimaryOrderPageModule {}
