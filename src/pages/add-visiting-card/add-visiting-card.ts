import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController, Platform, App, Events } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-add-visiting-card',
  templateUrl: 'add-visiting-card.html',
})
export class AddVisitingCardPage {
  data: any={};
  distributor_network_list:any = [];

 
  constructor(
              public navCtrl: NavController,
              public events:Events,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public viewCtrl: ViewController
              ,public service1:MyserviceProvider,
              public toastCtrl: ToastController,
              public storage: Storage, 
              public modal: ModalController, 
              public platform: Platform, 
              public service:DbserviceProvider,
              public appCtrl: App)
  {   
  
  }

  ionViewDidLoad()
  {

  }

  addVisitingCardRequest(){
    console.log(this.data)
  }
  get_network_list(network_type)
  {
      this.data.type_name = {};
      this.service1.show_loading()
      this.service1.addData({'type':network_type},'DealerData/get_type_list').then((result)=>{
          console.log(result);
          this.distributor_network_list = result;
          console.log(this.distributor_network_list);
          this.service1.dismiss();
      });
  } 

}
