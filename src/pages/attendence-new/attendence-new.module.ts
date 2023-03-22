import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendenceNewPage } from './attendence-new';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    AttendenceNewPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendenceNewPage),
    IonicSelectableModule
  ],
})
export class AttendenceNewPageModule {}
