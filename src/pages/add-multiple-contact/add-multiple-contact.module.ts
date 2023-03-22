import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMultipleContactPage } from './add-multiple-contact';

@NgModule({
  declarations: [
    AddMultipleContactPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMultipleContactPage),
  ],
})
export class AddMultipleContactPageModule {}
