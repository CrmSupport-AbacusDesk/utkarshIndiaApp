import { Component, ElementRef, ViewChild, } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Chart } from 'chart.js';
import zingchart from 'zingchart'
import { UserTargetPage } from '../user-target/user-target';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';

@IonicPage()

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard-new.html',
})
export class DashboardNewPage {
  barChart: any;
  currentDate: any = new Date();
  targetData: any = {};
  secondaryTargetData: any = {};
  monthlyTargetData: any = []
  yearlyTargetData: any = []
  brandWiseReport: any = []
  enquiryReport: any = {}
  primaryDashboard: any = false;
  secondaryDashboard: any = false;
  user_data: any;
  latestMonth: any = new Date();
  assigned_orderType: any;
  pageType: any
  showBrandWiseReport: boolean = false;

  constructor(public navCtrl: NavController, public service: MyserviceProvider, public navParams: NavParams, public popoverCtrl: PopoverController) {

    if (navParams.get('page_type') == 'Dr') {
      this.primaryDashboard = true;
      this.secondaryDashboard = false
      this.pageType = 'Dr';
    }
    else {
      (navParams.get('user_data') != undefined) ? (this.user_data = navParams.get('user_data'), this.assigned_orderType = this.user_data.order_type.toLowerCase()) : null; ((this.assigned_orderType == 'both') || (this.assigned_orderType == 'primary')) ? (this.primaryDashboard = true, this.secondaryDashboard = false) : (this.primaryDashboard = false, this.secondaryDashboard = true);

    }
  }


  ionViewWillEnter() {

    this.getUserTarget()
    this.getMonthlyTarget()
    this.getYearlyTarget()
    this.getBrandWiseReport()

    if (this.pageType != 'Dr') {
      this.getEnquiryReport()
    }
    zingchart.TOUCHZOOM = 'pinch';
  }


  goToTarget(type) { this.navCtrl.push(UserTargetPage, { 'type': type }); }

