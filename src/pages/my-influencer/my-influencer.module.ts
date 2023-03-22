import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyInfluencerPage } from './my-influencer';

@NgModule({
  declarations: [
    MyInfluencerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyInfluencerPage),
  ],
})
export class MyInfluencerPageModule {}
