import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetPage } from './target';
import { IonicSelectableModule } from 'ionic-selectable';
@NgModule({
  declarations: [
    TargetPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetPage),
    IonicSelectableModule

  ],
})
export class TargetPageModule {}
