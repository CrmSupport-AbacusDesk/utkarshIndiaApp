import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrimaryOrderAddPage } from './primary-order-add';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    PrimaryOrderAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PrimaryOrderAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class PrimaryOrderAddPageModule {}
