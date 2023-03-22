import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitingCardPage } from './visiting-card';

@NgModule({
  declarations: [
    VisitingCardPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitingCardPage),
  ],
})
export class VisitingCardPageModule {}
