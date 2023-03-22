import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';

import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';


@IonicPage()
@Component({
  selector: 'page-contractor-meet-add',
  templateUrl: 'contractor-meet-add.html',
})
export class ContractorMeetAddPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  dealer: any = [];
  data: any = {};
  id: any;
  spinner: boolean = false;
  user_data: any = {};
  checkin_id:any;
  followup_data:any={};
  drList:any=[]
  order:any='for event'
  today_date = new Date().toISOString().slice(0, 10);
  max_date = new Date().getFullYear() + 1;
  
  constructor(public navCtrl: NavController, public alertCtrl: AlertController,  public db:MyserviceProvider,public attendence_serv: AttendenceserviceProvider, public navParams: NavParams, public service: DbserviceProvider, public service1: MyserviceProvider) {
    // this.getNetworkType()

    
    
    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('checkinUserID')) {
      this.checkin_id=this.navParams.get('checkin_id');
      
      this.id = this.navParams.get('checkinUserID');
      this.get_dealers();
    }
    else {
      
      this.id = navParams.data.created_by;
      this.get_dealers();
    }
  }
  
  ionViewDidLoad() {
    
  }
  get_network_list(network_type)
  {
    
    
    //this.service1.addData({'type':network_type,'data':this.order},'Distributor/get_type_list')
      this.service1.addData({'dr_type':network_type},'AppEvent/getNetworkList').then((result)=>{
        if(result['statusCode']==200){
        this.drList = result['result'];
        }else{
          this.service1.errorToast(result['statusMsg'])
        }
      });
    
    
    
  }

  get_dealers() {
    // this.service1.show_loading();
    
    
    this.service1.addData({ 'login_id': this.id }, 'AppEvent/getAllDealers').then((response) => {
      
      if (response['statusCode'] == 200) {
        this.dealer = response;
       
      }else{
        this.service1.errorToast(response['statusMsg'])
      }
      // this.service1.dismiss();
      
    }, er => {
      this.service1.dismissLoading();
      this.service1.errorToast('Something went wrong')
    });
  }
  total_person(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  

  
  
  number_checker(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  submit() {
    this.spinner = true
    this.data.created_by = this.id;
    this.data.checkin_id=this.checkin_id;
    this.data.dealer_id = this.data.dealer_id.id
    this.service1.addData({'Date':this.data.date_of_meeting, 'Dr_id':this.data.dealer_id, 'Total_budget':this.data.total_budget, 'Total_member':this.data.total_member, 'Description':this.data.description}, 'AppEvent/addEvent').then((response) => {
      
      if (response['statusCode'] == 200) {
        this.spinner = false

        this.service1.successToast(response['statusMsg']);
        this.navCtrl.pop();
      }else{
        this.spinner = false

        this.service1.dismissLoading();
        this.service1.errorToast(response['statusMsg'])
      }
      
    }, error => {
      this.service1.Error_msg(error);
      this.spinner = false
      this.service1.dismiss();
    });
    
    
    // this.navCtrl.push(ContractorMeetListPage);
  }
  
  
  
  showSuccess(text) {
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
}
