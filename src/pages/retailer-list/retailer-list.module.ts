import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RetailerListPage } from './retailer-list';

@NgModule({
  declarations: [
    RetailerListPage,
  ],
  imports: [
    IonicPageModule.forChild(RetailerListPage),
  ],
})
export class RetailerListPageModule {}
