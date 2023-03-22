import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { LeaveListPage } from '../leave-list/leave-list';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';

@IonicPage()
@Component({
  selector: 'page-add-leave',
  templateUrl: 'add-leave.html',
})
export class AddLeavePage {
  data: any = {};
  attend_id: any;
  start_time: any = '';
  stop_time: any = '';
  currentTime: any = '';
  sub_list: any = [];
  spinner : boolean  = false
  today_date = new Date().toISOString().slice(0, 10);
  loading: any;

  currentDay: any = ''
  constructor(public navCtrl: NavController, public attendence_serv: AttendenceserviceProvider, public navParams: NavParams, public serve: MyserviceProvider, public alertCtrl: AlertController, private toastCtrl: ToastController, public loadingCtrl: LoadingController) {
    this.getleaveList()
  }
  ionViewDidLoad() {

    this.currentTime = moment().format("HH:mm:ss");
    this.data.currentDay = moment().format("Y-M-D");

    this.data.type = 'Full Day';
  }

  add_leave() {
    this.spinner = true;
    if (this.data.leave_start_date == this.today_date) {
      if (this.data.type == 'Full Day') {
        this.spinner = false
        this.serve.errorToast('Please Pick another date for Full Day Leave')
      } else {
        this.serve.addData({ 'Type': this.data.type, 'Leave_type': (this.data.leave_type || this.data.short_leave_type), 'Start_date': (this.data.leave_start_date), 'End_data': (this.data.leave_end_date || this.data.leave_start_date), 'Description': this.data.description }, "AppLeave/addLeave").then(response => {
          if (response['statusCode'] == 200) {
            this.spinner = false
            this.serve.successToast(response['statusMsg'])
            this.navCtrl.popTo(LeaveListPage);
          } else {
            this.spinner = false
            this.serve.errorToast(response['statusMsg'])
            this.serve.dismissLoading();
          }
        }, err => {
          this.spinner = false;
          this.serve.dismissLoading();
          this.serve.Error_msg(err);
        });
      }
    } else {
      this.serve.addData({ 'Type': this.data.type, 'Leave_type': (this.data.leave_type || this.data.short_leave_type), 'Start_date': (this.data.leave_start_date), 'End_data': (this.data.leave_end_date || this.data.leave_start_date), 'Description': this.data.description }, "AppLeave/addLeave").then(response => {
        this.serve.dismissLoading();
        if (response['statusCode'] == 200) {
          this.serve.successToast(response['statusMsg']);
          this.navCtrl.popTo(LeaveListPage);
          this.spinner = false;
          this.serve.dismissLoading();
        } else {
          this.spinner = false;
          this.serve.errorToast(response['statusMsg'])
          this.serve.dismissLoading();
        }
      }, err => {
        this.spinner = false;
        this.serve.dismissLoading();
        this.serve.Error_msg(err);
      });
    }
  }

  leave_list: any = []
  getleaveList() {
    this.serve.addData({}, 'AppLeave/leavesType').then((result) => {
      if (result['statusCode'] == 200) {
        this.leave_list = result['result'];
      } else {
        this.serve.errorToast(result['statusMsg'])
      }
    }, err => {
      this.serve.dismiss();
      this.serve.Error_msg(err);
    });
  }

}
