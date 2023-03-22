import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryOrderAddPage } from './secondary-order-add';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    SecondaryOrderAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryOrderAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SecondaryOrderAddPageModule {}
