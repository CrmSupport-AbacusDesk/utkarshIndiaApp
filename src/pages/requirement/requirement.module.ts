import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequirementPage } from './requirement';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    RequirementPage,
  ],
  imports: [
    IonicPageModule.forChild(RequirementPage),
    IonicSelectableModule
  ],
})
export class RequirementPageModule {}
