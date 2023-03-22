import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Loading, PopoverController, ModalController } from 'ionic-angular';
import { FollowupAddPage } from '../followup-add/followup-add';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { FollowupDetailPage } from '../followup-detail/followup-detail';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';



@IonicPage()
@Component({
  selector: 'page-followup-list',
  templateUrl: 'followup-list.html',
})
export class FollowupListPage {
  today_date = new Date().toISOString().slice(0, 10);
  today = new Date().toISOString().slice(0, 10);
  followupList: any = [];
  selected_date = new Date().toISOString().slice(0, 10);
  tomorrow_data : any
  loading: Loading;
  userId: any;
  teamCount: any;
  requestSend: any = false;
  user_data: any = {};
  see_more_button: any = 0;
  filter: any = {};
  complete_count: any;
  pending_count: any;
  followType: any = "My";
  followup_status: any = "Pending";
  load_data: any = 0

  
  upcoming_count: any;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public attendence_serv: AttendenceserviceProvider,
    public modalCtrl : ModalController
    ) {
      this.today = moment(this.today).add(1, 'days').format('YYYY-MM-DD');
      this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-MM-DD');
      this.followup_status = this.filter.status
      this.storage.get('userId').then((id) => {
        this.userId = id;
      });
      this.filter.status = 'Pending'
      this.serve.presentLoading();
      this.storage.get('team_count').then((team_count) => {
        this.teamCount = team_count;
    });
    }

  ionViewDidEnter() {
   
    this.getFollowup();
  }

  goOnAddFollowup() {
    this.navCtrl.push(FollowupAddPage, {'user_id':this.userId})
  }



  ChangeDate(type) {
    if (type == 'previous') {
      this.selected_date = moment(this.selected_date).subtract(1, "days").format('YYYY-MM-DD');
      
      this.filter.date = this.selected_date;
    } else {

      this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-MM-DD');
      this.filter.date = this.selected_date;
    }
    
   
    this.getFollowup();

  }


  id: any;
  
  getFollowup(date=this.selected_date) {
    console.log(this.selected_date)
    this.filter.limit=20;
    this.filter.start=0; 
    this.followup_status = this.filter.status
    date!==this.selected_date?(this.filter.date = date, this.selected_date=date):this.filter.date=this.selected_date;
    this.load_data = 0
    if(this.filter.status != "Upcoming"){
      this.filter.date = " "
    }
    this.serve.addData({ 'Date': this.filter.date, 'Status':this.filter.status, 'Mode':this.followType, 'filter':this.filter}, 'AppFollowup/followupListInfo').then((result) => {

      if(result['statusCode']=200){
        this.serve.dismissLoading();
        this.followupList = result['result'];
        this.requestSend = true
        this.load_data = 1

      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'followup' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.followType = resultData.TabStatus;
        this.getFollowup()
      }

    })

  }

  go_to_followup_detail(id) {
    this.navCtrl.push(FollowupDetailPage, { 'follow_up_id': id, 'from': 'follow_up_list_page' })
  }
  statusModal(id,index) 
  {
    console.log('Index',index)
    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'follow_up_id':id,'from':'followup','followup_detail':index});
    
    modal.onDidDismiss(data =>
      {
        if (data == true) {
          this.getFollowup()
        }
      });
      
      modal.present();
    }
  flag:any='';
  loadData(infiniteScroll)
  {
    this.filter.start=this.followupList.length;
    
    this.serve.addData({ 'Date': this.filter.date, 'Status':this.filter.status, 'Mode':this.followType, 'filter':this.filter}, 'AppFollowup/followupListInfo').then( (r) =>
    {
      if(r=='')
      {
        this.flag=1;
      }
      else
      {
        setTimeout(()=>{
          this.followupList=this.followupList.concat(r['result']);
          infiniteScroll.complete();
        },1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  doRefresh(refresher) {

  this.getFollowup()
    setTimeout(() => {
        refresher.complete();
    }, 1000);
}
  deleteFollowUp(id, i) {

    let alert = this.alertCtrl.create({
      title: 'Delete Follow Up',
      message: 'Do you want to delete Follow Up?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {

            this.serve.addData({ 'Id': id }, 'AppFollowup/followupDelete').then((result) => {
              if(result['statusCode']==200){
                this.serve.successToast(result['statusMsg'])
                  this.followupList.splice(i, 1);
                  this.getFollowup();
                
              }else{
                this.serve.errorToast(result['statusMsg'])
              }
            }, error => {
              this.serve.Error_msg(error);
              this.serve.dismiss();
            });
          }
        }
       
      ]
    });
    alert.present();

  }
  
}
