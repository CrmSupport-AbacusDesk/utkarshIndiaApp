import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';

/**
* Generated class for the LoyaltyContactPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-contact',
  templateUrl: 'loyalty-contact.html',
})
export class LoyaltyContactPage {
  contact:any ={};
  constructor(public navCtrl: NavController, public navParams: NavParams, public service:MyserviceProvider) {
    this.contactDetails();
  }
  
  ionViewWillEnter(){
  }
  
  ionViewDidLoad() {
  }
  
 
  
  contactDetails()
  {
    this.service.presentLoading();
    this.service.addData({},'AppContactUs/contactDetail').then((result) =>
    {
      if(result['statusCode'] == 200){
        this.contact = result['contact_detail'];
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    });
  }
}
