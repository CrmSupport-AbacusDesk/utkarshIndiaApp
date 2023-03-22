import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoadingCntrlPage } from './loading-cntrl';

@NgModule({
  declarations: [
    LoadingCntrlPage,
  ],
  imports: [
    IonicPageModule.forChild(LoadingCntrlPage),
  ],
})
export class LoadingCntrlPageModule {}
