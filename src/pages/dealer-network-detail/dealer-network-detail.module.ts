import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerNetworkDetailPage } from './dealer-network-detail';

@NgModule({
  declarations: [
    DealerNetworkDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerNetworkDetailPage),
  ],
})
export class DealerNetworkDetailPageModule {}
