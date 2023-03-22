import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitingCardModalPage } from './visiting-card-modal';

@NgModule({
  declarations: [
    VisitingCardModalPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitingCardModalPage),
  ],
})
export class VisitingCardModalPageModule {}
