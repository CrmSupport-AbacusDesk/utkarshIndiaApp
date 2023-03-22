import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
// import { serviceProvider } from '../../providers/service/service';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the BillingDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-billing-detail',
  templateUrl: 'billing-detail.html',
})
export class BillingDetailPage {
  bill_id: any = '';
  from: any = '';
  bill_detail: any = {

    customer_name : '',

  };
  bill_item_detail: any = [];
  globalCollapsible : boolean = false;
  openCollapse:any = '0';

  
  constructor(public navCtrl: NavController, public navParams: NavParams,public service:MyserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad BillingDetailPage');
  }
  
  ionViewWillEnter(){
    console.log(this.navParams);
    console.log(this.navParams.get('from'));
    console.log(this.navParams.get('days'));
    
    this.from = (this.navParams.get('from'));
    this.bill_id = (this.navParams.get('bill_id'));
    this.get_selected_billing_data();
    
  }
  
  get_selected_billing_data(){
    console.log("get_selected_billing_data method calls");
    
    this.service.show_loading();
    this.service.addData({'bill_id':this.bill_id},'InvoiceBilling/outstanding_and_overdue_days_interval_detail').then((result)=>{
      console.log(result);
      this.bill_detail = result['invoice_bill'];
      this.bill_item_detail = result['invoice_bill_item'];

      this.service.dismiss();
      
    },err=>
    {
      this.service.dismiss();
      console.log("error");
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Somethong Went Wrong Please Try Again',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
            
          }
        },]
      });
      alert.present();
      this.navCtrl.pop();
    });
  }
  
  
}
