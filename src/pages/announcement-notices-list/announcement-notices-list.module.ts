import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnnouncementNoticesListPage } from './announcement-notices-list';

@NgModule({
  declarations: [
    AnnouncementNoticesListPage,
  ],
  imports: [
    IonicPageModule.forChild(AnnouncementNoticesListPage),
  ],
})
export class AnnouncementNoticesListPageModule {}
