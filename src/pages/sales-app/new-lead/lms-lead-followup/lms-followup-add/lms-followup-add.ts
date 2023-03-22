import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';

@IonicPage()
@Component({
  selector: 'page-lms-followup-add',
  templateUrl: 'lms-followup-add.html',
})
export class LmsFollowupAddPage {
  disableSelect:boolean = false;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  followup_data:any={};
  followupDate:any='';
  data:any={}
  userId:any=''
  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;
  loading:Loading;  
  drList:any=[];
  followupList:any=[];
  objectkey:any;
  drtype:any;
  checkin_id:any=0;
  Drtype : any = ''
  key1: any = ''
  countobject:any;
  type:any;
  
  getValue:any = {};
  constructor(
    public navCtrl: NavController,
    public storage:Storage, 
    public navParams: NavParams,
    public service: MyserviceProvider, 
    public loadingCtrl: LoadingController , 
    public alertCtrl:AlertController,
    public toastCtrl: ToastController,) 
    {
      
      console.log(this.navParams);
      this.checkin_id=this.navParams.get('checkin_id')
      this.userId = this.navParams.get('user_id')
      this.type = this.navParams.get('type')
      if(this.checkin_id){
        this.disableSelect=true;

      }
     this.getNetworkType()
      
    }
    
    ionViewDidLoad() {
      if(this.navParams.get('checkin_id')){
        this.disableSelect=true;
   
    this.drtype=this.navParams.get('order_type');
    this.followup_data.dr_type=this.navParams.get('dr_type');
    // this.get_network_list(this.data.networkType);
    this.data.id= this.navParams.get('id');
    this.data.company_name= this.navParams.get('dr_name');
    // this.get_distributor_list(this.data.type_name);
    console.log(this.data.id);
    console.log(this.data.company_name);
    this.getDrList(this.data)
    // console.log(this.data.networkType);
}

if(this.navParams.get('type')){
  this.disableSelect=true;

this.drtype=this.navParams.get('order_type');
this.followup_data.dr_type=this.navParams.get('type');
// this.get_network_list(this.data.networkType);
this.data.id= this.navParams.get('id');
this.data.company_name= this.navParams.get('company_name');
// this.get_distributor_list(this.data.type_name);
console.log(this.data.id);
console.log(this.data.company_name);
this.getDrList(this.data)
// console.log(this.data.networkType);
}

// if(this.navParams.get('type')){
//   this.followup_data.dr_type=this.navParams.get('type');
  
//   this.data.id= this.navParams.get('id');
//   this.data.company_name= this.navParams.get('dr_name');
  
//   console.log('type fetched success')
//   console.log(this.navParams.get('type'))
// }else{
//   console.log('type fetched fail')

// }
      console.log('ionViewDidLoad FollowupAddPage');
    }
    networkType:any=[]
    getNetworkType(){
        this.service.addData3('', "Dashboard/allNetworkModule").then((result => {
          console.log(result);
          this.networkType = result['modules'];
        }))
      }
    getFollowup(date)
    {
      console.log(this.getValue);
      this.followupDate = date
      console.log(this.followup_data);
      console.log(date);
      this.show_loading();
      this.service.addData({'Date':this.followupDate},'followup_new/followup_Date_info').then((result)=>
      {
        
        this.followupList=result['result'];        
        
        console.log(result)
        console.log(result['count'])
        // console.log(result['count'][0])
        // this.key1 = Object.keys(result['count'][0]);
        if(result['count'].length > 0){

        
        for(let i=0; i<result['count'].length; i++){
          for(let key in result['count'][i]){
            switch(key){
                case '09:00:00': this.getValue.nineam = result['count'][i][key]; break;
                case '09:30:00': this.getValue.ninethirtyam = result['count'][i][key]; break;
                case '10:00:00': this.getValue.tenam = result['count'][i][key]; break;
                case '10:30:00': this.getValue.tenthirtyam = result['count'][i][key]; break;
                case '11:00:00': this.getValue.elevenam = result['count'][i][key]; break;
                case '11:30:00': this.getValue.eleventhirtyam = result['count'][i][key]; break;
                case '12:00:00': this.getValue.twelvepm = result['count'][i][key]; break;
                case '12:30:00': this.getValue.twelvethirtypm = result['count'][i][key]; break;
                case '13:00:00': this.getValue.onepm = result['count'][i][key]; break;
                case '13:30:00': this.getValue.onethirtypm = result['count'][i][key]; break;
                case '14:00:00': this.getValue.twopm = result['count'][i][key]; break;
                case '14:30:00': this.getValue.twothirtypm = result['count'][i][key]; break;
                case '15:00:00': this.getValue.threepm = result['count'][i][key]; break;
                case '15:30:00': this.getValue.threethirtypm = result['count'][i][key]; break;
                case '16:00:00': this.getValue.fourpm = result['count'][i][key]; break;
                case '16:30:00': this.getValue.fourthirtypm = result['count'][i][key]; break;
                case '17:00:00': this.getValue.fivepm = result['count'][i][key]; break;
                case '17:30:00': this.getValue.fivethirtypm = result['count'][i][key]; break;
                case '18:00:00': this.getValue.sixpm = result['count'][i][key]; break;
                case '18:30:00': this.getValue.sixthirtypm = result['count'][i][key]; break;
                case '19:00:00': this.getValue.sevenpm = result['count'][i][key]; break;
                case '19:30:00': this.getValue.seventhirtypm = result['count'][i][key]; break;
                case '20:00:00': this.getValue.eightpm = result['count'][i][key]; break;
            }
            console.log(this.getValue)
          }
        }
      }else{
        this.getValue = []
      }
        this.loading.dismiss();
      },err=>
      {
        this.loading.dismiss()
        
      })
      
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
        // this.followup_data.dr_type=this.navParams.get('dr_type');
        this.Drtype = this.navParams.get('dr_type');
        // this.getDrList( this.Drtype);
      }
      
    }
    
    getDrList(type)
    {
      console.log(this.followup_data);
      console.log(type);
      this.followup_data.checkin_id=this.checkin_id;
      console.log(this.followup_data);
      if (this.navParams.get('checkin_id')||this.navParams.get('type')) {
        this.drList.push({ id: type.id, company_name: type.company_name })
        this.followup_data.dr_id = this.drList[0]
        console.log('====================================');
        console.log(this.drList);
        console.log(this.data.type_name);
        console.log('====================================');
    } else {
      
      this.drList = [];
      this.service.addData(this.followup_data ,'followup_new/Followup_customer').then((result)=>
      {
        console.log(result);
        this.drList=result['result'];
        
        if(this.navParams.get('dr_name')){
          this.followup_data.dr_id= this.drList.filter(row=>row.company_name == this.navParams.get('dr_name'));
          console.log(this.followup_data.dr_id);
          this.followup_data.dr_id=this.followup_data.dr_id[0].id;
          console.log(this.followup_data.dr_id);
        }
        
      },err=>
      {
        
      });
    }
      
     
      
    }
    
    addFollowup()
    {
      
      // var index = this.followupList.findIndex(row=>row.dr_id==this.followup_data.dr_id)
      // console.log(index);
      // if(index!= -1)
      // {
      //   this.service.presentToast('Follow Up Already Exists !!')
      //   return
      // }
      this.show_loading();
      
      console.log(this.followup_data);
      this.followup_data.dr_id = this.followup_data.dr_id.id;
      console.log(this.followup_data.followup_time)
      // this.followup_data.followup_time = this.followup_data.followup_time+':00'
      this.service.addData(this.followup_data,'followup_new/add_followup').then((result)=>
      {
        this.loading.dismiss();
        if(result['status'] == true){
        let toast = this.toastCtrl.create({
          message: 'Follow Up Saved Successfully!',
          duration: 3000
        });
        
        if(result['msg'] == 'Success')
        { 
          toast.present();
          console.log('data inserted successully')
          this.getFollowup(this.followup_data.followup_date)
          // this.getFollowup(this.followup_data.followup_time)
          this.followup_data.type = '';
          this.followup_data.dr_type = '';
          this.followup_data.description = '';
          // this.followup_data.amount = '';

          this.followup_data.dr_id = '';
          this.drList = [];
        
          this.navCtrl.pop();
          // this.navCtrl.push(FollowupListPage, {'user_id':this.userId})
        }
      }
        else{
         let toast = this.toastCtrl.create({
            message: result['msg'],
            duration: 3000
          });
          this.getFollowup(this.followup_data.followup_date)
          toast.present();
        }
      },err=>
      {
        this.loading.dismiss() 
      })
    }
    
    
    deleteFollowUp(id,i)
    {
      
      let alert = this.alertCtrl.create({
        title: 'Delete Follow Up',        
        message: 'Do you want to delete Follow Up?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              
              this.service.addData({'id':id},'Followup/deleteFollowUp').then((result)=>
              {
                let toast = this.toastCtrl.create({
                  message: 'Follow Up Deleted!',
                  duration: 3000
                });
                if(result=='success')
                {
                  toast.present();
                  this.followupList.splice(i,1);
                  this.getFollowup(this.followup_data.followup_date);
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
    
    show_loading()
    {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg"/>`,
        dismissOnPageChange: false
      });
      this.loading.present();
    }
    
  }
  