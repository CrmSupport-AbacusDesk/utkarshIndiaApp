import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the LoadingCntrlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading-cntrl',
  templateUrl: 'loading-cntrl.html',
})
export class LoadingCntrlPage {

  state;

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