  doRefresh(refresher) {
    this.getUserTarget()
    this.getMonthlyTarget()
    this.getYearlyTarget()
    this.getBrandWiseReport();
    if (this.pageType != 'Dr') {
      this.getEnquiryReport()
    }

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  getUserTarget() {
    this.service.presentLoading();
    let apiName = ''
    if (this.primaryDashboard) {
      apiName = 'AppDashboard/getDashboardPrimaryTarget'
    } else if (this.secondaryDashboard) {
      apiName = 'AppDashboard/getDashboardSecondaryTarget'
    }
    this.service.addData({}, apiName).then((response) => {
      if (response['statusCode'] == 200) {
        this.targetData = response['TargetData']
        // this.secondaryTargetData = response['TargetData']['secondary']
        this.service.dismissLoading();

        setTimeout(() => {
          let salesReportMeter: any = {
            type: 'gauge',
            globals: {
              fontSize: '18px',
            },
            plot: {
              tooltip: {
                borderRadius: '5px',
                fontSize: '10px'
              },
              valueBox: {

                text: this.targetData.today_date,
                fontSize: '10px',
                placement: 'center',
                rules: [
                  {
                    text: this.targetData.today_date + '<br>Day',
                    rule: '%v <= 30',
                  },
                ],
              },
              size: '100%',
              animation: {
                // effect: 11,
                // speed: 5000,
                effect: 11,
                sequence: 3,
                speed: 4000,
                delay: "1500"
              }
            },
            plotarea: {
              backgroundColor: 'transparent',
              marginTop: '40px',
            },
            scaleR: {
              decimals: 2,
              maxValue: this.targetData.total_days,
              minValue: 0,
              aperture: 180,
              center: {
                visible: false,
              },
              item: {
                offsetR: 0,

              },
              labels: ['0', '', '', this.targetData.target],
              fontSize: '12px',
              ring: {
                size: 50,
                backgroundColor: '#89b3d6',
                rules: [
                  {
                    backgroundColor: 'red',
                    rule: '%v <= 10',
                    // <40%
                  },
                  {
                    backgroundColor: 'yellow',
                    rule: '%v >= 10 && %v <= 20',
                    // 40-70
                  },
                  {
                    backgroundColor: 'green',
                    rule: '%v >= 20 && %v <= 30',
                    // 70>
                  },
                ],
              },
              step: 10,
              tick: {
                visible: false,
              },

            },

            refresh: {
              type: 'feed',
              url: 'feed()',
              interval: 1500,
              resetTimeout: 1000,
              transport: 'js',
            },
            series: [
              {
                values: [this.targetData.achievment],
                backgroundColor: 'black',
                indicator: [3, 1, 1, 1, 0.4],
              },
            ],

          };

          zingchart.render({ id: 'salesReportMeter', data: salesReportMeter, height: 200 })

          this.charts.map((charts) => {
            charts.options.gui = { contextMenu: { visible: false } }
            zingchart.render({ id: charts.elemId, data: charts.options, height: 200 })
          })

        }, 200);
      } else {
        this.service.dismissLoading();
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
    })
  }
  getMonthlyTarget() {
    let apiName = ''
    if (this.primaryDashboard) {
      apiName = 'AppDashboard/userMonthTargetList'
    } else if (this.secondaryDashboard) {
      apiName = 'AppDashboard/userMonthSecondaryTargetList'
    }
    this.service.addData({}, apiName).then((response) => {
      if (response['statusCode'] == 200) {
        this.monthlyTargetData = response['brandData'];
        let segmentName: any = [];
        let segmentTarget: any = [];
        let segmentAchieve: any = [];
        for (let index = 0; index < this.monthlyTargetData.length; index++) {
          segmentName.push(this.monthlyTargetData[index].brand)
          segmentTarget.push(this.monthlyTargetData[index].target)
          segmentAchieve.push(this.monthlyTargetData[index].achieve)
        }
        setTimeout(() => {
          let daysWiseReport: any = {
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
                fontSize: '8px',
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
              labels: segmentName,
              item: {
                fontSize: 10
              }
            },
            series: [
              {
                values: segmentAchieve,
                dataDragging: true,
                goal: {
                  backgroundColor: '#64b5f6',
                  borderWidth: '1px',
                  width: 0,
                  borderColor: '#000'
                },
                goals: segmentTarget,
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
          daysWiseReport.gui = { contextMenu: { visible: false } }
          zingchart.render({ id: 'daysWiseSalesReport', data: daysWiseReport, height: 250 })
        }, 100);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
    })
  }
  getYearlyTarget() {
    let apiName = ''
    if (this.primaryDashboard) {
      apiName = 'AppDashboard/userFinancialYearTargetList'
    } else if (this.secondaryDashboard) {
      apiName = 'AppDashboard/userFinancialYearSecondaryTargetList'
    }
    this.service.addData({}, apiName).then((response) => {
      if (response['statusCode'] == 200) {
        this.yearlyTargetData = response['brandData'];
        let month = []
        let target = []
        let achieve = []
        for (let index = 0; index < this.yearlyTargetData.length; index++) {
          month.push(this.yearlyTargetData[index].month)
          target.push(this.yearlyTargetData[index].target)
          achieve.push(this.yearlyTargetData[index].achieve)
        }

        setTimeout(() => {
          let yearWiseReport: any = {
            type: 'vbullet',
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
                fontSize: 8,
                placement: 'goal',
                item: {
                  fontSize: 8,
                  'font-weight': 100
                },
              },
            },
            plotarea: {
              backgroundColor: '#ffffff',
            },
            scaleX: {
              labels: month,
              short: true,
              item: {
                fontSize: 10
              }
            },
            scaleY: {
              item: {
                fontSize: 10,
              }
            },
            series: [
              {
                values: achieve,
                dataDragging: true,
                goal: {
                  backgroundColor: '#64b5f6',
                  borderWidth: '1px',
                  height: 0,


                  borderColor: '#000'
                },
                goals: target,
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

          yearWiseReport.gui = { contextMenu: { visible: false } }
          zingchart.render({ id: 'yearWiseSalesReport', data: yearWiseReport, height: 250 })
        }, 100);
      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
    })
  }
  getBrandWiseReport() {
    let apiName = ''
    if (this.primaryDashboard) {
      apiName = 'AppDashboard/brandWiseReport'
    } else if (this.secondaryDashboard) {
      apiName = 'AppDashboard/brandWiseSecondaryReport'
    }
    this.service.addData({}, apiName).then((response) => {
      if (response['statusCode'] == 200) {
        this.brandWiseReport = response['brandData'];
        let segmentAcheivment = [
          {
            text: 'Segment 1',
            values: [0],
            backgroundColor: '#00889f',
            lineColor: '#00889f',
            lineWidth: '1px',
            marker: {
              backgroundColor: '#00889f',
            },
          },
          {
            text: 'Segment 2',
            values: [0],
            backgroundColor: '#3691d6',
            lineColor: '#3691d6',
            lineWidth: '1px',
            marker: {
              backgroundColor: '#3691d6',
            },
          },
          // {
          //   text: 'Segment 3',
          //   values: [0],
          //   backgroundColor: '#b5a1c8',
          //   lineColor: '#b5a1c8',
          //   lineWidth: '1px',
          //   marker: {
          //     backgroundColor: '#b5a1c8',
          //   },
          // },
          // {
          //   text: 'Segment 4',
          //   values: [0],
          //   backgroundColor: '#ffbd00',
          //   lineColor: '#ffbd00',
          //   lineWidth: '1px',
          //   marker: {
          //     backgroundColor: '#ffbd00',
          //   },
          // },
          // {
          //   text: 'Segment 5',
          //   values: [0],
          //   backgroundColor: '#7f7f7f',
          //   lineColor: '#7f7f7f',
          //   lineWidth: '1px',
          //   marker: {
          //     backgroundColor: '#7f7f7f',
          //   },
          // },
          // {
          //   text: 'Segment 6',
          //   values: [0],
          //   backgroundColor: '#9B26AF',
          //   lineColor: '#9B26AF',
          //   lineWidth: '1px',
          //   marker: {
          //     backgroundColor: '#9B26AF',
          //   },
          // },
          // {
          //   text: 'Segment 7',
          //   values: [0],
          //   backgroundColor: '#e3c889',
          //   lineColor: '#e3c889',
          //   lineWidth: '1px',
          //   marker: {
          //     backgroundColor: '#e3c889',
          //   },
          // },

        ]
        let index3 = this.brandWiseReport.findIndex(r => r.achieve > 0)

        if (index3 != -1) {
          let index2 = [];
          index2.push(index3);
          console.log(index2);
          if (index2.length > 0) {
            this.showBrandWiseReport = true;
          } else {
            this.showBrandWiseReport = false;
          }
        }


        for (let index = 0; index < this.brandWiseReport.length; index++) {
          segmentAcheivment[index].text = this.brandWiseReport[index].brand
          segmentAcheivment[index].values[0] = this.brandWiseReport[index].achieve
          // console.log(this.brandWiseReport[index].achieve);
        }
        console.log(segmentAcheivment);


        setTimeout(() => {
          let segmentPieChart: any = {
            type: 'ring',
            backgroundColor: '#fff',

            plot: {
              tooltip: {
                backgroundColor: '#000',
                borderWidth: '0px',
                fontSize: '10px',
                text: '%t<br/>%npv%',
                sticky: true,

              },
              valueBox:
              {
                type: 'all',
                text: '%t\n%npv%',
                placement: 'out',
                fontSize: '10px'
              },
              animation: {
                effect: 2,
                sequence: 3,
                speed: 4000,
                delay: "1500"
              },
              backgroundColor: '#FBFCFE',
              borderWidth: '0px',
              slice: 30,
            },
            plotarea: {
              margin: '0px',
              backgroundColor: 'transparent',
              borderRadius: '10px',
              borderWidth: '0px',
            },
            series: segmentAcheivment,
            noData: {
              text: 'No Selection',
              alpha: 0.6,
              backgroundColor: '#20b2db',
              bold: true,
              fontSize: '10px',
              textAlpha: 0.9,
            },
          };

          segmentPieChart.gui = { contextMenu: { visible: false } }
          zingchart.render({ id: 'segmentPieChart', data: segmentPieChart, height: 250 })
        }, 100);


      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
    })
  }

  getEnquiryReport() {
    let apiName = ''
    if (this.primaryDashboard) {
      apiName = 'AppDashboard/userEnquiryReport'
    } else if (this.secondaryDashboard) {
      apiName = 'AppDashboard/userEnquirySecondaryReport'
    }
    this.service.addData({}, apiName).then((response) => {
      if (response['statusCode'] == 200) {
        this.enquiryReport = response['data']

        let enquiryPieChart: any = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              text: '%t<br/>%v',
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'out',
              fontSize: '10px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 6000,
              delay: "1500"
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 30,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: [
            {
              text: 'Win',
              values: [this.enquiryReport.win],
              backgroundColor: '#67a21e',
              lineColor: '#67a21e',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#67a21e',
              },
            },
            {
              text: 'Lost',
              values: [this.enquiryReport.pending],
              backgroundColor: '#ff4441',
              lineColor: '#ff4441',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4441',
              },
            },
            {
              text: 'In Progress',
              values: [this.enquiryReport.qualified],
              backgroundColor: '#ffb300',
              lineColor: '#ffb300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffb300',
              },
            }
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };

        enquiryPieChart.gui = { contextMenu: { visible: false } }
        zingchart.render({ id: 'enquiryPieChart', data: enquiryPieChart, height: 250 })

      }
    }, error => {
      this.service.Error_msg(error);
      this.service.dismissLoading()
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

  targetYearlyPieChart: any = {
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
      "totals": [2000],
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
        "values": [1200],
        "backgroundColor": "#2fb7f7",
        "borderWidth": 10,
        "borderColor": "#2fb7f7",
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
        "backgroundColor": "#2fb7f7",
        "alpha": 0.25,
        "size": 45,
        "slice": 35,
        "placement": "bottom"
      },

    ]
  };

  currentRatePerDayPieChart: any = {
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
        "text": "<span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
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
      "totals": [100],
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
        "values": [50],
        "backgroundColor": "#ffc821",
        "borderWidth": 10,
        "borderColor": "#ffc821",
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
      "text": "<span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
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
        "backgroundColor": "#ffc821",
        "alpha": 0.25,
        "size": 45,
        "slice": 35,
        "placement": "bottom"
      },

    ]
  };

  requiredRatePerDayPieChart: any = {
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
        "text": "<span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
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
      "totals": [100],
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
        "values": [50],
        "backgroundColor": "#b9a0c7",
        "borderWidth": 10,
        "borderColor": "#b9a0c7",
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
      "text": "<span style='font-size:12px;font-weight:bold;color:%color;'>%node-percent-value%</span><br><span style='font-size:10px;color:%color;'>%v</span>",
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
        "backgroundColor": "#b9a0c7",
        "alpha": 0.25,
        "size": 45,
        "slice": 35,
        "placement": "bottom"
      },

    ]
  };



  // yearWiseReport:any = {
  //   type: "bar",
  //   scaleX: {
  //         labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  //         item: {
  //           fontSize: 10,
  //           short:true
  //         }
  //       },
  //     scaleY:{
  //       short:true,
  //       item: {
  //         fontSize: 10,
  //       }
  //     },
  //   "tooltip": {
  //     "visible": false
  //   },
  //   plot: {
  //     aspect: "spline",
  //     "tooltip-text": "%t views: %v<br>%k",
  //     "shadow": 0,
  //     "line-width": "2px",
  //     "marker": {
  //       "type": "circle",
  //       "size": 3
  //       },
  //       animation: {
  //         effect: 1,
  //         sequence:2,
  //         speed: 0.2,
  //       }
  //     },
  //     plotarea: {
  //       backgroundColor: 'transparent',
  //       marginTop:'20px',
  //     },
  //     "crosshair-x": {
  //       "line-color": "#efefef",
  //       "plot-label": {
  //         "border-radius": "5px",
  //         "border-width": "1px",
  //         "border-color": "#f6f7f8",
  //         "padding": "10px",
  //         "font-weight": "bold"
  //       },
  //       "scale-label": {
  //         "font-color": "#000",
  //         "background-color": "#f6f7f8",
  //         "border-radius": "5px"
  //       }
  //     },
  //   series: [{
  //       values: this.yearlyTarget,
  //       monotone: true,
  //       text: "Target",
  //       lineColor:'#1bb3e8',
  //       "marker": {
  //         "background-color": "#1bb3e8",
  //       },

  //     },
  //     {
  //       values: this.yearlyAcheive,
  //       monotone: true,
  //       text: "Achieve",
  //       lineColor:'#172b4d',
  //       "marker": {
  //         "background-color": "#172b4d",
  //       },
  //       "highlight-state": {
  //         "line-width": 3
  //       },
  //     },

  //   ]
  // }

  duBalanceAgeChart: any = {
    gui: {
      contextMenu: {
        visible: false
      }
    },
    type: 'bar',
    plot: {
      barWidth: '25px',
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '10px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
      {
        type: 'all',
        placement: "top-out",
        short: true,
        text: '%v',
        angle: 0,
        fontSize: '10px',
        fontWeight: '100',
        "font-color": "black",

      },
    },
    scaleX: {
      "transform": {
        "type": "text",

      },
      "item": {
        "font-size": 9
      },
      wrapText: true,
      labels: ['Within<br/>Due Days', 'Over Due<br/>0-30<br/>Days', 'Over Due<br/>31-60<br/>Days', 'Over Due<br/>61-90<br/>Days', 'Due Over<br/>90 Days'],
    },
    scaleY: {
      short: true,
      item: {
        fontSize: 10,
      }
    },
    series: [
      {
        values: [40000, 10000, 14000, 50000, 15000],
        styles: [
          { 'background-color': '#00ff00' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#ea4335' },
        ]
      },

    ],

  };

  overdueByRegionPieChart: any = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'black',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        text: '%t<br/>%v',
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%t %npv%',
        placement: 'out',
        fontSize: '10px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 30,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'East',
        values: [1500],
        backgroundColor: '#67a21e',
        lineColor: '#67a21e',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#67a21e',
        },
      },
      {
        text: 'West',
        values: [1200],
        backgroundColor: '#ffb300',
        lineColor: '#ffb300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffb300',
        },
      },
      {
        text: 'North',
        values: [1300],
        backgroundColor: '#ff6f00',
        lineColor: '#ff6f00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff6f00',
        },
      },
      {
        text: 'South',
        values: [2000],
        backgroundColor: '#0071bd',
        lineColor: '#0071bd',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#0071bd',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  charts = [
    { 'elemId': 'duBalanceAgeChart', 'options': this.duBalanceAgeChart },
    { 'elemId': 'overdueByRegionPieChart', 'options': this.overdueByRegionPieChart },
  ]
  highlights = [
    { 'elemId': 'targetPieChart', 'options': this.targetPieChart },
    { 'elemId': 'currentRatePerDayPieChart', 'options': this.currentRatePerDayPieChart },
    { 'elemId': 'requiredRatePerDayPieChart', 'options': this.requiredRatePerDayPieChart },
    { 'elemId': 'targetYearlyPieChart', 'options': this.targetYearlyPieChart },
  ]


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Dashboard' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      if (resultData) {
        // this.assigned_orderType=resultData.TabStatus
        if (resultData.TabStatus == 'primary') {
          this.primaryDashboard = true;
          this.secondaryDashboard = false;
        } else {
          this.secondaryDashboard = true;
          this.primaryDashboard = false;
        }
        this.getUserTarget()
        this.getMonthlyTarget()
        this.getYearlyTarget()
        this.getBrandWiseReport()
        this.getEnquiryReport()
      }

    })

  }
}
