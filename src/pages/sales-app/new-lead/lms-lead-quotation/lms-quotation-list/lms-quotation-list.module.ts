import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LmsQuotationListPage } from './lms-quotation-list';

@NgModule({
  declarations: [
    LmsQuotationListPage,
  ],
  imports: [
    IonicPageModule.forChild(LmsQuotationListPage),
  ],
})
export class LmsQuotationListPageModule {}
