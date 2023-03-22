import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { PartyTargetPage } from '../party-target/party-target';

/**
 * Generated class for the UserTargetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-target',
  templateUrl: 'user-target.html',
})
export class UserTargetPage {
  salesUserTarget:any = []
  userType:any;
  constructor(public service: MyserviceProvider, public navCtrl: NavController, public navParams: NavParams) {
    (navParams.get('type') != undefined)?
    this.userType = navParams.get('type'):null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserTargetPage');
  }

  ionViewWillEnter() {
    this.getSalesUserTarget()
  }
  
  goToTarget(){
    this.navCtrl.push(PartyTargetPage); 
  }
  getDashboardPrimaryTargetOfSalesUser
  
  getSalesUserTarget(id:any=''){
    this.service.presentLoading();
    let apiName = '';
    this.salesUserTarget=[];
    console.log(id);
    if(this.userType=='primary'){
      apiName = 'AppDashboard/getDashboardPrimaryTargetOfSalesUser'
    }else if(this.userType=='secondary'){
      apiName = 'AppDashboard/getDashboardSecondaryTargetOfSalesUser'
    }
    this.service.addData({id}, apiName).then((response) => {
      if(response['statusCode']==200){
        this.salesUserTarget = response['TargetData']
         this.service.dismissLoading()
      }else{
         this.service.dismissLoading()
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
    })
  }

}
