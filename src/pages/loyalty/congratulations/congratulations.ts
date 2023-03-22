import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DealerHomePage } from '../../dealer-home/dealer-home';
import { LoyaltyHomePage } from '../loyalty-home/loyalty-home';

/**
* Generated class for the CongratulationsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-congratulations',
  templateUrl: 'congratulations.html',
})
export class CongratulationsPage {
  
  scanPoint :any ={};
  bonusPoint :any ={};
  userType:any;
  type:any ={};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController ) {
    this.scanPoint = navParams.data.scan_point;
    this.bonusPoint = navParams.data.bonus_point;
    this.userType = navParams.data.user_type;
    console.log('====================================');
    console.log(this.userType);
    console.log('====================================');
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CongratulationsPage');
  }
  
  goToPoint()
  {
    if(this.userType == 'retailer'){
      this.navCtrl.setRoot(DealerHomePage);
    }
    else{
      this.navCtrl.setRoot(LoyaltyHomePage);
    }
    this.viewCtrl.dismiss();
  }
  
}
