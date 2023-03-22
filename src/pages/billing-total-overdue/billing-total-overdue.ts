import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { BillingListPage } from '../billing-list/billing-list';
import { Chart } from 'chart.js';

/**
* Generated class for the BillingTotalOverduePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-billing-total-overdue',
  templateUrl: 'billing-total-overdue.html',
})
export class BillingTotalOverduePage {
  
  @ViewChild("pieCanvas") pieCanvas: ElementRef;
  pieChart: Chart;
  
  overdue_summary: any = [];
  chart_Data:any=[];
  // labels:any=[['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  labels:any=[];
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider) {  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingTotalOverduePage');
  }
  
  ionViewWillEnter(){
    this.get_outstanding_data();
  }
  
  get_outstanding_data(){
    this.service.addData({'balance_type':'over-due'},'InvoiceBilling/outstanding_and_overdue_days_interval')
    .then((res)=>
    {
      console.log(res);
      this.overdue_summary = res['previous_summary']
      this.chart_Data = [];
      this.labels = [];
      
      for(let index = 0 ; index < res['previous_summary'].length ; index++){
        this.chart_Data.push(parseInt(res['previous_summary'][index].value));
        this.labels.push((res['previous_summary'][index].days +' days'));
      }
      
      console.log(this.chart_Data);
      console.log(this.labels);
      this.pie_chart();
      
      
    },err=>
    {
      
    })
  }
  
  go_to_billing_list(days){
    console.log("go_to_billing_list method calls");
    console.log(days);
    this.navCtrl.push(BillingListPage,{'from':'over-due','days':days});
  }
  
  pie_chart(){
    
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "pie",
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.chart_Data,
            backgroundColor: [
              "#ffc107","#f44336","#ff80ab","#ea80fc","#d500f9","#f50057","#673ab7","#3f51b5","#2196f3","#7c4dff","#536dfe","#009688","#03a9f4","#004d40","#00acc1","#b388ff","#4caf50","#8bc34a","#cddc39","#00c853","#76ff03","#c6ff00","#ffeb3b","#ff9800","#795548","#263238","#3e2723","#ffff00","#e53935","#9c27b0"
            ],
            hoverBackgroundColor: ["#fff350","#ff7961","#9b2450","#ef9a9a","#f48fb1","#ce93d8","#ff8a80","#ff80ab","#ea80fc","#d500f9","#f50057","#673ab7","#3f51b5","#2196f3","#7c4dff","#536dfe","#009688","#03a9f4","#004d40","#00acc1","#b388ff","#4caf50","#8bc34a","#cddc39","#00c853","#76ff03","#c6ff00","#ffeb3b","#ff9800","#795548","#263238","#3e2723","#ffff00","#e53935","#9c27b0"]
          }
        ]
      }
    });
    
    
  }
  
  
}
