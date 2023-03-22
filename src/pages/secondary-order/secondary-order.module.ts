import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryOrderPage } from './secondary-order';

@NgModule({
  declarations: [
    SecondaryOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryOrderPage),
  ],
})
export class SecondaryOrderPageModule {}
