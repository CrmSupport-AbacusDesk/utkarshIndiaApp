import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { MainDistributorListPage } from './main-distributor-list';

@NgModule({
  declarations: [
    MainDistributorListPage,
    
  ],
  imports: [
    IonicPageModule.forChild(MainDistributorListPage),
    IonicSelectableModule
  ],
})
export class MainDistributorListPageModule {}
