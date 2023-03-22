import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorMeetAddPage } from './contractor-meet-add';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    ContractorMeetAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorMeetAddPage),
    IonicSelectableModule
  ],
})
export class ContractorMeetAddPageModule {}
