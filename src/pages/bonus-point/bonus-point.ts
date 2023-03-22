import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';

@Component({
  selector: 'page-bonus-point',
  templateUrl: 'bonus-point.html',
})
export class BonusPointPage
{
  user_data:any={};
  userType:any;
  sendRequest:any=false
  bonuspointList:any=[];
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: Storage,
    public constant:ConstantProvider,
    public viewcontrol: ViewController,
    
    public db:MyserviceProvider) 
    {
      console.log(this.constant.UserLoggedInData)
      if(this.constant.UserLoggedInData.loggedInUserType == 'Employee')
      {
        this.userType='Employee'
      }
      else
      {
        this.userType='drLogin'
      }
      console.log(this.userType);
      this.user_data = this.constant.UserLoggedInData.all_data
      setTimeout(() => 
      {
        this.getBonuspointList()
        
      }, 500);
    }
    
    ionViewDidLoad() 
    {
      console.log('ionViewDidLoad AnnouncementListPage');
    }
    
    
    getBonuspointList()
    {
      this.db.show_loading();
      this.sendRequest=false
      
      this.db.addData({'userType':this.userType,'state':this.user_data.state,'district':this.user_data.district},"Influencer/eligibleBonusList").then(resp=>
        {
          console.log(resp);
          if(resp['status']=="success"){
            this.bonuspointList = resp[''];
          this.sendRequest=true
          this.db.dismiss()
          }else{

            this.db.dismiss()
          }
        },err=>
        {
          this.db.dismiss()
          this.db.errToasr()
        })
      }
      
      doRefresh (refresher)
      {   
        this.getBonuspointList() 
        setTimeout(() => {
          refresher.complete();
        }, 1000);
      }
      
   
      
    }
    