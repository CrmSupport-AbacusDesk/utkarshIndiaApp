import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import moment from 'moment';
import { IonicSelectableComponent } from 'ionic-selectable';
import zingchart from 'zingchart'


/**
 * Generated class for the TargetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-target',
  templateUrl: 'target.html',
})
export class TargetPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  // @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  activeTab: string = "active";
  salesActiveTab: string = "active1";

  TargetType: any = 'Sales';
  index: any = 0
  LoginType: any = this.constant.UserLoggedInData
  visitHidden: boolean = false;
  salesHidden: boolean = true;
  visit_date: any = []
  filteruser: any;
  visit_completed: any = []
  sale_type: any = 'Primary'
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
  dataVisible:any=false;
  lineChart: any;
  date: any = new Date();
  monthNames: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  balance: any = [];
  current_month: any = this.date.getMonth();
  current_year: any = this.date.getFullYear();
  current_month_name: any = this.monthNames[this.date.getMonth()];
  month_array: any = [];
  target_Type: any = 'My';
  teamCount: any = 0;
  // userId: any;
  user_list: any = []
  data: any = {};
  Navtype: any = ''
  Dr_id: any
  From: any = this.navParams.get('comes_from_which_page');
  user_data: any;
  assigned_orderType: any;

  constructor(public navCtrl: NavController, public constant: ConstantProvider, public navParams: NavParams, public popoverCtrl: PopoverController, public serve: MyserviceProvider, private loadingCtrl: LoadingController, public storage: Storage, public toastCtrl: ToastController) {
    if(navParams.get('page_type') == 'Dr'){
      this.target_Type = 'Dr';
      this.sale_type = 'Primary'
      this.Target(this.sale_type)
    }
    else{
      (navParams.get('type') != undefined) ? this.Navtype = navParams.get('type') : this.Navtype = '';
      (this.Navtype == 'DistTarget' || this.LoginType.loggedInUserType == "DrLogin") ?
      (this.TargetType = 'Primary', this.Target(this.TargetType)) : this.Target(this.sale_type);
      
      (navParams.get('user_data') != undefined) ? (
        this.user_data = navParams.get('user_data'),
        this.assigned_orderType = this.user_data.order_type.toLowerCase(),
        (this.assigned_orderType == 'Secondary') ? this.sale_type = 'Secondary' : (this.assigned_orderType == '') ? (this.TargetType = 'Visit', this.sale_type = 'Visit') : null
      ) : null;
    }
  }

  ngAfterViewInit() {
    // this.barChartMethod();
    // this.doughnutChartMethod();
    // this.lineChartMethod();
  }

  ionViewDidEnter() {
    this.storage.get('team_count').then((team_count) => { this.teamCount = team_count; });
    this.getSalesMonthArray();
  }

  ionViewWillEnter() {
  

    zingchart.render({ id: 'targetPieChart', data: this.targetPieChart, height: 250 });
  }

  getSalesMonthArray() {
    for (let i = 0; i < 5; i++) {
      let month = new Date(this.current_year, this.current_month - i, 1).getMonth()
      let year = new Date(this.current_year, this.current_month - i, 1).getFullYear()
      this.month_array.push({ 'month': month, 'year': year, 'month_name': this.monthNames[month] })
    }
  }

  // GetTarget() {
  //   if (this.TargetType == 'Visit') {
  //     this.Target(this.TargetType)
  //   } else {
  //     this.Target(this.sale_type);
  //   }
  // }

  Target(target) {
    this.serve.presentLoading();
    this.visit_date = [];
    this.target_category = [];
    this.balance = [];
    this.target_achieve = [];
    this.target_not_achieved = []
    this.total_target = []
    this.serve.addData({ 'Mode': this.target_Type, 'Type': target, 'User_id': this.data.id, 'Month': this.current_month + 1, 'Year': this.current_year }, 'AppTarget/targetList')
      .then((result) => {
        if (result['statusCode'] == 200) {
          this.target_list = result['result']
          this.serve.dismissLoading()
          this.index = 0;
          if (target == 'Visit') {
            // (this.target_list.total_visit_target <= 0)?this.visitHidden = true : this.visitHidden = false;
            for (let i = 0; i < this.target_list.total_days_visit.length; i++) {
              let obj = this.target_list.total_days_visit[i];
              let a = Object.keys(obj)[0];
              this.visit_date[this.index] = a;
              this.visit_completed[this.index] = this.target_list.total_days_visit[i][a];
              this.index++;
            }
            // this.doughnutChartMethod();
            // this.lineChartMethod();
          } else if (target != 'Visit') {
            if (!this.target_list.length) {
              this.salesHidden = true
            } else {
              this.dataVisible=false;
              this.salesHidden = false
            }
            for (let i = 0; i < this.target_list.length; i++) {

              if (this.target_list[i]['achieved'] > 0 && this.target_list[i]['achieved'] < this.target_list[i]['target']) {

                this.balance = this.target_list[i]['target'] - this.target_list[i]['achieved']
                // requiredRate.push(this.balance/this.target_list[i]['remainingDays'])
                this.target_list[i]['RequiredRate'] = this.balance / this.target_list[i]['remainingDays']
              } else if (this.target_list[i]['achieved'] == 0) {
                this.target_list[i]['RequiredRate'] = this.target_list[i]['target'] / this.target_list[i]['remainingDays']
              }
              this.target_category.push(this.target_list[i]['brand'])


              this.target_achieve.push(this.target_list[i]['achieved'])
              this.target_not_achieved.push(0)

              this.total_target.push(this.target_list[i]['target'])
            }
            // this.barChartMethod()
            let targetBarChart: any = {
              type: 'hbullet',
              title: {
                text: '',
              },
              plot: {
                tooltip: {
                  borderRadius: '3px',
                  borderWidth: '1px',
                  fontSize: '14px',
                  shadow: true,
                  text: '%v/%node-goal-value'
                },
                animation: {
                  effect: 4,
                  method: 0,
                  speed: 1600,
                },
                valueBox:
                {
                  
                  type: 'all',
                  text: '%g',
                  angle: 0,
                  color: '#000',
                  placement: 'goal',
                },
              },
              plotarea: {
                margin: '60px 20px 55px 60px',
                backgroundColor: '#ffffff',
              },
              scaleX: {
                labels: this.target_category,
                item: {
                  fontSize: 10
                }
              },
              series: [
                {
                  values: this.target_achieve,
                  dataDragging: true,
                  goal: {
                    backgroundColor: '#64b5f6',
                    borderWidth: '1px',
                    width: 0,
                    borderColor: '#000'
                  },
                  goals: this.total_target,
                  rules: [
                    {
                      backgroundColor: '#50a42c',
                      rule: '%v >= (%g/2+%g/4)', //if vlaue is greater then 75% of goal
                    },
                    {
                      backgroundColor: '#ffc821',
                      rule: '%v > %g/4 && %v < (%g/2+%g/4)', //if vlaue is greater then 25% and less then 75% of goal
                    },
                    {
                      backgroundColor: '#ff4441',
                      rule: '%v < %g/4', //if vlaue is less then 25% of goal
                    },
                  ],
                },
              ],
            }
            targetBarChart.gui = { contextMenu: { visible: false } }
            zingchart.render({ id: 'barChartBox', data: targetBarChart, height: 250 })
          }
          
        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.dismissLoading()
        this.serve.Error_msg(error);
      });
  }


  lineChartMethod() {
    if (this.Navtype != 'DistTarget' || this.LoginType.loggedInUserType == "DrLogin") {
      // this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      //   type: 'line',
      //   data: {// values on X-Axis
      //     labels: this.visit_date,
      //     datasets: [
      //       {
      //         label: "Visit",
      //         data: this.visit_completed,
      //         backgroundColor: 'rgba(75,192,192,0.4)',
      //         borderColor: 'rgba(75,192,192,1)',
      //         borderCapStyle: 'butt',
      //         borderDash: [],
      //         borderDashOffset: 0.0,
      //         borderJoinStyle: 'miter',
      //         pointBorderColor: 'rgba(75,192,192,1)',
      //         pointBackgroundColor: '#fff',
      //         pointBorderWidth: 1,
      //         pointHoverRadius: 2,
      //         pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      //         pointHoverBorderColor: 'rgba(220,220,220,1)',
      //         pointHoverBorderWidth: 2,
      //         pointRadius: 1,
      //         pointHitRadius: 10,
      //         spanGaps: false,

      //         // backgroundColor: 'blue'
      //       },

      //     ]
      //   },
      //   options: {
      //     aspectRatio: 2.5
      //   }
      //   // data: {
      //   //   labels: this.visit_date,
      //   //   datasets: [
      //   //     {
      //   //       label: 'Visit Target',
      //   //       fill: false,
      //   //       lineTension: 0.1,
      //   //       backgroundColor: 'rgba(75,192,192,0.4)',
      //   //       borderColor: 'rgba(75,192,192,1)',
      //   //       borderCapStyle: 'butt',
      //   //       borderDash: [],
      //   //       borderDashOffset: 0.0,
      //   //       borderJoinStyle: 'miter',
      //   //       pointBorderColor: 'rgba(75,192,192,1)',
      //   //       pointBackgroundColor: '#fff',
      //   //       pointBorderWidth: 1,
      //   //       pointHoverRadius: 5,
      //   //       pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      //   //       pointHoverBorderColor: 'rgba(220,220,220,1)',
      //   //       pointHoverBorderWidth: 2,
      //   //       pointRadius: 1,
      //   //       pointHitRadius: 10,
      //   //       data: this.visit_completed,
      //   //       spanGaps: false,
      //   //     }
      //   //   ]
      //   // }
      // });
    }
  }

  doughnutChartMethod() {
    if (this.Navtype != 'DistTarget' || this.LoginType.loggedInUserType == "DrLogin") {

      // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      //   type: 'doughnut',
      //   data: {
      //     labels: ['Today Required Rate', 'Today Achievement'],
      //     datasets: [{
      //       label: 'Per Day',
      //       data: [this.target_list.Per_day_target, this.target_list.today_checkin_count],
      //       backgroundColor: [
      //         'red',
      //         'green'

      //       ],

      //     }]
      //   },
      //   options: {
      //     cutoutPercentage: 70,
      //     legend: {
      //       position: 'bottom',
      //       // display: false
      //       labels: {
      //         boxWidth: 10,
      //         boxHeight: 4
      //       }
      //     },
      //   }

      // });
    }

  }

  barChartMethod() {

    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display. 
    // this.barChart = new Chart(this.barCanvas.nativeElement, {
    //   type: 'bar',
    //   data: {


    //     labels: this.target_category,
    //     datasets: [{
    //       label: 'Target',
    //       data: this.total_target,
    //       backgroundColor: 'grey', // array should have same number of elements as number of dataset
    //       borderColor: 'grey',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     },
    //     {
    //       label: 'Achieved',
    //       data: this.target_achieve,
    //       backgroundColor: 'green', // array should have same number of elements as number of dataset
    //       borderColor: 'green',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     },
    //     {
    //       label: 'Not Achieved',
    //       data: this.target_not_achieved,
    //       backgroundColor: 'red', // array should have same number of elements as number of dataset
    //       borderColor: '#dd1144',// array should have same number of elements as number of dataset
    //       borderWidth: 1
    //     }
    //     ]
    //   },
    //   options: {
    //     legend: {
    //       position: 'bottom',
    //       // display: false
    //       labels: {
    //         boxWidth: 10,
    //         boxHeight: 4
    //       }
    //     },
    //     scales: {

    //       xAxes: [{
    //         display: true,
    //         position: 'top',
    //         id: 'x-axis-1'
    //       },
    //         // {
    //         //   display: true,
    //         //   position: 'bottom',
    //         //   id: 'x-axis-2'
    //         // }
    //       ],

    //       yAxes: [{
    //         ticks: {
    //           beginAtZero: true
    //         }
    //       }]
    //     },
    //     responsive: true,
    //     maintainAspectRatio: true,
    //   }
    // });

    let targetBarChart: any = {
      type: 'hbullet',
      title: {
        text: '',
      },
      plot: {
        tooltip: {
          borderRadius: '3px',
          borderWidth: '1px',
          fontSize: '14px',
          shadow: true,
          text: '%v/%node-goal-value'
        },
        animation: {
          effect: 4,
          method: 0,
          speed: 1600,
        },
        valueBox:
        {
          type: 'all',
          text: '%g',
          angle: 0,
          color: '#000',
          placement: 'goal',
        },
      },
      plotarea: {
        margin: '60px 20px 55px 60px',
        backgroundColor: '#ffffff',
      },
      scaleX: {
        labels: this.target_category,
        item: {
          fontSize: 10
        }
      },
      series: [
        {
          values: this.target_achieve,
          dataDragging: true,
          goal: {
            backgroundColor: '#64b5f6',
            borderWidth: '1px',
            width: 0,
            borderColor: '#000'
          },
          goals: this.total_target,
          rules: [
            {
              backgroundColor: '#50a42c',
              rule: '%v >= (%g/2+%g/4)', //if vlaue is greater then 75% of goal
            },
            {
              backgroundColor: '#ffc821',
              rule: '%v > %g/4 && %v < (%g/2+%g/4)', //if vlaue is greater then 25% and less then 75% of goal
            },
            {
              backgroundColor: '#ff4441',
              rule: '%v < %g/4', //if vlaue is less then 25% of goal
            },
          ],
        },
      ],
    }
    targetBarChart.gui = { contextMenu: { visible: false } }
    zingchart.render({ id: 'barChartBox', data: targetBarChart, height: 250 })
  }

  getuserlist(api_name) {
    this.serve.presentLoading()
    this.storage.get('userId').then((id) => {
      this.serve.addData({ 'user_id': id, 'type': this.sale_type }, api_name).then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismissLoading()
          this.user_list = result['asm_id'];

        } else {
          this.serve.dismissLoading()
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.dismissLoading()
        this.serve.errorToast('Something went wrong')
      });
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, this.From == 'Travel-pop' ? { 'from': 'leads-details' } : { 'from': 'Target' });
    popover.present({ ev: myEvent });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        this.target_Type = resultData.TabStatus;
        if(this.target_Type=='My'){
          this.dataVisible=false;
        }else{
          this.dataVisible=true;
        }

        (this.TargetType == 'Visit') ?
          (
            (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAllAsm') : (console.log('asdf'), this.data={}, this.Target(this.TargetType))
          ) :
          (
            (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAsm') : (console.log('asdf'), this.data={}, this.Target(this.sale_type))
          );
      }
    })
  }

  targetPieChart: any = {
    "type": "pie",
    "plotarea": {
      "margin": "40",
    },
    "scale": {
      "sizeFactor": 1
    },
    "plot": {
      "valueBox": {
        "visible": true,
        "fontSize": 12,
        "anchor": "c",
        "fontFamily": "Lucida Sans Unicode",
        "text": "%plot-text<br><span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
        "color": "#333",
        "placement": "center",
        "borderWidth": 0,
        "backgroundColor": "none",
        'short': true
      },
      "refAngle": 270,
      "angleStart": 270,
      "detach": false,
      "slice": "100%",
      "totals": [200],
      "animation": {
        "speed": 1000,
        "effect": 2,
        "method": 0
      },
      "hoverState": {
        "visible": false
      }
    },

    "series": [
      {
        "size": "100%",
        "values": [150],
        "backgroundColor": "#67a21e",
        "borderWidth": 10,
        "borderColor": "#67a21e",
        "angleStart": 270,
        "-angleEnd": 270,
        "text": "Achieved"
      }
    ],
    "tooltip": {
      "x": 80,
      "y": 80,
      "width": 100,
      "fontSize": 12,
      "padding": 30,
      "anchor": "c",
      "fontFamily": "Lucida Sans Unicode",
      "text": "%plot-text<br><span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
      "color": "#333",
      "align": "center",
      "borderWidth": 0,
      "backgroundColor": "none",

    },
    "shapes": [
      {
        "type": "pie",
        "flat": true,
        "x": 80,
        "y": 80,
        "backgroundColor": "#67a21e",
        "alpha": 0.25,
        "size": 45,
        "slice": 35,
        "placement": "bottom"
      },

    ]
  };

  doRefresh(refresher) {
    (this.TargetType == 'Visit') ?
    (
      (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAllAsm') : (console.log('asdf'), this.data={}, this.Target(this.TargetType))
    ) :
    (
      (this.target_Type != 'My') ? this.getuserlist('AppTarget/getAsm') : (console.log('asdf'), this.data={}, this.Target(this.sale_type))
    );

    setTimeout(() => {
        refresher.complete();
    }, 1000);
}
}   