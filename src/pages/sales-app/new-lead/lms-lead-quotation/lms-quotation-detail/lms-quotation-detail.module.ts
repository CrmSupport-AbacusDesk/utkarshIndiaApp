import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsQuotationDetailPage } from './lms-quotation-detail';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    LmsQuotationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsQuotationDetailPage),
    IonicSelectableModule
  ],
})
export class LmsQuotationDetailPageModule {}
