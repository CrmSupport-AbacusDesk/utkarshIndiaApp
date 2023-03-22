import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyCataloguePage } from './loyalty-catalogue';

@NgModule({
  declarations: [
    LoyaltyCataloguePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyCataloguePage),
  ],
})
export class LoyaltyCataloguePageModule {}
