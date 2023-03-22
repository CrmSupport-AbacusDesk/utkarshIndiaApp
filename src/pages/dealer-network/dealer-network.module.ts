import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerNetworkPage } from './dealer-network';

@NgModule({
  declarations: [
    DealerNetworkPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerNetworkPage),
  ],
})
export class DealerNetworkPageModule {}
