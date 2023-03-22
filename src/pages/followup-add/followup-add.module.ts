import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowupAddPage } from './followup-add';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    FollowupAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowupAddPage),
    IonicSelectableModule
  ],
})
export class FollowupAddPageModule {}
