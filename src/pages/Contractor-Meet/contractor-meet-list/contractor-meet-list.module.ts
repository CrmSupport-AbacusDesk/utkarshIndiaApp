import { NgModule } from '@angular/core';
import {  IonicPageModule } from 'ionic-angular';
import { ContractorMeetListPage } from './contractor-meet-list';

@NgModule({
  declarations: [
    ContractorMeetListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorMeetListPage),
  ],
})
export class ContractorMeetListPageModule {}
