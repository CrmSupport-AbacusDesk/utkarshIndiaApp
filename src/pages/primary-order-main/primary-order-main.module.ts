import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimaryOrderMainPage } from './primary-order-main';

@NgModule({
  declarations: [
    PrimaryOrderMainPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryOrderMainPage),
  ],
})
export class PrimaryOrderMainPageModule {}
