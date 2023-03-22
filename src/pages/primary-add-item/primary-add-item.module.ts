import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimaryAddItemPage } from './primary-add-item';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    PrimaryAddItemPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryAddItemPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class PrimaryAddItemPageModule {}
