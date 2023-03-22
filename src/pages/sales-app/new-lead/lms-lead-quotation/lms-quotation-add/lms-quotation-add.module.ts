import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsQuotationAddPage } from './lms-quotation-add';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    LmsQuotationAddPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsQuotationAddPage),
    IonicSelectableModule

  ],
})
export class LmsQuotationAddPageModule {}
