import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddVisitingCardPage } from './add-visiting-card';


@NgModule({
  declarations: [
    AddVisitingCardPage,
  ],
  imports: [
    IonicPageModule.forChild(AddVisitingCardPage),
  ],
})
export class AddVisitingCardPageModule {}
