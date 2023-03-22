import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyHomePage } from './loyalty-home';
import { IonicSelectableModule } from 'ionic-selectable';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    LoyaltyHomePage,
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyHomePage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class LoyaltyHomePageModule {}
