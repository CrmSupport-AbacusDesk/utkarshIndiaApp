import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { IonicSelectableComponent } from 'ionic-selectable';
import { LmsActivityAddPage } from './lms-activity-add';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    LmsActivityAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsActivityAddPage),
    IonicSelectableModule
  ],
})
export class LmsActivityAddPageModule {}
