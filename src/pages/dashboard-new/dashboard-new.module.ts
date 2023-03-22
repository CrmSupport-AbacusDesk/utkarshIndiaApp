import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardNewPage } from './dashboard-new';

@NgModule({
  declarations: [
    DashboardNewPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardNewPage),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class DashboardNewPageModule {}
