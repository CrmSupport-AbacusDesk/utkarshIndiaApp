import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryOrderMainPage } from './secondary-order-main';

@NgModule({
  declarations: [
    SecondaryOrderMainPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryOrderMainPage),
  ],
})
export class SecondaryOrderMainPageModule {}
