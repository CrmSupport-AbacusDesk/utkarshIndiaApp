import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsFollowupAddPage } from './lms-followup-add';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    LmsFollowupAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsFollowupAddPage),
    IonicSelectableModule
  ],
})
export class LmsFollowupAddPageModule {}
