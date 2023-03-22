import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ViewProfilePage } from '../view-profile/view-profile';

@IonicPage()
@Component({
  selector: 'page-support-detail',
  templateUrl: 'support-detail.html',
})
export class SupportDetailPage {
  id:any;
  support_detail:any ={};
  docImg:any =[];

  data:any ={};
  star:any=''; 
  url:any ='';
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public constant: ConstantProvider,  public alertCtrl: AlertController, private service:MyserviceProvider,public modalCtrl:ModalController) {
    this.url = this.constant.support_url;
    this.service.presentLoading();
    
    
    if (this.navParams.get('id')) {
      this.id = this.navParams.get('id');
    }
    if(this.id){
      this.get_support_detail();
    }
  }
  
  ionViewDidLoad() {
  }
  
  start_rating:any= {};
  
  rating(star)
  {
    this.star = star;
  }
  get_support_detail() {
    this.service.addData({'id':this.id}, 'AppSupport/getSupportDetail').then((result) => {
      if(result['statusCode'] == 200){
        this.support_detail = result['data'];
        this.docImg = this.support_detail.img;

        this.star = this.support_detail.feedback_star;
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
    },
    er => {
      this.service.dismissLoading();
    });
  }

  
  submitRating() {
    this.service.addData({'id':this.id, 'feedback_star':this.star, 'feedback':this.data.remarks }, 'AppSupport/addSupportFeedback').then((result) => {
      
      if(result['statusCode'] == 200){
        this.service.successToast(result['statusMsg']);
        this.get_support_detail();
      }
      else{
        this.service.errorToast(result['statusMsg']);
      }
    });
  }

  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }
  
}
