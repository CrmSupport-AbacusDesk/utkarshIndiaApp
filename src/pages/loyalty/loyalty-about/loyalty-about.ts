import { Component } from '@angular/core';
import { IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../providers/constant/constant';
/**
* Generated class for the LoyaltyAboutPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-loyalty-about',
  templateUrl: 'loyalty-about.html',
})

export class LoyaltyAboutPage {
  about_data:any={};
  url:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public service:MyserviceProvider , public constant : ConstantProvider) {
    this.url = constant.upload_url1+'about/';
    this.aboutDetail();
  }
  
  
  ionViewDidLoad() {
  }
  
  
  
  aboutDetail()
  {
    this.service.presentLoading();
    this.service.addData({},'AppAboutUs/aboutDetail').then((result) =>
    {
      
      if(result['statusCode'] == 200){
        this.about_data = result['about_detail'];
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
      
    });
  }
}
