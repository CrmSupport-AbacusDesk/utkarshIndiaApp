import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, AlertCmp, ViewController, Events } from 'ionic-angular';
import { ConstantProvider } from '../../../providers/constant/constant';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { VisitingCardListPage } from '../visiting-card-list/visiting-card-list';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';
import { Network } from '@ionic-native/network';




/**
* Generated class for the VisitingCardAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-visiting-card-add',
  templateUrl: 'visiting-card-add.html',
})
export class VisitingCardAddPage {
  state
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events,private network: Network) {
    // if (this.network.type == 'none') {
    //   this.closeModel();
    //   this.navCtrl.push(NotificationPage)
    // }
    events.subscribe('state', (data) => {
      console.log(data);
      if(data=='stop'){
        this.closeModel();
      }
    });
    this.StartTimer();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadingCntrlPage');
  }

  closeModel() {
    console.log("Close");

    this.viewCtrl.dismiss();
  }


  maxTime: any = 0;
  hidevalue: boolean = false;
  StartTimer() {
    setTimeout((x) => {
      this.maxTime++;
      this.StartTimer();
    }, 1000);
  }
}