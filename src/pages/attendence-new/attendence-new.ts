import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment/moment';

@IonicPage()
@Component({
  
  
  
  selector: 'page-attendence-new',
  templateUrl: 'attendence-new.html',
})
export class AttendenceNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  date: any
  current_month: any
  current_year: any
  attendance_list: any = []
  attendance_list1: any = []
  user_list: any = []
  attendance_summery: any = {}
  userId: any
  month_array: any = []
  attendencetype = 'My'
  data: any = {};
  selected_date = new Date().toISOString().slice(0, 10);
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController,public storage: Storage, public popoverCtrl: PopoverController) {
    this.storage.get('userId').then((id) => {
      this.userId = id;
    });
    this.date = new Date();
    this.current_month = this.date.getMonth();
    this.current_year = this.date.getFullYear();
  }
  teamCount: any = 0;
  ionViewDidLoad() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    this.getMonthArray()
  }
  getMonthArray() {
    for (let i = 0; i < 3; i++) {
      let month = new Date(this.current_year, this.current_month - i, 1).getMonth()
      let year = new Date(this.current_year, this.current_month - i, 1).getFullYear()
      this.month_array.push({ 'month': month, 'year': year, 'month_name': this.monthNames[month] })
    }
    this.getAttendanceData()
  }
  
  getAttendanceData() {
    this.serve.presentLoading();
    this.serve.addData({'month': this.current_month + 1, 'year': this.current_year, 'Mode':this.attendencetype, 'user_id': this.data.id}, 'AppAttendence/getUserAttendance').then((result) => {
      if (result['statusCode'] == 200) {
        this.attendance_list = result['result'].attendance
        this.attendance_list.reverse()
        this.attendance_summery = result['result'].attendance_summery
        for (let i = 0; i < this.attendance_list.length; i++) {
          this.attendance_list[i]['start_date_time'] = this.attendance_list[i]['date'] + ' ' + this.attendance_list[i]['start_time'];
          this.attendance_list[i]['stop_date_time'] = this.attendance_list[i]['date'] + ' ' + this.attendance_list[i]['stop_time'];
          this.attendance_list[i]['collapse'] = false;
        }
        this.serve.dismiss()
      } else {
        this.serve.dismiss()
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'Attendence' });
    
    popover.present({
      ev: myEvent
    });
    
    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.attendencetype = resultData.TabStatus;
        if (this.attendencetype == "Team") {
          this.get_user();
        }
        else{
          this.data = {};
          this.getAttendanceData();
        }
      }
    })
    
  }
  get_user() {
    this.serve.addData({ 'user_id': this.data.user }, "AppAttendence/getAllAsm")
    .then(result => {
      if(result['statusCode']==200){
        this.user_list = result['asm_id'];
      }else{
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })
  }
  
}
