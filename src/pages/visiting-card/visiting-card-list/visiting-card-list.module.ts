import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitingCardListPage } from './visiting-card-list';

@NgModule({
  declarations: [
    VisitingCardListPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitingCardListPage),
  ],
})
export class VisitingCardListPageModule {}
