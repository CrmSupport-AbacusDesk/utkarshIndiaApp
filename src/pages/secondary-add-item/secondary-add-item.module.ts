import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondaryAddItemPage } from './secondary-add-item';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    SecondaryAddItemPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondaryAddItemPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SecondaryAddItemPageModule {}
