import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ExpenseListPage } from '../expense-list/expense-list';
import { OrderListPage } from '../order-list/order-list';
import { VisitingCardListPage } from '../visiting-card/visiting-card-list/visiting-card-list';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';




@IonicPage()
@Component({
  selector: 'page-expense-popover',
  templateUrl: 'expense-popover.html',
})
export class ExpensePopoverPage {
  
  page_from:any='';
  via:any;
  checkInData:any;
  showEditRetailer:boolean=false;
  type:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) 
  {
    console.log(this.navParams);
    this.type = this.navParams.get('type');
    console.log(this.type);

    this.page_from = this.navParams.get('from');
    this.via = this.navParams.get('via');
    this.showEditRetailer=this.navParams.get('showEditRetailer');
    console.log(this.showEditRetailer);
    
    this.checkInData = this.navParams.get('checkInData')
    
    
  }
  
  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad ExpensePopoverPage');
  }
  
  close(type) 
  {
    // return type
    this.viewCtrl.dismiss({ 'TabStatus': type});
  }
  
  goto(type){
    
    if(type == 'Primary Orders'){
      console.log("in Primary order");
      console.log(this.checkInData.dr_name);
      this.navCtrl.push(OrderListPage,{'type':'Primary', 'dr_name':this.checkInData.dr_name})
      this.viewCtrl.dismiss();
      
    }
    else if(type == 'Secondary Orders'){
      console.log("in Primary order");
      console.log(this.checkInData.dr_name);
      this.navCtrl.push(OrderListPage,{'type':'Secondary', 'dr_name':this.checkInData.dr_name})
      this.viewCtrl.dismiss();
      
    }
    else if(type == 'Visiting Card'){
      console.log("in Visiting Card");
      console.log(this.checkInData.dr_name);
      this.navCtrl.push(VisitingCardListPage,{'dr_name':this.checkInData.dr_name})
      this.viewCtrl.dismiss();
    }
    else if(type == 'Pop & Gifts'){
      console.log("in Pop & Gifts");
      console.log(this.checkInData.dr_name);
      this.navCtrl.push(PopGiftListPage,{'dr_name':this.checkInData.dr_name})
      this.viewCtrl.dismiss();
    }

    else if(type == 'Show'){
      console.log("in Pop & Gifts");
      this.viewCtrl.dismiss({ 'Retailer': type});
    }
    else if(type == 'Hide'){
      console.log("in Pop & Gifts");
      this.viewCtrl.dismiss({ 'Retailer': type});
    }


  }
}
