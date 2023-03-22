import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';

/**
* Generated class for the MyInfluencerDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-my-influencer-detail',
  templateUrl: 'my-influencer-detail.html',
})
export class MyInfluencerDetailPage {
  influencer_id:any=''; 
  influencer_detail:any ={};
  saveFlag:boolean = false;
  data:any = {}
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams,public service:MyserviceProvider,public loadingCtrl:LoadingController,public storage:Storage,public db:DbserviceProvider,public constant:ConstantProvider,public toastCtrl:ToastController) {
    this.influencer_id = this.navParams.get('id');
    if(this.influencer_id){
      this.getDetail();
    }
    
  }
  
  ionViewDidLoad() {
  }
  
  getDetail()
  {
    this.service.presentLoading();
    this.service.addData({'id' :this.influencer_id},'AppInfluencer/influencerDetailForTransfer').then( (result) =>
    {
      if(result['statusCode'] == 200){
        this.influencer_detail = result['influencer'];
        this.service.dismissLoading();
      }
      else{
        this.service.errorToast(result['statusMsg']);
        this.service.dismissLoading();
      }
      
      
    }, error => {
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }
  
  
  
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Conformation',
      message: 'Are you sure you want to transfer points',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.submit();
          }
        }
      ]
    });
    alert.present();
  }
  
  checkValidation(data){
    if(data == undefined || !data || data == 0){
      this.service.errorToast('Please enter points');
      return;
    }
    else if(data > this.influencer_detail.distributor_point){
      this.service.errorToast('Insufficient points in your wallet');
      return;
    }
    else{
      this.presentConfirm();
    }
  }
  
  
  submit(){
    this.service.addData({'id' :this.influencer_id, 'influencer_name':this.influencer_detail.name, 'transfer_point':this.data.point},'AppInfluencer/transferDistributorPoint').then( (result) =>
    {
      if(result['statusCode'] == 200){
        this.service.successToast(result['statusMsg']);
        this.getDetail();
        this.data.point ='';
      }
      else{
        this.service.errorToast(result['msg']);
      }
    });
  }
  
}
