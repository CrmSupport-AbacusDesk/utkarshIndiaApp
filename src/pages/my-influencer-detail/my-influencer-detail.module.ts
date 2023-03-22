import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyInfluencerDetailPage } from './my-influencer-detail';

@NgModule({
  declarations: [
    MyInfluencerDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MyInfluencerDetailPage),
  ],
})
export class MyInfluencerDetailPageModule {}
