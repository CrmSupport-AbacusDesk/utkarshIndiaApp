import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Loading, LoadingController, AlertController, ViewController, ToastController } from 'ionic-angular';
import { TravelAddPage } from '../travel-add/travel-add';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { PopoverController } from 'ionic-angular';
import moment from 'moment';
import { TravelDetailPage } from '../travel-detail/travel-detail';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-travel-list',
  templateUrl: 'travel-list.html',
})
export class TravelListPage {

  today_date = new Date().toISOString().slice(0, 10);
  travel_list: any = [];
  selected_date = new Date().toISOString().slice(0, 10);
  loading: Loading;
  travelId: any;
  travel_from: any;
  teamCount: any;
  travelstatus: any = 'Pending';
  travelData: any = 'today';
  travelList: any = [];
  sendRequest: any = false
  travelType: any = "My";
  requestSend: any = false;
  userId: any = '';

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController,
    public db: MyserviceProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public navParams: NavParams, public service: MyserviceProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    this.travelId = this.navParams.get('id');
    this.travel_from = this.navParams.get('from');
    if (this.navParams.get('from') == 'travel') {
      this.travelType = "Team"

    }
    if (this.navParams.get('from') == 'dashboard_travel_plan_for_approval') {
      this.travelType = "Team"

    }
  }

  ionViewWillEnter() {

    this.getTravelPlan();
  }

  goOnAddTravel() {
    this.navCtrl.push(TravelAddPage, {})
  }

  goOnTravelDetail(id) {
    console.log(id);

    this.navCtrl.push(TravelDetailPage, { "id": id })
  }


  nextDate() {
    console.log(this.selected_date);
    this.selected_date = moment(this.selected_date).add(1, 'days').format('YYYY-M-D');
    console.log(this.selected_date);
    this.getTravelPlan();

  }

  previousDate() {
    this.selected_date = moment(this.selected_date).subtract(1, "days").format('YYYY-M-D');
    this.getTravelPlan();
  }


  getTravelPlan() {
    this.requestSend = false
    this.service.show_loading();
    this.service.addData({ 'travelstatus': this.travelstatus, 'travelType': this.travelType }, 'TravelPlan/get_travelPlan').then((result) => {
      this.travel_list = result;
      console.log(this.travel_list);
      for (let i = 0; i < this.travel_list.length; i++) {
        if (this.travel_list[i].travel_type == "Distributor Visit") {
          this.travel_list[i].travel_type = "Partywise Visit"
        }
      }

      this.service.dismiss();
      this.requestSend = true
    })
  }

  getTravelPlantoday() {
    this.requestSend = false
    this.service.show_loading();
    this.service.addData({ 'travelData': this.travelData, 'travelType': this.travelType }, 'TravelPlan/get_travelPlan').then((result) => {
      this.travel_list = result;
      console.log(this.travel_list);
      this.service.dismiss();
      this.requestSend = true
    })
  }

  deleteTravelPlan(id, i, flag) {
    if (flag == '1') {
      this.presentAlert('Already Visted')
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Delete Travel Plan',
        message: 'Do you want to delete travel plan?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.service.addData({ 'id': id }, 'TravelPlan/deleteTravelPlan').then((result) => {
                let toast = this.toastCtrl.create({
                  message: 'Travel Plan Deleted!',
                  duration: 3000
                });
                if (result == 'success') {
                  this.travel_list.splice(i, 1);
                  this.getTravelPlan();
                }
              });
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      alert.present();
    }
  }



  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: msg,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'Travel Plan' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

      console.log(resultData);
      if (resultData) {
        this.travelType = resultData.TabStatus;
        console.log(this.travelType);

        this.getTravelPlan();
      }

    })

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad teamPopoverPage');
  }


  statusModal(id) {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage, { 'travelId': id, 'from': 'travel' });

    modal.onDidDismiss(data => {
      // this.navCtrl.pop();
      this.getTravelPlan();

    });

    modal.present();
  }
}
