import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController, Nav  } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import moment from 'moment';
import { IonicSelectableComponent } from 'ionic-selectable';
import { ConstantProvider } from '../../../providers/constant/constant';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoyaltyHomePage } from '../../loyalty/loyalty-home/loyalty-home';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { SiteListPage } from '../site-list/site-list';


@IonicPage()
@Component({
  selector: 'page-site-add',
  templateUrl: 'site-add.html',
})
export class SiteAddPage
{
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild(Nav) nav: Nav;
  data:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  profile_data:any='';
  today_date:any;
  flag:boolean=true;  
  Influencer:any =[];
  contractor:any =[];
  
  
  uploadurl:any
  cam:any="";
  gal:any="";
  cancl:any="";
  ok:any="";
  upl_file:any="";
  save_succ:any="";
  doc:any =[];
  userData:any = {}
  savingFlag:boolean = false;
  lastPageData:any;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public service:DbserviceProvider,
    public myservice:MyserviceProvider,
    public constant:ConstantProvider,
    public alertCtrl:AlertController ,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    ) 
    {
      this.lastPageData = this.navParams.data;
      this.getArchitect();
      this.getContrator();
      this.getstatelist(); 
      this.userData = this.constant.UserLoggedInData.all_data
      this.today_date = new Date().toISOString().slice(0,10);  
    }
    
    ionViewDidLoad() 
    {
    }
    
    namecheck(event: any) 
    {
      const pattern = /[A-Z\+\-\a-z ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) 
      {event.preventDefault(); }
    }
    
    MobileNumber(event: any) 
    {
      const pattern = /[0-9]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) 
      {
        event.preventDefault();
      }
    }
    
    
    getArchitect()
    {
      this.myservice.addData({},'AppInfluencerSignup/getArchitect').then( result =>
        {
          if (result['statusCode'] == 200){
            this.Influencer = result['result'];
            for(let i = 0 ;i <this.Influencer.length ; i++){
              this.Influencer[i].display_name =  this.Influencer[i].name +' '+'('+ this.Influencer[i].mobile_no+')'
            }
          }
          else{
            this.myservice.errorToast(result['statusMsg'])
          }
        }
        )
      }
      
      getContrator()
      {
        
        this.myservice.addData({},'AppInfluencerSignup/getContrator').then( result =>
          {
            if (result['statusCode'] == 200){
              this.contractor = result['result'];
              for(let i = 0 ;i <this.contractor.length ; i++){
                this.contractor[i].display_name =  this.contractor[i].name +' '+'('+ this.contractor[i].mobile_no+')'
              }
            }
            else{
              this.myservice.errorToast(result['statusMsg'])
            }
          }
          )
        }
        
        
        checkRight:any
        getRights(type){
          let index = this.Influencer.findIndex(row => row.type == type)
          if (index != -1) {
            this.data.scanning_rights = this.Influencer[index].scanning_rights;
            this.data.point_transfer_right = this.Influencer[index].point_transfer_right;
            this.data.influencer_type = this.Influencer[index].module_name;
          }
        }
        
        getstatelist()
        {
          this.myservice.addData({},'AppInfluencerSignup/getStates').then( result =>
            {
              if (result['statusCode'] == 200){
                this.state_list=result['all_state'];
              }
              else{
                this.myservice.errorToast(result['statusMsg'])
              }
            });
          }
          
          getDistrictList(state_name)
          {
            this.service.post_rqst({'state_name':state_name},'AppInfluencerSignup/getDistrict').subscribe( result =>
              {
                if (result['statusCode'] == 200){
                  this.district_list=result['all_district'];
                }
                else{
                  this.myservice.errorToast(result['statusMsg'])
                }
              });
            }
            
            
            
            
            
            
            
            submit()
            {
              this.savingFlag = true;
              this.data.state = this.data.state.state_name;
              this.data.district = this.data.district.district_name;
              this.data.module_name = this.lastPageData.moduleName;
              this.data.type = this.lastPageData.type;
              this.myservice.addData( {'data': this.data },'AppInfluencer/allAddInfluencer').then( result =>
                {
                  if(result['statusCode'] == 200)
                  {
                    this.myservice.successToast(result['statusMsg']);
                    this.savingFlag = false;
                    this.navCtrl.popTo(SiteListPage);
                  }
                  else{
                    this.myservice.errorToast(result['statusMsg'])
                    this.savingFlag = false;
                  }
                }, error => {
                  this.savingFlag=false;
                  this.myservice.Error_msg(error);
                  this.myservice.dismiss();
                });
                
              }
            }
            