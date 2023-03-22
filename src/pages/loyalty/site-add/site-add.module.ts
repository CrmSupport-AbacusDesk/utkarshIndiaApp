import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteAddPage } from './site-add';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    SiteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SiteAddPageModule {}
