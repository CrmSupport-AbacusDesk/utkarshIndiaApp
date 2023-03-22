import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportDetailPage } from './support-detail';

@NgModule({
  declarations: [
    SupportDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SupportDetailPage),
  ],
})
export class SupportDetailPageModule {}
