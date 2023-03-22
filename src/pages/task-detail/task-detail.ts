import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import moment from 'moment';
import { ConstantProvider } from '../../providers/constant/constant';
import { ViewProfilePage } from '../view-profile/view-profile';
/**
* Generated class for the SupportDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-task-detail',
  templateUrl: 'task-detail.html',
})
export class TaskDetailPage {
  id: any;
  task_detail: any = {};
  data: any = {};
  star: any = '';
  promise_date: any = '';
  remark: any = '';
  task_type: any = '';
  url: any;
  date: any;
  created_by: any;
  spinLoader: boolean = false;



  constructor(public navCtrl: NavController, public navParams: NavParams, private serve: MyserviceProvider, public constant: ConstantProvider,public  modalCtrl:ModalController) {
    if (this.navParams.get('id')) {
      console.log(navParams);

      this.id = this.navParams.get('id');
      this.task_type = this.navParams.get('task_type');
      this.created_by = this.navParams.get('created_by');

    }
    if (this.id) {
      this.get_task_detail();
    }
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.url = constant.upload_url1 + 'task/'
  }

  ionViewDidLoad() {
  }

  start_rating: any = {};

  rating(star) {
    this.star = star;
  }
  get_task_detail() {
    this.serve.addData({ 'id': this.id }, 'AppTask/getTaskDetail').then((result) => {

      if (result['statusCode'] == 200) {
        this.task_detail = result['data'];
        this.star = this.task_detail.feedback_star;
        this.serve.dismissLoading();
      }
      else {
        this.serve.errorToast(result['statusMsg']);
        this.serve.dismissLoading();
      }

    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }



  submitDate(status) {
    let update_api = ''
    let header_data = {};
    this.spinLoader = true;
    if (status == 'promise_pending') {
      update_api = 'AppTask/updatePromiseDate'
      header_data = { 'id': this.id, 'created_by': this.created_by, 'promise_date': this.promise_date }
    } else if (status == 'promise_done') {
      update_api = 'AppTask/closeTask'
      header_data = { 'id': this.id, 'created_by': this.created_by, 'close_remark': this.data.remark }
    }
    this.serve.addData(header_data, update_api).then((result) => {
      if (result['statusCode'] == 200) {
        this.spinLoader = false;
        this.serve.successToast(result['statusMsg']);
        this.get_task_detail();
      }
      else {
        this.spinLoader = false;
        this.serve.errorToast(result['statusMsg']);
      }
    }, err => {
      this.spinLoader = false;
      this.serve.errorToast(err);

    });
  }

  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }

}
