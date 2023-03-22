import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../../providers/constant/constant';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';


@IonicPage()
@Component({
  selector: 'page-announcement-list',
  templateUrl: 'announcement-list.html',
})
export class AnnouncementListPage 
{
  user_data:any={};
  userType:any;
  sendRequest:any=false
  announcementList:any=[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public constant:ConstantProvider,
    public viewcontrol: ViewController,
    
    public serve:MyserviceProvider) 
    {
      if(this.constant.UserLoggedInData.loggedInUserType == 'Employee')
      {
        this.userType='Employee'
      }
      else
      {
        this.userType='drLogin'
      }
      
      this.getAnnouncementList()
    }
    
    ionViewDidLoad() 
    {
    }
    ionViewDidEnter() 
    {
     
    }
    
    deatilPage(id,to_id)
    {
      this.navCtrl.push(AnnouncementDetailPage,{'id':id,'to_id':to_id});
    }
    
    getAnnouncementList()
    {
      this.sendRequest=false;
      this.filter.limit=15;
      this.filter.start=0;
      this.serve.presentLoading();
      this.serve.addData({'userType':this.userType, 'filter' : this.filter},"AppAnnouncement/announcementList").then(resp=>
        {
      if(resp['statusCode']==200){
        this.sendRequest=true;
        this.serve.dismissLoading();
        this.announcementList = resp['result'];
        }else{
          this.serve.dismissLoading();
          this.serve.errorToast(resp['statusMsg'])
        }
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismiss();
        })
      }
      
      doRefresh (refresher)
      {   
        this.getAnnouncementList() 
        setTimeout(() => {
          refresher.complete();
        }, 1000);
      }
      
      close() {
        
        this.viewcontrol.dismiss();
      }
      
      
      flag:any='';
      filter:any={};
      
      loadData(infiniteScroll)
      {
        this.filter.start=this.announcementList.length;
        
        this.serve.addData({'filter' : this.filter, 'userType':this.userType},'AppAnnouncement/announcementList').then( (r) =>
        {
          if(r['result']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.announcementList=this.announcementList.concat(r['result']);
              infiniteScroll.complete();
            },1000);
          }
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismiss();
        });
      }
      
    }
    