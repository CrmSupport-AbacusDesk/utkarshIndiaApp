import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
 * Generated class for the ChangeStatusModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-status-model',
  templateUrl: 'change-status-model.html',
})
export class ChangeStatusModelPage {
  data: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewcontrol: ViewController, public serve: MyserviceProvider) {

    console.log('UserId', navParams.get('userId'));

    this.data.user_id = navParams.get('userId');
    this.data.currentMonth = navParams.get('currentMonth');
    this.data.currentYear = navParams.get('currentYear');
    // this.data.status = "Reject";
    // this.data.reason = "Test Reason";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeStatusModelPage');
    // this.updateStatus();
  }
  close() {

    this.viewcontrol.dismiss();
  }

  updateStatus() {
    this.serve.show_loading()
    this.serve.addData(this.data, "TravelPlan/update_status")
      .then(resp => {
        this.serve.dismiss()
        console.log(resp);

        this.close();
      },
        err => {
        })
  }

}
