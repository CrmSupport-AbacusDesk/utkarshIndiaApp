import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the TravelEditNewPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-travel-edit-new',
  templateUrl: 'travel-edit-new.html',
})
export class TravelEditNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  
  data: any = {};
  cityList: any = [];
  retailerList: any = [];
  planList: any = [];
  planDate: any;
  spinner: boolean = false
  userId:any;
  pageName:any;
  date_from:any;
  already_exsist : boolean = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider) {
    this.serve.presentLoading();
  }
  
  ionViewDidLoad() {
    this.data.travel_type = 'Retailer';
    this.date_from = this.navParams.get('date');
    this.userId = this.navParams.get('user_id');
    this.pageName = this.navParams.get('page');
    console.log(this.pageName);
    if (this.date_from) {
      this.GET_TRAVLE_DETAIL();
    }
    this.GET_RETAILER_LIST();
    
    
    
    
    
  }
  
  
  GET_RETAILER_LIST() {
    
    this.serve.addData({'dr_type': '3'},  'AppTravelPlan/getRetailerList').then((result) => {
      
      if(result['statusCode']==200){
        this.retailerList = result['result'];
        
      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
    }, err => {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')
    });
  }
  a:any
  addToList() {
    

    this.already_exsist = false
      this.data.retailer=this.data.id.company_name;
      this.data.dr_id = this.data.id.id
      this.data.id = this.data.dr_id
      if(this.planList.length <= 0){
      this.planList.push(JSON.parse(JSON.stringify(this.data)))
      this.data.status_remark= ''
      
      this.data = {}
      }else{
        let isExistIndex:any;
         isExistIndex = this.planList.findIndex(row => row.dr_id == this.data.dr_id)
      if(isExistIndex == -1 ){
        this.planList.push(JSON.parse(JSON.stringify(this.data)));
        this.data.status_remark= ''
        this.data = {}
      }
      else{
        this.serve.errorToast("This Retailer Already added")
       this.data = {}
      this.data.status_remark= ''
      

        this.already_exsist = true
      }
    }
   
    
    
  }
  
  savePlanList() {
this.spinner = true    
    this.serve.addData({ 'travel_item_data': this.planList, 'travel_date': this.date_from }, 'AppTravelPlan/addTravelPlan').then((result) => {
      if(result['statusCode']==200){
this.spinner = false
        this.serve.successToast(result['statusMsg'])
        this.navCtrl.pop();
      }else{
this.spinner = false

        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  
  GET_TRAVLE_DETAIL() {
    
    this.serve.addData({'User_id':this.userId, 'Travel_date': this.date_from }, 'AppTravelPlan/travelPlanDetail').then((result) => {
      
      if(result['statusCode']==200){
        this.serve.dismissLoading();
        if(result['result']['tarvel_plan_detail']){
          this.planList = result['result']['tarvel_plan_detail'];
          
        }
      }else{
        this.planList = result['result'];
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }      
    }, err => {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')
    });
  }
  
  removePlanList(index) {
    this.planList.splice(index, 1);
  }
  
  
}
