import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelAddPage } from '../travel-add/travel-add';
import { Storage } from '@ionic/storage';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';


/**
 * Generated class for the TravelDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-detail',
  templateUrl: 'travel-detail.html',
})
export class TravelDetailPage {

  travelId:any;
  detail:any={};
  date_from:any={};
  date_to:any={};
  userId:any='';
  travel_area_list:any=[];
  travel_dr_list:any=[];
                     
  constructor(
               public navCtrl: NavController, 
               public navParams: NavParams,
               public storage:Storage,
               public db:MyserviceProvider,
               public toastCtrl: ToastController,
               public modalCtrl: ModalController)
  {
                this.travelId = this.navParams.get('id');
                console.log(this.travelId);

                this.storage.get('userId').then((resp)=>
                {
                    this.userId = resp
                });
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad TravelDetailPage');

  }

  ionViewDidEnter()
  {
    this.travelDetail();

  }


  goOnTravelAdd()
  {
    console.log(this.detail);
    
    this.navCtrl.push(TravelAddPage,{'data':this.detail})
  }


   travelDetail()
   {
    this.db.show_loading();
    this.db.addData({'travelId':this.travelId},"TravelPlan/travelDetail").then(resp=>
      {
          console.log(resp);
          this.detail= resp['travel'];
          if( this.detail.travel_type=="Distributor Visit"){
            this.detail.travel_type="Partywise Visit"
          }
          this.travel_area_list=resp['travel']['travel_list'];
          this.travel_dr_list=resp['travel']['area_dealer_list'];

          this.db.dismiss();
          
      },err=>
      {
          this.db.dismiss()
      })
   }

   statusModal(type) 
    {
      let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'from':'travel','travelId':this.travelId});

      modal.onDidDismiss(data =>
      {
          this.travelDetail();
      });
      
      modal.present();
    }
 
}
