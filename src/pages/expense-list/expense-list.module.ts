import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpenseListPage } from './expense-list';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    ExpenseListPage,
  ],
  imports: [
    IonicPageModule.forChild(ExpenseListPage),
    IonicSelectableModule
  ],
})
export class ExpenseListPageModule {}
