import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import moment from 'moment';

 @IonicPage()
 @Component({
   selector: 'page-distributor-sale-target',
   templateUrl: 'distributor-sale-target.html',
 })
 export class DistributorSaleTargetPage {

  @ViewChild('barCanvas') private barCanvas: ElementRef;
  TargetType: any = 'Visit';
  index: any = 0
  LoginType :any = {}
  visitHidden: boolean = false;
  salesHidden: boolean = true;
  visit_date: any = []
  visit_completed: any = []
  sale_type: any = 'Primary'
  limit:any;
  start:any;
  flag:any;
  target_list: any = []
  target_category: any = []
  allDatesData: any = []
  target_achieve: any = []
  total_target: any = []
  requiredRate: any = []
  target_not_achieved: any = []
  target_status: any = 'In Process'
  visit_target: any = {}
  barChart: any;
  doughnutChart: any;
  lineChart: any;
  date: any;
  month: any;
  balance: any = [];
  current_month: any;
  current_year: any;
  current_month_name: any;
  month_array: any = [];
  target_Type: any = 'My';
  teamCount: any = 0;
  userId: any;
  user_list: any = []
  data: any;
  Navtype: any = ''
  Dr_id: any
  dr_code: any
  dr_type: any
  From: any
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  constructor(public navCtrl: NavController, public constant: ConstantProvider, public navParams: NavParams, public popoverCtrl: PopoverController, public serve: MyserviceProvider, private loadingCtrl: LoadingController, public storage: Storage, public toastCtrl: ToastController) {
    this.LoginType = this.constant.UserLoggedInData;
    console.log(this.LoginType);
    this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.date = new Date();
    this.current_month = this.date.getMonth();
    this.current_month_name = this.month[this.date.getMonth()];
    this.current_year = this.date.getFullYear();
    this.From = this.navParams.get('comes_from_which_page')
    if (navParams.get('type') != undefined) {
      this.Navtype = navParams.get('type')
    } else {
      this.Navtype = ''
    }
    this.Dr_id = navParams.get('dr_id')
    this.dr_code = navParams.get('dr_code')
    this.dr_type = navParams.get('dr_type')
    if (this.Navtype == 'DistTarget' || this.LoginType.loggedInUserType == "DrLogin" ) {
      this.visitHidden = true
      this.salesHidden = false
      this.TargetType = 'Primary'
    }

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage,  { 'dr_id': this.Dr_id, 'from': 'leads-details', 'dr_code': this.dr_code, 'dr_type': this.dr_type  });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

      if (resultData) {
        this.target_Type = resultData.TabStatus;
        if (this.TargetType == 'Visit') {

          this.Target(this.TargetType)
        } else {

          this.Target(this.sale_type);
        }
      }
    })

  }
  ngAfterViewInit() {
    this.barChartMethod();
    
  }

  ionViewDidEnter() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    // this.getVisitMonthArray()
    this.getSalesMonthArray();
  }

  GetTarget() {
    if (this.TargetType == 'Visit') {

      this.Target(this.TargetType)
    } else {

      this.Target(this.sale_type);
    }
  }



  getSalesMonthArray() {

    for (let i = 0; i < 5; i++) {
      let month = new Date(this.current_year, this.current_month - i, 1).getMonth()
      let year = new Date(this.current_year, this.current_month - i, 1).getFullYear()

      this.month_array.push({ 'month': month, 'year': year, 'month_name': this.monthNames[month] })
    }

    setTimeout(() => {
      if (this.Navtype == 'DistTarget' || this.LoginType.loggedInUserType == "DrLogin" ) {
        this.Target('Primary');

      } else {

        this.Target(this.TargetType);
      }

    }, 100);


  }

  Target(target) {
    this.visit_date = []
    this.target_category = []
    this.total_target = []
    this.balance = []
    this.target_achieve = []
    this.target_not_achieved = []
    this.limit=20
    this.start=0
    let toast = this.toastCtrl.create({
      message: 'Error ! Please try again later',
      duration: 3000
    });
    let Month = moment(this.current_month + 1).format('MM');
  

    

    this.serve.addData({ 'Mode': this.target_Type, 'Type': target, 'Month': this.current_month + 1, 'Year': this.current_year, 'Dr_id': this.Dr_id ,'limit':this.limit , 'start':this.start}, 'AppCustomerNetwork/targetList')
      .then((result) => {
        if (result['statusCode'] == 200) {
          this.target_list = result['result']
          this.serve.dismissLoading()
          this.index = 0;
          if (target != 'Visit') {
           
            if (!this.target_list.length) {
              this.salesHidden = true
            } else {
              this.salesHidden = false
            }
            for (let i = 0; i < this.target_list.length; i++) {

              if (this.target_list[i]['achieved'] > 0 && this.target_list[i]['achieved'] < this.target_list[i]['segment_target']) {

                this.balance = this.target_list[i]['segment_target'] - this.target_list[i]['achieved']
                // requiredRate.push(this.balance/this.target_list[i]['remainingDays'])
                this.target_list[i]['RequiredRate'] = this.balance / this.target_list[i]['remainingDays']
              } else if (this.target_list[i]['achieved'] == 0) {
                this.target_list[i]['RequiredRate'] = this.target_list[i]['segment_target'] / this.target_list[i]['remainingDays']
              }
              this.target_category.push(this.target_list[i]['segment_name'])
              if (this.target_list[i]['achieved'] >= this.target_list[i]['segment_target']) {

                this.target_achieve.push(this.target_list[i]['achieved'])
                this.target_not_achieved.push(0)
              } else {
                this.target_achieve.push(0)
                this.target_not_achieved.push(this.target_list[i]['achieved'])
              }
              this.total_target.push(this.target_list[i]['segment_target'])
            }
            this.barChartMethod()
          }
          

        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(result['statusMsg'])
        }

      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
  }


  loadData(infiniteScroll) {
    this.start = this.target_list.length
    this.serve.addData({ 'Mode': this.target_Type, 'Type': this.TargetType, 'Month': this.current_month + 1, 'Year': this.current_year, 'Dr_id': this.Dr_id ,'limit':this.limit , 'start':this.start},  'AppCustomerNetwork/targetList').then(result=> {
      if (result['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.target_list = this.target_list.concat(result['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }


  barChartMethod() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {


        labels: this.target_category,
        datasets: [{
          label: 'Target',
          data: this.total_target,
          backgroundColor: 'grey', // array should have same number of elements as number of dataset
          borderColor: 'grey',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Achieved',
          data: this.target_achieve,
          backgroundColor: 'green', // array should have same number of elements as number of dataset
          borderColor: 'green',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Not Achieved',
          data: this.target_not_achieved,
          backgroundColor: 'red', // array should have same number of elements as number of dataset
          borderColor: '#dd1144',// array should have same number of elements as number of dataset
          borderWidth: 1
        }
        ]
      },
      options: {
        legend: {
          position: 'bottom',
          // display: false
          labels: {
            boxWidth: 10,
            boxHeight: 4
          }
        },
        scales: {

          xAxes: [{
            display: true,
            position: 'top',
            id: 'x-axis-1'
          },
            // {
            //   display: true,
            //   position: 'bottom',
            //   id: 'x-axis-2'
            // }
          ],

          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });
  }



}   