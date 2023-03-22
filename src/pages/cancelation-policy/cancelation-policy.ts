import { Component } from '@angular/core';
import { App, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-cancelation-policy',
  templateUrl: 'cancelation-policy.html',
})
export class CancelationPolicyPage {
  net:any='';
  spinner:any = false;


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
    if( this.serv.isInternetConnection==false){
     this.spinner = true;
    }
    else{
      this.spinner = false;
      this.navCtrl.pop()
    }
  }
}
