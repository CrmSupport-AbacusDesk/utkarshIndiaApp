import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportListPage } from './support-list';

@NgModule({
  declarations: [
    SupportListPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportListPage),
  ],
})
export class SupportListPageModule {}
