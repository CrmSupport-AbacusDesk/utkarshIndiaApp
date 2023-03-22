import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController ,} from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { PrimaryOrderPage } from '../../../../primary-order/primary-order';
import { ModalController } from 'ionic-angular';
import { ExpenseStatusModalPage } from '../../../../expense-status-modal/expense-status-modal';
import { AddCheckinPage } from '../../../add-checkin/add-checkin';

@IonicPage()
@Component({
  
  selector: 'page-lms-activity-list',
  templateUrl: 'lms-activity-list.html',
})
export class LmsActivityListPage {
  NavType : any = {};
  dr_id : any;
  dr_code : any;
  checkin_data:any={}
  DrType : any;
  id:any;
  name:any;
  constructor(public navCtrl: NavController, public modalCtrl : ModalController, public navParams: NavParams, public viewCtrl: ViewController,private menu: MenuController) {
    console.log(this.navParams);
    this.NavType=this.navParams.get('from');
    this.DrType=this.navParams.get('dr_type');
    this.id=this.navParams.get('id');
    this.checkin_data=this.navParams.get('checkin_data');
    this.name=this.navParams.get('name');
    console.log('NavType',this.navParams.data.from);
    console.log('NavType',this.navParams.get('from'));
    this.dr_id=this.navParams.get('dr_id');
    this.dr_code=this.navParams.get('dr_code');
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    
  }
  statusModal(type) 
  {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'from':type,'id':this.checkin_data.id, 'dr_type':this.checkin_data.dr_type});
    modal.present();
  }
  
  close(type) {
    this.viewCtrl.dismiss({ 'TabStatus': type });
  }
  go_to(type) {
    console.log("Type",type)
    this.viewCtrl.dismiss({ 'TabStatus': type });
    if(type == 'enquiryDetail' ){
      if(this.navCtrl.getViews().length>=2){
        this.navCtrl.remove(1, 1, {animate:false})
        this.navCtrl.pop({animate:false})
      }
      this.navCtrl.push(PrimaryOrderPage,{'comes_from_which_page':'leads-detail', 'dr_code': this.dr_code ,'dr_id':this.dr_id,'type':type,'dr_type':this.DrType});
    }
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  
  
  checkin(type,id){
    this.navCtrl.push(AddCheckinPage,{'pagefrom':'enquiryDetail', 'type':4,'id':id, 'checkin_data':this.checkin_data})
  }
}
