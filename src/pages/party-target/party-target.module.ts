import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartyTargetPage } from './party-target';

@NgModule({
  declarations: [
    PartyTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(PartyTargetPage),
  ],
})
export class PartyTargetPageModule {}
