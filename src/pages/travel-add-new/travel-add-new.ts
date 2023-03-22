import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';

@IonicPage()
@Component({
  selector: 'page-travel-add-new',
  templateUrl: 'travel-add-new.html',
})
export class TravelAddNewPage {
  tarvel_date: any;
  planList: any = [];
  userId: any;
  status: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.tarvel_date = this.navParams.get('date') || 'N/A';
    this.userId = this.navParams.get('user_id') || 'N/A';

    console.log('add page landing')

    this.GET_TRAVLE_DETAIL();
  }

  GET_TRAVLE_DETAIL() {
    this.serve.presentLoading()
    this.serve.addData({ 'User_id': this.userId, 'Travel_date': this.tarvel_date }, 'AppTravelPlan/travelPlanDetail').then((result) => {
      
      if (result['statusCode'] == 200) {
        this.planList = result['result']['tarvel_plan_detail'];
        this.serve.dismissLoading();
        if(result['result']['tarvel_plan_detail']){
          this.status = result['result']['travel_status'];
        }else{
          this.navCtrl.pop();
          this.serve.errorToast(result['statusMsg'])
        }
        
      }
      else{
        
        this.planList = []
        
        this.serve.errorToast(result['statusMsg'])
        this.serve.dismissLoading();
        this.navCtrl.push(TravelListNewPage, { from: 'travel', view_type:'My'});

      }
    }, err => {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')
    });
  }


  removePlanList(id) {
    // this.serve.presentLoading()
    this.serve.addData({ 'travel_id': id }, 'AppTravelPlan/deleteTravelPlan').then((result) => {
      // if(result['statusCode']==200){
      //  this.serve.successToast(result['statusMsg'])
      //  this.GET_TRAVLE_DETAIL();
      // }else{
      // this.serve.errorToast(result['statusMsg'])
      //  this.GET_TRAVLE_DETAIL();
      // }
      this.serve.errorToast('successfully deleted')
      
      this.GET_TRAVLE_DETAIL();

      // this.serve.dismissLoading();
    }, err => {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')
    });
  }

}
