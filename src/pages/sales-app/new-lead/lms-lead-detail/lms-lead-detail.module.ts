import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsLeadDetailPage } from './lms-lead-detail';

@NgModule({
  declarations: [
    LmsLeadDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsLeadDetailPage),
  ],
})
export class LmsLeadDetailPageModule {}
