import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowupDetailPage } from './followup-detail';

@NgModule({
  declarations: [
    FollowupDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowupDetailPage),
  ],
})
export class FollowupDetailPageModule {}
