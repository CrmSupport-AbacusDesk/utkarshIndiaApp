import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeaveListPage } from './leave-list';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    LeaveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LeaveListPage),
    IonicSelectableModule
  ],
})
export class LeaveListPageModule {}
