import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the WeekconnectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-weekconnection',
  templateUrl: 'weekconnection.html',
})
export class WeekconnectionPage {

  net: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App, public serv: MyserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');

  }

  reload() {
    this.navCtrl.pop()
  }
}