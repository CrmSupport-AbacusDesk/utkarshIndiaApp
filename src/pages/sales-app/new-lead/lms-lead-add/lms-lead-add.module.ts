import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsLeadAddPage } from './lms-lead-add';

@NgModule({
  declarations: [
    LmsLeadAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsLeadAddPage),
  ],
})
export class LmsLeadAddPageModule {}
