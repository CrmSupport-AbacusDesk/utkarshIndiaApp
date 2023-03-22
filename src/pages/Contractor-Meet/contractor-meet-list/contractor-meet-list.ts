import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, PopoverController, NavParams, ToastController } from 'ionic-angular';
import { ContractorMeetAddPage } from '../contractor-meet-add/contractor-meet-add';
import { ContractorMeetDetailPage } from '../contractor-meet-detail/contractor-meet-detail';
import { ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';
import { TravelPopOverPage } from '../../travel-pop-over/travel-pop-over';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-contractor-meet-list',
  templateUrl: 'contractor-meet-list.html',
})
export class ContractorMeetListPage {
  data: any = [];
  data1: any;
  flag: any = '';
  search: any;
  teamCount: any;
  contractor: any = {};
  currentPage: any = 1;
  pageSize = 2;
  TargetType: any = 'Visit';
  start: any = 0;
  limit: any = 5;
  meet_Type: any = 'My';
  user_data: any = {};
  filter: any = {};
  userId: any;
  user_list: any;
  allcount: any = {};
  tabActiveType: any = 'Pending'
  constructor(public storage: Storage, public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public modalCtrl: ModalController, public service1: MyserviceProvider, public service: DbserviceProvider, public attendence_serv: AttendenceserviceProvider, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    this.getuserlist()
    
  }
  
  close(type) {
    this.meet_Type = type;
  }
  
  
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Event' });
    
    popover.present({
      ev: myEvent
    });
    
    popover.onDidDismiss(resultData => {
      
      
      if (resultData) {
        this.meet_Type = resultData.TabStatus;
        if(this.meet_Type == 'Team'){
          this.getuserlist()
        }
        this.getContractorMeetList(this.meet_Type, this.tabActiveType)
      }
    })
    
  }
  
  ionViewWillEnter() {
    
   this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
  });
    this.getContractorMeetList(this.meet_Type, this.tabActiveType);
    
    
  }
  
  contractorMeetAdd() {
    this.navCtrl.push(ContractorMeetAddPage, { 'created_by': this.user_data.id });
  }
  
  
  listdelete(e: any, id) {
    e.stopPropagation();
    let alert = this.alertCtrl.create({
      title: 'Delete Event',
      message: 'Do you want to delete event?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.service1.addData({ 'id': id }, 'AppEvent/deleteMeeting').then((result) => {
              if (result['statusCode'] == 200) {
                this.service1.dismissLoading();
                this.service1.successToast(result['statusMsg'])
                this.contractor = result;
           
                this.getContractorMeetList(this.meet_Type, this.tabActiveType);
              } else {
                this.service1.dismissLoading();
                this.service1.errorToast(result['statusMsg'])
              }
              
            }, error => {
              this.service1.Error_msg(error);
              this.service1.dismiss();
            });
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
    
  }
  
  

  
  getuserlist() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.service1.addData({ 'user_id': this.userId }, 'AppEvent/allASM').then((result) => {
        if (result['statusCode'] == 200) {
          this.user_list = result['asm_id'];
        } else {
          this.service1.errorToast(result['statusMsg'])
        }
      }, error => {
        this.service1.Error_msg(error);
        this.service1.dismiss();
      });
    });
  }
  
  contractorMeetDetail(e: any, id) {
    this.navCtrl.push(ContractorMeetDetailPage, { 'meeting_id': id, 'status': this.tabActiveType })
    e.stopPropagation();
  }
  
  
  getContractorMeetList(meetType, status) {
    this.filter.limit = 20;
    this.filter.start = 0;
    this.service1.presentLoading();
    this.service1.addData({ 'Mode': meetType, 'Status': status, 'filter': this.filter }, 'AppEvent/eventList').then((response) => {
      if (response['statusCode'] == 200) {
        this.service1.dismissLoading();
        this.data = response['result'];
        this.allcount = response['count']
      } else {
        this.service1.dismissLoading();
        this.service1.errorToast(response['statusMsg'])
      }
    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });
  }
  
  doRefresh(refresher) {
    if (this.search)
    this.search = {}
    
    this.limit = 0
    
    this.getContractorMeetList(this.meet_Type, this.tabActiveType)
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  loadData(infiniteScroll) {
    this.filter.start = this.data.length;
    
    this.service1.addData({ 'Mode': this.meet_Type, 'Status': this.tabActiveType, 'filter': this.filter }, 'AppEvent/eventList').then((r) => {
      if (r == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.data = this.data.concat(r['gift_master_list']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });
  }
  
}