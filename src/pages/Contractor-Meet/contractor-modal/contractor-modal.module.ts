import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractorModalPage } from './contractor-modal';

@NgModule({
  declarations: [
    ContractorModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractorModalPage),
  ],
})
export class ContractorModalPageModule {}
