import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsFollowupListPage } from './lms-followup-list';

@NgModule({
  declarations: [
    LmsFollowupListPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsFollowupListPage),
  ],
})
export class LmsFollowupListPageModule {}
