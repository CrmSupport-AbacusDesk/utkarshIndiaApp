import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController, Loading,Nav, App, Events } from 'ionic-angular';
import { CancelationPolicyPage } from '../cancelation-policy/cancelation-policy';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { TransactionPage } from '../transaction/transaction';
import { TabsPage } from '../tabs/tabs';
import { MyserviceProvider } from '../../providers/myservice/myservice';



@IonicPage()
@Component({
    selector: 'page-cancelpolicy-modal',
    templateUrl: 'cancelpolicy-modal.html',
})
export class CancelpolicyModalPage {
    net:any='';

    constructor(public navCtrl: NavController, public navParams: NavParams,private app:App,public serv: MyserviceProvider,public events: Events) {
      events.subscribe('state', (data) => {
        console.log(data);
        if(data=='online'){
          this.reload();
        }
      });
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad NotificationPage');
      this.net=this.navParams.get('net');
      console.log(this.net);
     
      
    }
  
   
  
    reload(){
  
  
      console.log(this.serv.isInternetConnection);
  
  
      if( this.serv.isInternetConnection==false){
        console.log("internet offlineeeeeeeeeee");
        
      }
      else{
  
        this.navCtrl.pop()
      }
    }
  }
  