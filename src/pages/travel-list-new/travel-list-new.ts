import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { TravelAddNewPage } from '../travel-add-new/travel-add-new';
import { TravelEditNewPage } from '../travel-edit-new/travel-edit-new';
import { UploadFilePage } from '../upload-file/upload-file';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { ChangeStatusModelPage } from '../change-status-model/change-status-model';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { IonicSelectableComponent } from 'ionic-selectable';


@IonicPage()
@Component({
  selector: 'page-travel-list-new',
  templateUrl: 'travel-list-new.html',
})
export class TravelListNewPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  currentMonth: any;
  currentYear: any;
  TodayDate = new Date().toISOString().slice(0, 10);
  monthNames: string[];
  date: any;
  currentMonth_no: any;
  daysInThisMonth: any = [];
  daysInLastMonth: any = [];
  daysInNextMonth: any = [];
  travel_data: any = {}
  percentages: any = 0;
  userId: any
  dateArray: any = [];
  travelViewType: any = 'My';
  teamCount = 0;
  pending_travel: any
  asm_id: any;
  staticdaysInThisMonth: any = [];
  data: any;
  filter: any = {}
  selectData: any = {}


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public modalCtrl: ModalController,
    public attendence_serv: AttendenceserviceProvider,
    public popoverCtrl: PopoverController
  ) {

    this.serve.presentLoading()
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });


    for (let i = 1; i <= 30; i++) {
      this.staticdaysInThisMonth[i] = i;
    }
    // this.storage.get('userId').then((id) => {
    //   if (this.navParams.get('view_type') == 'Team') {
    //     this.travelViewType = "Team";
    //     this.userId = '';
    //     this.getUserList();

    //   } else {
    //     this.userId = id;
    //     this.getTravelData();
    //   }

    // });


    this.date = new Date();
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.pending_travel = this.navParams.get('from');
    if (this.navParams.get('from') == 'pendingtravel') {
      this.asm_id = this.navParams.get('asm_id')
      this.currentMonth_no = parseInt(this.navParams.get('month_name')) - 1
      this.currentYear = parseInt(this.navParams.get('year'))
      this.travel_data.user = this.asm_id
      this.serve.presentLoading()
      this.getTravelData()
    }


  }

  ionViewWillEnter() {
    this.serve.dismiss();
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    if (this.navParams.get('view_type')) {
      this.travelViewType = this.navParams.get('view_type');
    }

    if (this.travelViewType == 'My') {
      this.storage.get('userId').then((id) => {
        this.userId = id;
        this.getTravelData();
      });
    }
    else {

      this.getUserList();
    }


  }



  goToLastMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.getTravelData();
  }

  goToNextMonth() {
    this.date = new Date(this.currentYear, this.currentMonth_no + 2, 0);
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth();

    this.getTravelData();
  }


  getTravelData() {

    this.filter.limit = 20;
    this.filter.start = 0;
    if (this.selectData.team && this.travelViewType == 'Team') {
      this.filter.team_id = this.selectData.team.id;
      this.userId = this.selectData.team.id;
      this.filter.team = this.selectData.team.name;
    }
    this.data = { 'Mode': this.travelViewType, 'Month': this.currentMonth_no + 1, 'Year': this.currentYear, 'User_id': this.userId, 'filter': this.filter }
    this.serve.addData(this.data, 'AppTravelPlan/getTravleData').then((result) => {

      if (result['statusCode'] == 200) {
        this.serve.dismissLoading()
        this.dateArray = result['dateArray']
        this.travel_data.working_days = result['tavel_date']['working_days'];
        this.travel_data.travel_plan = result['tavel_date']['travel_plan'];
        this.percentages = Math.round((this.travel_data.travel_plan / this.travel_data.working_days) * 100);


        this.getDaysOfMonth();
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });

  }

  getDaysOfMonth() {

    let i
    this.daysInThisMonth = [];
    this.daysInLastMonth = [];
    this.daysInNextMonth = [];

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    firstDayThisMonth == 0 ? firstDayThisMonth = 6 : firstDayThisMonth = (firstDayThisMonth - 1);

    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();

    for (i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    for (i = 0; i < thisNumOfDays; i++) {
      let month = ((this.currentMonth_no + 1) < 10) ? '0' + (this.currentMonth_no + 1) : (this.currentMonth_no + 1)
      let date = ((i + 1) < 10) ? '0' + (i + 1) : (i + 1)
      let fulldate = this.date.getFullYear() + '-' + month + '-' + date
      let date_data = this.dateArray.filter(x => x.date === fulldate)[0];

      this.daysInThisMonth[i] = { 'day': i + 1, 'date': fulldate, 'day_name': date_data.day, 'isHoliday': date_data.isHoliday, 'isOnLeave': date_data.isOnLeave, 'isSunday': date_data.isSunday, 'travlePlan': date_data.travlePlan, 'collapse': false, 'travel_info': date_data.travel_info, 'travel_planstatus': date_data.travel_planstatus, 'total_travel_count': date_data.total_travel_count, 'checkinDone': date_data.checkinDone };
      // 
    }




    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();

    if (lastDayThisMonth > 0) {
      for (i = 0; i < (7 - lastDayThisMonth); i++) {
        this.daysInNextMonth.push(i + 1);
      }
    }



  }

  goToPage(date, planstatus) {
    console.log(planstatus)
    planstatus ? this.navCtrl.push(TravelAddNewPage, { date: date, user_id: this.userId }) : this.navCtrl.push(TravelEditNewPage, { date: date, user_id: this.userId, page: 'Add' })

  }

  goToEditPage(date) {
    console.log('edit page')
    this.navCtrl.push(TravelEditNewPage, { date: date, user_id: this.userId, page: 'Edit' })

  }


  announcementModal() {
    const modal = this.modalCtrl.create(UploadFilePage);

    modal.onDidDismiss(data => {

      this.getTravelData();

    });
    modal.present();

  }

  changeStatusModel() {
    const modal = this.modalCtrl.create(ChangeStatusModelPage, {
      userId: this.userId, 'currentMonth': this.currentMonth, 'currentYear': this.currentYear
    });

    modal.onDidDismiss(data => {

      this.getTravelData();

    });
    modal.present();

  }

  user_list: any = []
  getUserList() {
    this.serve.addData({}, "AppTravelPlan/getAllAsm").then(resp => {
      this.user_list = resp['asm_id'];
      this.serve.dismissLoading()
    },
      err => {
        this.serve.dismissLoading()
      })
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Travel' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {


      if (resultData) {
        this.travelViewType = resultData.TabStatus;
        if (this.travelViewType == 'Team') {
          this.userId = undefined;
          this.getUserList();
        } else {
          this.selectData = {};
          this.filter = {};
          this.storage.get('userId').then((id) => {
            this.userId = id;
            this.getTravelData();
          });

        }

      }

    })

  }


}
