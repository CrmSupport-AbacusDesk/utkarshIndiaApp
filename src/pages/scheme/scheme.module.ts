import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchemePage } from './scheme';

@NgModule({
  declarations: [
    SchemePage,
  ],
  imports: [
    IonicPageModule.forChild(SchemePage),
  ],
})
export class SchemePageModule {}
