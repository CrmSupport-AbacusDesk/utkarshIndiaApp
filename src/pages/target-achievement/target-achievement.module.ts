import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TargetAchievementPage } from './target-achievement';

@NgModule({
  declarations: [
    TargetAchievementPage,
  ],
  imports: [
    IonicPageModule.forChild(TargetAchievementPage),
  ],
})
export class TargetAchievementPageModule {}
