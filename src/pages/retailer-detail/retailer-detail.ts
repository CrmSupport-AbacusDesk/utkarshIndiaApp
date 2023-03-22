import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,PopoverController,AlertController} from 'ionic-angular';
import { PrimaryOrderPage } from '../primary-order/primary-order';
import { UploadFilePage } from '../upload-file/upload-file';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { SchemePage } from '../scheme/scheme';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { SecondaryOrderPage } from '../secondary-order/secondary-order';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import { PopGiftOutgoingPage } from '../sales-app/pop-gift/pop-gift-outgoing/pop-gift-outgoing';
import { DistributorPopHistoryPage } from '../distributor-pop-history/distributor-pop-history';
/**
 * Generated class for the RetailerDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-retailer-detail',
  templateUrl: 'retailer-detail.html',
})
export class RetailerDetailPage {
 items:any=[];
 Distributors:any=[];
 retailer_detail : any = {};
 DrType : any = '3';
 Type : any;
 Id : any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public serve:MyserviceProvider ,private alertController: AlertController) {
    this.Id = this.navParams.get('id')
    this.retailer_data()
  }


 presentAlert() {
  let alert = this.alertController.create({
    title: 'Alert',
    subTitle: 'Something went wrong ! Please try again',
    buttons: ['Dismiss']
  });
  alert.present();
}
  
 presentPopover(myEvent) {
  let popover = this.popoverCtrl.create(TravelPopOverPage, {'from': 'leads-details', 'dr_type':this.DrType });

  popover.present({
    ev: myEvent
  });

  popover.onDidDismiss(resultData => {

  })

}
retailer_data()
{
    this.serve.presentLoading();
    
    this.serve.addData({'Id':this.Id},"AppCustomerNetwork/dealerDetails").then(resp=>
    {
     if(resp['statusCode'] == 200) {
        this.retailer_detail = resp['result'];
        this.Distributors = resp['result']['Assigned_Distributor']
        this.serve.dismissLoading()
     }else{
      this.serve.errorToast(resp['statusMsg'])
     this.serve.dismissLoading()
     }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
    
}
Go_to(type){
if(type == 'Scheme'){

  this.navCtrl.push(SchemePage,{'dr_id' : this.Id})
}else if(type == 'pop'){
  // this.navCtrl.push(DistributorPopHistoryPage ,{'dr_id' : this.Id,'type':'retailer'}) 
  this.navCtrl.push(PopGiftListPage); 

}else if(type == 'checkin'){
  this.navCtrl.push(CheckinListPage,{'dr_id' : this.Id})

}else if(type == 'order'){
  this.navCtrl.push(SecondaryOrderPage,{'from':'retailer','dr_id' : this.Id})
}

}
}
