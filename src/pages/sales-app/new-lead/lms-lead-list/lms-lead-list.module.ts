import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsLeadListPage } from './lms-lead-list';

@NgModule({
  declarations: [
    LmsLeadListPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsLeadListPage),
  ],
})
export class LmsLeadListPageModule {}
