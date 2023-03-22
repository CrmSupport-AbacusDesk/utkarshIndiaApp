import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ConstantProvider } from '../../providers/constant/constant';
/**
 * Generated class for the AddRetailerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
    selector: 'page-dealer-executive-app',
    templateUrl: 'dealer-executive-app.html',
})
export class DealerExecutiveAppPage {
    LoginType : any ;
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider,
     public toastCtrl: ToastController, public loadingCtrl: LoadingController,
      private alertCtrl: AlertController, public constant : ConstantProvider) {
        this.LoginType = this.constant.UserLoggedInData.loggedInUserType
  }

  ionViewDidLoad() {
    this.get_states();
    this.get_district();
    this.get_distributor()

    if (this.navParams.get('data')) {
      this.form = this.navParams.get('data');
      this.form.dob = this.form.date_of_birth
      this.form.doa = this.form.date_of_anniversary
      this.get_district();

    }
  }
  form: any = {};
  state_list: any = [];
  district_list: any = [];
  distributor_list: any = [];
  savingFlag:boolean=false;
  user_data: any = {};
  get_states() {
    this.serve.presentLoading()
    this.serve.addData({}, "AppCustomerNetwork/getStates")
      .then(resp => {
        if(resp['statusCode'] == 200){
      this.serve.dismissLoading()
        this.state_list = resp['state_list'];
        }else{
      this.serve.dismissLoading()
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }
  get_distributor() {
    this.serve.addData({ 'Type': 1, 'Mode': 'Team' }, 'AppCustomerNetwork/distributorLists').then((resp) => {
      if(resp['statusCode'] == 200){
      this.distributor_list = resp['result'];
      }else{
        this.serve.errorToast(resp['statusMsg']);

      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })
    
  }
  city_list: any[]
  area_list: any[]

  getCityList() {
    this.form.city1 = [];

    this.serve.addData({ 'district_name': this.form.district, 'state_name': this.form.state }, 'AppCustomerNetwork/getCity').then((result) => {
      if(result['statusCode'] == 200){
      this.city_list = result['city'];
      }else{
        this.serve.errorToast(result['statusMsg']);

      }


    },err => {
      this.serve.errorToast('Something Went Wrong!')
    });
  
  }
  form1: any = {};

  selectarea() {
    this.form1.state = this.form.state;
    this.form1.district = this.form.district;
    this.form1.city = this.form.city;
    this.serve.addData(this.form1, "AppCustomerNetwork/getArea")
      .then(resp => {
        if(resp['statusCode'] == 200){
        this.area_list = resp['area'];
        this.form.area = '';
        }else{
          this.serve.errorToast(resp['statusMsg']);

        }
      },
        err => {
          this.serve.errorToast('Something Went Wrong!')
        })
  }

  save_retailer() {
    this.savingFlag=true;
    if (!this.form.assign_dr_id) {
      this.serve.errorToast('Please Select Distributor!')
    }
    if (this.constant.UserLoggedInData.id) {
        this.form.assign_dr_id = this.constant.UserLoggedInData.id
      }
    this.form.type_id = 3;
    this.serve.addData({ "data": this.form }, "AppCustomerNetwork/addDealer")
      .then(resp => {
        if(resp['statusCode'] == 200){
          this.savingFlag=false;
            this.serve.successToast(resp['statusMsg']);
            this.navCtrl.pop();
          
        }else{
          this.savingFlag=false;
          this.serve.errorToast(resp['statusMsg']);
        }
      }, error => {
        this.savingFlag=false;
        this.serve.Error_msg(error);
        this.serve.dismiss();
      })
  }
  get_district() {
    this.serve.addData({ "state_name": this.form.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if(resp['statusCode'] == 200){
        this.district_list = resp['district_list'];
        }else{
          this.serve.errorToast(resp['statusMsg']);
        }
      },
        err => {
          this.serve.errorToast('Something Went Wrong!')
        })
  }
  checkExist = false
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }


}
