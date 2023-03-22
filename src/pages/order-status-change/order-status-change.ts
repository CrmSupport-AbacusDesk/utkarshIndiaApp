import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the OrderStatusChangePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-order-status-change',
  templateUrl: 'order-status-change.html',
})
export class OrderStatusChangePage {
  savingFlag:boolean = false;
  data:any = {};
  
   
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,  public service: MyserviceProvider) {
    this.data.status = this.navParams.get('order_status');
    this.data.id = this.navParams.get('id');
    
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderStatusChangePage');
  }
  

  submit() {
    this.savingFlag = true;
    this.service.addData({'data':this.data}, 'appOrder/secondaryOrderStatusChange').then((result) => {
      if(result['statusCode'] == 200){
        this.service.successToast(result['statusMsg']);
        this.savingFlag = false; 
        let data  = {'value':'true'}
        this.viewCtrl.dismiss(data);   
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.savingFlag = false;
      }
    }, error => {
      this.service.Error_msg(error);
      this.savingFlag = false;
      this.service.dismiss();
    });
  }
}
