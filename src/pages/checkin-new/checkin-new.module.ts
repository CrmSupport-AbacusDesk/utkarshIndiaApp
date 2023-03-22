import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { CheckinNewPage } from './checkin-new';

@NgModule({
  declarations: [
    CheckinNewPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckinNewPage),
    IonicSelectableModule
  ],
})
export class CheckinNewPageModule {}
