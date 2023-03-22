import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopGiftAddPage } from './pop-gift-add';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    PopGiftAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PopGiftAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class PopGiftAddPageModule {}
