import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitingCardAddPage } from './visiting-card-add';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    VisitingCardAddPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitingCardAddPage),
    // NgxMatSelectSearchModule

  ],
})
export class VisitingCardAddPageModule {}
