import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserTargetPage } from './user-target';

@NgModule({
  declarations: [
    UserTargetPage,
  ],
  imports: [
    IonicPageModule.forChild(UserTargetPage),
  ],
})
export class UserTargetPageModule {}
