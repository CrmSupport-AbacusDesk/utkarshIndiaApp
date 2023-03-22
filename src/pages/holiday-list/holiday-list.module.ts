import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HolidayListPage } from './holiday-list';

@NgModule({
  declarations: [
    HolidayListPage,
  ],
  imports: [
    IonicPageModule.forChild(HolidayListPage),
  ],
})
export class HolidayListPageModule {}
