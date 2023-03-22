import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequirementlistPage } from './requirementlist';

@NgModule({
  declarations: [
    RequirementlistPage,
  ],
  imports: [
    IonicPageModule.forChild(RequirementlistPage),
  ],
})
export class RequirementlistPageModule {}
