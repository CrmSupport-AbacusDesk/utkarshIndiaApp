import { Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { FollowupAddPage } from '../followup-add/followup-add';
/**
* Generated class for the ExpenseStatusModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-status-modal',
  templateUrl: 'expense-status-modal.html',
})
export class ExpenseStatusModalPage {
  
  data: any = {}
  filter: any = {}
  followup_detail:any={}
  from_page: any = ''
  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;
  savingFlag :boolean = false;
  
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public serve: MyserviceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public alertCtrl : AlertController) {
      this.from_page = this.navParams.get("from");
      
      if (this.from_page == 'team') {
        this.data.type = this.navParams.get("type");
      }
      if (this.from_page == 'travel') {
        this.data.id = this.navParams.get("travelId");
      }
      if (this.from_page == 'expense') {
        this.data.id = this.navParams.get("expenseId");
        this.data.type = this.navParams.get("type");
      }
      if (this.from_page == 'leave') {
        this.data.id = this.navParams.get("leaveId");
      }
      if (this.from_page == 'travel') {
        this.data.id = this.navParams.get("travelId");
      }
      if (this.from_page == 'lead_detail') {
        this.data.dr_id = this.navParams.get("leadID");
      }
      if (this.from_page == 'team') {
        this.data.type = this.navParams.get("type");
      }
      if (this.from_page == 'followup') {
        this.data.id = this.navParams.get("follow_up_id");
        this.followup_detail = this.navParams.get("followup_detail")
      }
      if (this.from_page == 'influencer_followup') {
        this.data.type = this.navParams.get("type");
        this.data.dr_type = this.navParams.get("dr_type");
        this.data.dr_id = this.navParams.get("id");
        
        this.data.type_name = 'enquiry';
      }
      if (this.from_page == 'enquiry_status') {
        this.data.dr_id = this.navParams.get("id");
        this.data.type = this.navParams.get("type");
        
      }
      
    }
    
    
    ionViewDidLoad() {
      
    }
    
    dismiss() {
      this.viewCtrl.dismiss();
    }
    
    update_status() {
      var func_name
      if (this.from_page == 'expense') {
        func_name = 'Expense/update_status'
      }
      
      if (this.from_page == 'travel') {
        func_name = 'TravelPlan/update_status'
      }
      if (this.from_page == 'leave') {
        func_name = 'AppLeave/statusChange'
        
      }
      if (this.from_page == 'enquiry_status') {
        func_name = 'AppEnquiry/enquiryStageChange'
      }
      this.serve.addData(this.data, func_name).then((result) => {
        if(result['statusCode'] == 200){
          this.serve.successToast(result['statusMsg']);
          this.savingFlag = false; 
          let data  = {'value':'true'}
          this.viewCtrl.dismiss(data);   
        }
        else{
          this.serve.errorToast(result['statusMsg']);
          this.savingFlag = false;
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    team: any = []
  
    
    
    ondismiss() {
      {
        var data = this.filter
        this.viewCtrl.dismiss(
          data
          );
        }
      }
      
      
      
      addFollowup()
      {
        this.savingFlag = true;
        this.serve.addData(this.data,'followup_new/add_followup').then((result)=>
        {
          if(result['statusCode'] == 200){
            this.serve.successToast(result['statusMsg']);
            this.savingFlag = false; 
            this.viewCtrl.dismiss();   
          }
          else{
            this.serve.errorToast(result['statusMsg']);
            this.savingFlag = false;  
          }
        },err=>
        {
        })
      }
      change_followup_status(){        
        this.serve.addData({'Id':this.followup_detail.id,'Status':this.followup_detail.status,'followup_date':this.followup_detail.follow_up_date,'followup_remark':this.followup_detail.followup_remark},'AppFollowup/followupUpdate').then((result)=>{
          
          if(result['statusCode'] == 200){
              this.serve.successToast(result['statusMsg'])
              this.viewCtrl.dismiss(true);   
            // if(this.followup_detail.status == 'Complete'){
            //   let alert = this.alertCtrl.create({
            //     title: 'Add Follow Up?',
            //     subTitle: 'Do You Want To Create Other Follow Up',
            //     cssClass: 'alert-modal',
                
            //     buttons: [
            //       {
            //         text: 'NO',
            //         role: 'cancel',
            //         handler: () => {
            //         }
            //       },
            //       {
            //         text: 'YES',
            //         cssClass: 'close-action-sheet',
            //         handler: () => {
            //           if(this.navCtrl.getViews().length>=2){
            //             this.navCtrl.remove(1, 1, {animate:false})
            //             this.navCtrl.pop({animate:false})
            //           }
            //           this.navCtrl.push(FollowupAddPage,{'follow_up_data':this.followup_detail,'from':'followup_status'});
            //         }
            //       }
                 
            //   ]
            //   });
            //   alert.present();
            // }
            
          }else{
            this.serve.errorToast(result['statusMsg'])
          }
          
          
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismissLoading();
        });
      
      }
      
    }
    