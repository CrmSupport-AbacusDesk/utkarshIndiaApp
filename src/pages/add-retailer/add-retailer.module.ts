import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddRetailerPage } from './add-retailer';

@NgModule({
  declarations: [
    AddRetailerPage,
  ],
  imports: [
    IonicPageModule.forChild(AddRetailerPage),
    IonicSelectableModule

  ],
})
export class AddRetailerPageModule {}
