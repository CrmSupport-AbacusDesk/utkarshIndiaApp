import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import {FollowupListPage} from '../followup-list/followup-list';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FollowupListPageModule } from '../followup-list/followup-list.module';
import { Time } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-followup-add',
  templateUrl: 'followup-add.html',
})
export class FollowupAddPage 
{
  disableSelect:boolean = false;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  followup_data:any={};
  followupDate:any='';
  data:any={}
  userId:any=''
  filter:any={}
  flag:any=''
  today_date = new Date().toISOString().slice(0,10);
  max_date = new Date().getFullYear() + 1;
  loading:Loading;  
  drList:any=[];
  followupList:any=[];
  objectkey:any;
  spinner:any = false;
  drtype:any;
  checkin_id:any=0;
  Drtype : any = ''
  networkType:any=[]
  hourValues:any=[]
  key1: any = ''
  Page_From: any = ''
  showSelection : boolean = true
  countobject:any;
  
  getValue:any = {};
  constructor(
    public navCtrl: NavController,
    public storage:Storage, 
    public navParams: NavParams,
    public serve: MyserviceProvider, 
    public loadingCtrl: LoadingController , 
    public alertCtrl:AlertController,
    public toastCtrl: ToastController,) 
    {
      this.hourValues = ['06','07','08','09','10','11','12','13','14','15','16','17','18','19']
      this.checkin_id=this.navParams.get('checkin_id')
      this.userId = this.navParams.get('user_id')
      this.Page_From = this.navParams.get('from');
      if(this.checkin_id){
        this.disableSelect=true;
        
      }
        
    }
    ionViewDidEnter(){
      this.getNetworkType()

      if(this.navParams.get('checkin_id')){
        this.disableSelect=true;
        this.showSelection = false
        this.Page_From = 'checkin_page';
        this.followup_data.id=this.navParams.get('dr_id');
        this.followup_data.dr_name=this.navParams.get('dr_name');
        this.followup_data.dr_type=this.navParams.get('dr_type');
        this.followup_data.dr_type_name=this.navParams.get('dr_type_name');
        this.getDrList(this.data)
        this.getType(this.followup_data.dr_type)
      }
      if(this.Page_From == 'followup_status'){
        let tempData = this.navParams.get('follow_up_data')
        console.log(tempData)
        this.disableSelect=true;
        this.showSelection = false
        this.followup_data.dr_type=tempData.dr_type;
        this.data= this.navParams.get('follow_up_data');
        this.data.id= tempData.dr_id;
        this.data.company_name= tempData.company_name;
        this.getDrList(this.data)
        this.getType(this.followup_data.dr_type)
      }
    }
    
    getNetworkType(){
      this.serve.presentLoading()
      this.serve.addData('', "AppFollowup/allNetworkModule").then(result => {
        if(result['statusCode']==200){
          this.networkType = result['modules'];
          this.serve.dismissLoading()  
        }else{
          this.serve.errorToast(result['statusMsg'])
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
      })
    }
    
    getUserType(type){
      this.followup_data.dr_type_name = '';
      this.followup_data.dr_id ='';
      this.getType(type)
    }
    
    
    getType(type){
      let Type  = ''
      if( this.Page_From == 'checkin_page'||this.Page_From == 'followup_status'){
        Type = type
      }else{
        Type = type
      }
      var index = this.networkType.findIndex(row=>row.type == Type)
      if(index!= -1)
      {
        this.followup_data.type_name =  this.networkType[index]['distribution_type'];
        this.followup_data.dr_type_name =  this.networkType[index]['module_name'];
        this.followup_data.dr_type = this.networkType[index]['type']
      }
      this.getDrList(type)
    }
    
    getFollowup(date)
    {
      this.followupDate = date
      this.serve.presentLoading();
      this.serve.addData({'Date':this.followupDate},'AppFollowup/followupDateInfo').then((result)=>
      {
        if(result['statusCode']==200){
          this.followupList=result['result'];        
          if(result['count'].length > 0){
            this.serve.dismissLoading();
            
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
              }
            }
          }else{
            this.getValue = []
            this.serve.dismissLoading();
          }
        }else{
          this.serve.dismissLoading();
        }     
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismissLoading();
      })
      
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
        this.Drtype = this.navParams.get('dr_type');
      }
      
    }
    
    getDrList(type)
    {
      this.filter.start = 0
      this.filter.limit = 15
      this.followup_data.filter = this.filter
      console.log('Type event',type)
      this.followup_data.checkin_id=this.checkin_id;
      if ( this.Page_From == 'checkin_page'|| this.Page_From == 'followup_status') {
        this.drList.push({ id: type.id, company_name: type.company_name })
        this.followup_data.dr_id = this.drList[0]
      } else {
        console.log(this.followup_data.dr_id);
        console.log(this.followup_data.dr_id);
        
        this.drList = [];
        this.serve.addData(this.followup_data ,'AppFollowup/followupCustomer').then((result)=>
        {
          if(result['statusCode']==200){
            
            this.drList=result['result'];
            this.filter.start = this.drList.length
            if(this.navParams.get('dr_name')){
              this.followup_data.dr_id= this.drList.filter(row=>row.company_name == this.navParams.get('dr_name'))
              this.followup_data.dr_id=this.followup_data.dr_id[0].id;
            }
            
          }else{
            this.serve.dismissLoading();
            this.serve.errorToast(result['statusMsg'])
          }
          
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismiss();
        });
      }
      
      
      
    }
    getMorePorts(event: { component: IonicSelectableComponent; text: string }){
      
      this.filter.start=this.drList.length;
      this.followup_data.filter = this.filter
      this.serve.addData(this.followup_data ,'AppFollowup/followupCustomer').then( (r) =>
      {
        
        setTimeout(()=>{
          this.drList=this.drList.concat(r['result']);
          event.component.items = this.drList
          event.component.endInfiniteScroll();
        },1000);
        
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }
    addFollowup() 
    {
      this.spinner = true
      if(this.Page_From != 'checkin_page' && this.Page_From != 'followup_status'){
        this.followup_data.id = this.followup_data.dr_id.id;
        this.followup_data.dr_name = this.followup_data.dr_id.display_name;
      }
      
      this.serve.addData(this.followup_data,'AppFollowup/addFollowup').then((result)=>
      {
        
        if(result['statusCode'] == 200){

      this.spinner = false
          this.serve.successToast(result['statusMsg'])
          this.getFollowup(this.followup_data.followup_date)
          this.followup_data.type = '';
          this.followup_data.dr_type = '';
          this.followup_data.description = '';
          this.followup_data.dr_id = '';
          this.drList = [];
          this.navCtrl.popTo(FollowupListPageModule);
        }
        else{

          this.serve.dismissLoading();
          this.spinner = false
          this.serve.errorToast(result['statusMsg'])

          this.getFollowup(this.followup_data.followup_date)
        }
      },err=>
      {
        this.serve.Error_msg(err);
         this.spinner = false
        this.serve.dismiss();
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
              
              this.serve.addData({'id':id},'Followup/deleteFollowUp').then((result)=>
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
    
    
  }
  