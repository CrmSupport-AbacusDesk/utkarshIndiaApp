import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsActivityListPage } from './lms-activity-list';

@NgModule({
  declarations: [
    LmsActivityListPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsActivityListPage),
  ],
})
export class LmsActivityListPageModule {}
