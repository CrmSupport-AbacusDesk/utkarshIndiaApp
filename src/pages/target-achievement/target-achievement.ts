import { Component } from '@angular/core';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ToastController } from 'ionic-angular';
import { OrderListPage } from '../order-list/order-list';
import moment from 'moment';


/**
* Generated class for the TargetAchievementPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-target-achievement',
  templateUrl: 'target-achievement.html',
})
export class TargetAchievementPage {
  target_array: any = []
  type: any;
  orderDetail1: any = [];
  collObject1: any = {}
  userDetail: any = [];
  distributorId: any;
  net_total: any = 0;
  flag: number = 0;
  
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public service1: MyserviceProvider, public viewcontrol: ViewController, mdlCtrl: ModalController) {
  }
  
  ionViewDidLoad() {
    console.log(this.navParams);
    this.type = this.navParams['data']['type'];
    
    if (this.type == 'DISPATCH') 
    {
      this.orderDetail1 = this.navParams['data']['orderDetail'];
      this.userDetail = this.navParams['data']['userDetail'];
      this.distributorId = this.navParams['data']['userDetail']['distributor_id'];
      console.log(this.distributorId);
      
      for (let i = 0; i < this.navParams['data']['orderDetail'].length; i++) 
      {
        this.orderDetail1[i]['price'] = (parseInt(this.navParams['data']['orderDetail'][i]['price']));
        this.orderDetail1[i]['pending_qty'] = (parseInt(this.navParams['data']['orderDetail'][i]['pending_qty']));
        this.orderDetail1[i]['dispatch_qty'] = (parseInt(this.navParams['data']['orderDetail'][i]['dispatchQty']));
        this.check_qty(i);
        
      }
    } 
    else 
    {
      this.targetAchievement();
    }

    console.log('ionViewDidLoad TargetAchievementPage');
  }
  
  
  ionViewWillEnter() {
    this.collObject1.index = true;
  }
  date:any;
  targetAchievement() 
  {
    console.log(this.type)
    let url='';
    if(this.type=='primary')
    {
      url='Attendence/user_target';
    }
    else
    {
      url='Attendence/user_target_secondary'
    }
    this.service1.show_loading();
    this.service1.addData({},url).then((response) => {
      console.log(response);
      this.target_array = response;
      for(let i=0;i<this.target_array.length;i++)
      {
        this.date=this.target_array[i].date ;

      }
      this.date= moment().format("YY-MM");
      console.log(this.date);
      
      console.log(this.target_array);
    this.service1.dismiss();

    });
    // this.service1.dismiss();

  }
  
  
  close() {
    this.viewcontrol.dismiss();
  }
  
  collapse_t(index) {
    
    console.log(index);
    console.log(this.collObject1.index);
    
    if (this.collObject1.index == true) {
      this.collObject1.index = false
    }
    else {
      this.collObject1.index = true
    }
    console.log(this.collObject1.index);
    
  }
  
  dispatchOrder() {
    
    console.log(this.orderDetail1);
    console.log(this.userDetail);
    
    for (let i = 0; i < this.orderDetail1.length; i++) {
      this.orderDetail1[i]['amount'] = ((this.orderDetail1[i]['price']) * (this.orderDetail1[i]['dispatchQty']));
      this.orderDetail1[i]['pending_qty'] = ((this.orderDetail1[i]['qty']) - (this.orderDetail1[i]['dispatchQty']));
      
      if (this.orderDetail1[i]['dispatchQty'] > 0) {
        this.flag++;
      }
      else {
        
      }
    }
    
    if (this.flag == 0) {
      let toast = this.toastCtrl.create({
        message: 'Add at least one item to dispatch',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    
    else {
      
      console.log(this.orderDetail1);
      this.service1.addData({ 'dr_id': this.distributorId, 'order_id': this.userDetail.order_id, 'data': this.orderDetail1 }, 'DealerData/dispatch_order').then((response) => {
        console.log(response);
        if (response['msg'] == "success") {
          
          let toast = this.toastCtrl.create({
            message: 'Order Item Dispatched Successfully',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          this.close();
          // this.navCtrl.remove(2,1,{animate:false});
          this.navCtrl.pop({animate:false});

          // this.navCtrl.push(OrderListPage, { 'type': 'Secondary' });

        }
        else {
          let toast = this.toastCtrl.create({
            message: 'Error! Something went wrong !....',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        
      });
      
    }
  }
  
  
  check_qty(index) {
    console.log("in check qty");
    console.log(index);
      console.log("in else");
      if (this.orderDetail1[index]['dispatchQty'] == null) {
        this.orderDetail1[index]['dispatchQty'] = 0;
      }
      
      if (this.orderDetail1[index]['pending_qty'] > this.orderDetail1[index]['stock']) {
        if ((this.orderDetail1[index]['dispatchQty']) > (this.orderDetail1[index]['stock'])) {
          this.orderDetail1[index]['dispatchQty'] = this.orderDetail1[index]['stock'];
          if(this.orderDetail1[index]['dispatchQty'] == null){
          this.orderDetail1[index]['dispatchQty'] = 0;
          }
          let toast = this.toastCtrl.create({
            message: 'Dispatch Quantity should be less than Distributor Stock',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
      else {
        if ((this.orderDetail1[index]['dispatchQty']) > (this.orderDetail1[index]['pending_qty'])) {
          this.orderDetail1[index]['dispatchQty'] = this.orderDetail1[index]['pending_qty'];
          let toast = this.toastCtrl.create({
            message: 'Dispatch Quantity should be less than Pending Quantity',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      }
    
  }
  
  
  
  
  
  
  
  
}
