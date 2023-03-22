// import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';

// /**
//  * Generated class for the FollowupDetailPage page.
//  *
//  * See https://ionicframework.com/docs/components/#navigation for more info on
//  * Ionic pages and navigation.
//  */

// @IonicPage()
// @Component({
//   selector: 'page-followup-detail',
//   templateUrl: 'followup-detail.html',
// })
// export class FollowupDetailPage {
//   followup_id: any;
//   followup_detail: any={};
//   loader: boolean = false;
  
//   constructor() { 
    
    
 
    
//   }
  
//   ngOnInit() {
//   }
  
  
//   get_followup_detail() {
//     this.loader = true;
//     this.serve.fetchData({'followup_id':this.followup_id}, "Distributors/followup_detail").subscribe((result) => {
//       this.followup_detail = result['followup_detail'][0];
//       
//       setTimeout(() => {
//         this.loader = false;
//       }, 700);
//     })
//   }
  
  
//   edit_followup_modal() {
//     const dialogRef = this.dialog.open(FollowupEditComponent, {
//       width: '750px',
//       data: {
//         'followup_detail':this.followup_detail,
//         'from':'followup detail page'
//       }
//     });
//     dialogRef.afterClosed().subscribe(result => {
//       this.get_followup_detail()
//     });
//   }
  
  
  
// }
import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FollowupAddPage } from '../followup-add/followup-add';

/**
* Generated class for the FollowupDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-followup-detail',
  templateUrl: 'followup-detail.html',
})
export class FollowupDetailPage {
  
  loading:Loading;
  followup_id:any = '0';
  followup_detail:any = [];
  status:any=''
  today_date = moment(new Date()).format('YYYY-MM-DD');
  max_date = new Date().getFullYear() + 1;
  disable_update : boolean = true;
  current_followup_date:any=''
  
  
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public serve:MyserviceProvider,public loadingCtrl:LoadingController,public dbService:DbserviceProvider, public navParams: NavParams) {
  }
  
  ionViewDidLoad() {
    
  }
  
  ionViewWillEnter(){
    
    
    
    
    if(this.navParams.get('from') == 'follow_up_list_page' && this.navParams.get('follow_up_id')){
      this.followup_id = this.navParams.get('follow_up_id')
      this.get_followup_detail();
    }
    
  }
  
  get_followup_detail(){
    
    this.serve.presentLoading();

    this.serve.addData({'Id':this.followup_id},'AppFollowup/followupDetail').then((result)=>{
      
      if(result['statusCode']=200){
      this.followup_detail = result['result']
      this.status = this.followup_detail.status;
      this.current_followup_date = this.followup_detail.next_follow_date;
      

      this.serve.dismissLoading();
      }else{
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
      
      
    },err=>
    {
      this.serve.dismissLoading();
      this.serve.errorToast('Something went wrong')

      
    this.navCtrl.pop();
  });
  
}


change_followup_status(){
  
  this.serve.presentLoading();
  
  this.serve.addData(this.followup_detail.status == 'Complete' ? {'Id':this.followup_detail.id,'Status':this.followup_detail.status} : {'Id':this.followup_detail.id,'Status':this.followup_detail.status,'followup_date':this.followup_detail.follow_up_date,'followup_remark':this.followup_detail.followup_remark},'AppFollowup/followupUpdate').then((result)=>{
    
    if(result['statusCode'] == 200){
        this.serve.dismissLoading();
        this.serve.successToast(result['statusMsg'])
      
      if(this.followup_detail.status == 'Complete'){
        let alert = this.alertCtrl.create({
          title: 'Add Follow Up?',
          subTitle: 'Do You Want To Create Other Follow Up',
          cssClass: 'action-close',
          
          buttons: [{
            text: 'NO',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          },
          {
            text: 'YES',
            cssClass: 'close-action-sheet',
            handler: () => {
              this.navCtrl.push(FollowupAddPage,{'follow_up_data':this.followup_detail,'from':'followup detail page'});
            }
          }]
        });
        alert.present();
      }
      else{
        this.serve.successToast(result['statusMsg'])
        this.navCtrl.pop();
       
      }
    }else{
      this.serve.errorToast(result['statusMsg'])
    }
    
    
  }, error => {
    this.serve.Error_msg(error);
    this.serve.dismissLoading();
    this.navCtrl.pop();
  });

}


}
