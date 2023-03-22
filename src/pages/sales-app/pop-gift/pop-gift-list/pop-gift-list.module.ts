import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopGiftListPage } from './pop-gift-list';

@NgModule({
  declarations: [
    PopGiftListPage,
  ],
  imports: [
    IonicPageModule.forChild(PopGiftListPage),
  ],
})
export class PopGiftListPageModule {}
