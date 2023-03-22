import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, App, ToastController, PopoverController, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { AddLeavePage } from '../add-leave/add-leave';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-leave-list',
  templateUrl: 'leave-list.html',
})
export class LeaveListPage {
  [x: string]: any;
  data: any = [];
  leave_data: any = [];
  loading: Loading;
  load_data: any = 0
  leaveType: any = "My";
  leaveStatus: any = 'Pending';
  leave_data_count: any = {};
  leaveMasterType:any={};
  filter: any = {};
  user_list: any = [];
  flag: any = '';
  name: any = []
  expense: any = []
  travel_from: any
  selectData: any = {};
  UserId: any;
  teamCount: any;
  constructor(public storage: Storage, public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public app: App, public toastCtrl: ToastController, public modalCtrl: ModalController,) {
    this.travel_from = this.navParams.get('from');
    if (this.navParams.get('from') == 'leave') {
      this.leaveType = "Team"
    }
    if (this.navParams.get('from') == 'Team') {
      this.leaveType = "Team"
      this.getuserlist();
    }

    this.storage.get('userId').then((resp) => {
      this.userId = resp


    });
    this.storage.get('displayName').then((displayName) => {

      if (typeof (displayName) !== 'undefined' && displayName) {
        this.expense.userName = displayName;

      }
    });


  }

  ionViewDidEnter() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    this.leave_list();
  }

  addPage() {
    this.navCtrl.push(AddLeavePage);
  }
  leave_list() {
    this.serve.presentLoading();
    this.filter.limit = 20;
    this.filter.start = 0;

    if (this.selectData.team) {
      this.filter.team_id = this.selectData.team.id;
      this.UserId = this.selectData.team.id;
      this.filter.team = this.selectData.team.name;
    }
    this.load_data = 0
    this.serve.addData({ 'Mode': this.leaveType, 'Status': this.leaveStatus, 'User_id': this.UserId, 'filter': this.filter }, 'AppLeave/leaveList').then((resp) => {
      if (resp['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.leave_data = resp['result'];
        this.leave_data_count = resp['count'];
        this.leaveMasterType = resp['leaveTypes'];
        this.filter.start = this.leave_data.length
        this.load_data = 1

      } else {
        this.leave_data = [];
        this.leave_data_count = {};
        this.filter.start = 0
        this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    });
  }
  doRefresh(refresher) {
    if (this.search)
      this.search = {}
    this.leave_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  loadData(infiniteScroll) {
    this.filter.start = this.leave_data.length
    this.serve.addData({ 'Mode': this.leaveType, 'Status': this.leaveStatus, 'User_id': this.UserId, 'filter': this.filter }, 'AppLeave/leaveList').then((resp) => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.leave_data = this.leave_data.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }

  getuserlist() {

    this.storage.get('userId').then((id) => {
      this.userId = id;

      this.serve.addData({ 'user_id': this.userId }, 'AppLeave/allASM').then((result) => {
        if (result['statusCode'] == 200) {
          this.user_list = result['asm_id'];
        } else {
          this.serve.dismissLoading();
          this.serve.errorToast(result['statusMsg'])
        }

      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    });
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'Leaves' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.leaveType = resultData.TabStatus;
        if (this.leaveType == 'Team') {
          this.getuserlist()
        }
        this.leave_list();
        this.selectData = {};
        this.filter = {};
      }

    })

  }
  statusModal(id) {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'leaveId': id, 'from': 'leave' });

    modal.onDidDismiss(data => {
      this.leave_list()
    });

    modal.present();
  }

}
