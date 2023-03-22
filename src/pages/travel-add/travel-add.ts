import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

import { Storage } from '@ionic/storage';
import { TravelListPage } from '../travel-list/travel-list';
import { DashboardPage } from '../dashboard/dashboard';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-travel-add',
  templateUrl: 'travel-add.html',
})
export class TravelAddPage {
  @ViewChild('district_Selectable') district_Selectable: IonicSelectableComponent;
  filter_state_active:any = false;
    filter_district_active:any = false;
    filter_city_active:any = false;
  travel_data:any={};
  filter_active:any = false;
  filter :any = {};

  today_date = new Date().toISOString().slice(0,10);
  state_list:any=[]
  district_list:any=[];
  channel_partners:any=[];
  travel_list:any=[];
  loading:Loading;
  userType:any;
  area_list:any=[];
  form1:any={};
  city_list:any=[];
  travel_plan_detail_for_update: any = [];
  state:any=[];

  constructor(
               public navCtrl: NavController,
               public storage:Storage, 
               public navParams: NavParams,
               public service: MyserviceProvider, 
               public loadingCtrl: LoadingController , 
               public alertCtrl:AlertController,
               public toastCtrl: ToastController,
               public dbService: DbserviceProvider) 
  {
  }

  ionViewDidLoad() 
  {
    console.log(this.navParams);
    
    console.log('ionViewDidLoad TravelAddPage');
    this.getStateList();
    this.getChannelPartner();

    this.storage.get('user_type').then((userType) => {
      console.log(userType);
      this.userType  = userType
      
    });

    if(this.navParams.get('data'))
    {
      this.travel_data = this.navParams.get('data');
      if(this.travel_data.travel_type == 'Area Visit')
      {
        // this.travel_data.state = this.travel_data.travel_list[0].state;
        // this.getDstrictList();
        // var temp_array=[]
        // console.log(this.travel_data.travel_list);
        for (let i = 0; i < this.travel_data.travel_list.length; i++) 
        {
          this.state.push({"state":this.travel_data.travel_list[i].state});
        }
        this.travel_data.state =this.state;
        console.log( this.travel_data.state);
        this.getDstrictList();
        var temp_array=[]

        for (let i = 0; i < this.travel_data.travel_list.length; i++) 
        {
          temp_array.push({"district_name":this.travel_data.travel_list[i].district});
        }
        this.travel_data.district =temp_array;
        console.log( this.travel_data.district);
       
        if(this.travel_data.district){
          console.log(this.travel_data);
          
          this. getCityList();
        }

         temp_array=[];
        for (let i = 0; i < this.travel_data.travel_list.length; i++) 
        {
          temp_array.push({'city':this.travel_data.travel_list[i].city});
        }
        this.travel_data.city = temp_array;
        console.log(this.travel_data.city);
        
      }
      if(this.travel_data.travel_type == 'Distributor Visit')
      {
        var temp_array=[]
        for (let i = 0; i < this.travel_data.area_dealer_list.length; i++) 
        {
          temp_array.push(this.travel_data.area_dealer_list[i].dr_id) ;
        }
        this.travel_data.distributor = temp_array
      }
    }
  
    console.log(this.travel_data);
  }
  cpVisitExist:any=false
  areaVisitExist:any=false
  
  getTravelPlan(date)
  {
    // this.cpVisitExist=false;
    // this.areaVisitExist=false
    this.service.show_loading();
    this.service.addData({'travel_date':date},'TravelPlan/get_travelPlan').then((result)=>
    {
      console.log(result);
      this.travel_list=result;
      this.service.dismiss();
      // var index = this.travel_list.findIndex(row=>row.travel_type=='Distributor Visit')
      // if(index!= -1)
      // {
      //   this.cpVisitExist=true 
      // }
      // var index2 = this.travel_list.findIndex(row=>row.travel_type!='Distributor Visit')
      // if(index2!= -1)
      // {
      //   this.areaVisitExist=true 
      // }
    },err=>
    {
      this.loading.dismiss()
      
    })
  }
  
  getStateList()
  {
    this.service.addData({},'TravelPlan/state_list').then((result)=>
    {
      console.log(result);
      this.state_list= result;
      
    },err=>
    {
      
    }); 
  }
  
  getDstrictList()
  {

    
    this.service.addData({'state_name':this.travel_data.state},'TravelPlan/district_list').then((result)=>
    {
      console.log(result);
      this.district_list=result;
    },err=>
    {
      
    }); 
  }
city1:any=[]
city2:any=[]
district2:any=[]

  selectarea(){
    this.getChannelPartner();

    console.log(this.travel_data);


    
      this.form1.district=this.travel_data.district;
      this.city1.push(this.travel_data.city);
console.log(this.city1);

      for (let i = 0; i < this.travel_data.city.length; i++) {
        this.city2.push(this.travel_data.city[i].city)
      }
      for (let i = 0; i < this.travel_data.district.length; i++) {
        this.district2.push(this.travel_data.district[i].district_name)
      }
console.log(this.city2);

      this.form1.city=this.city2;
      this.form1.district=this.district2;

    
    this.form1.state=this.travel_data.state;
   console.log(this.form1);

    this.service.addData(this.form1,"TravelPlan/area_list")
    .then(resp=>{
      console.log(resp);
      this.area_list = resp;
      console.log(this.area_list);
      
      // this.district_list = resp['district_list'];
    },
    err=>{
      this.service.errToasr()
    })
  }
  refresh(){
    this.travel_data.state=[];
    this.travel_data.city=[];
    this.travel_data.district=[];

    this.getChannelPartner()
  }
  getChannelPartner()
  {
   console.log(this.travel_data.district);
   

   if(this.travel_data.district){
   
    for (let i = 0; i < this.travel_data.district.length; i++) {
      this.district2.push(this.travel_data.district[i].district_name)
    }
  }
    if(this.travel_data.city){
    for (let i = 0; i < this.travel_data.city.length; i++) {
      this.city2.push(this.travel_data.city[i].city_name)
    }
  }
  console.log(this.district2);
  console.log(this.city2);
  
   
    this.service.addData({'state':this.travel_data.state,'district':this.district2,'city':this.city2},'TravelPlan/distributors_list').then((result)=>
    {
      console.log(result);
      this.channel_partners=result;
   for (let i = 0; i < this.channel_partners.length; i++) {
     if(this.channel_partners[i].type=="3"){
     this.channel_partners[i].type='Retailer'
    this.channel_partners[i].company_name=this.channel_partners[i].company_name+' '+'('+this.channel_partners[i].type+')'
     }
     if(this.channel_partners[i].type=="1"){
      this.channel_partners[i].type='Distributor'
     this.channel_partners[i].company_name=this.channel_partners[i].company_name+' '+'('+this.channel_partners[i].type+')'
      }
   }
    },err=>
    {
      
    });
  }
  district:any=[]
  area:any=[]

  addTravelPlan()
  {
    // var planExist = false
    // if(this.travel_data.travel_type != 'Area Visit')
    // {
    //   var index = this.travel_list.findIndex(row=>row.dr_id==this.travel_data.dr_id)
    //   console.log(index);
    //   if(index!= -1){
    //     planExist=true
    //   }
    // }
    // else
    // {
    //   var index2 = this.travel_list.findIndex(row=> row.state==this.travel_data.state && row.district ==this.travel_data.district)
    //   console.log(index2);
    //   if(index2 != -1){
    //     planExist=true
    //   }
    // }
    // console.log(planExist);
    // if(planExist)
    // {
    //   this.service.presentToast('Travel Plan Already Exists !!')
    //   return
    // }
    
    this.service.show_loading();
    
    // console.log(this.travel_data);
    // if(this.travel_data.travel_type == 'Area Visit')
    // {
    //   this.travel_data.dr_id ='';     
    // }
    // else{
    //   this.travel_data.state ='';
    //   this.travel_data.district ='';
    // }
   console.log(this.travel_data.district)

   console.log(this.travel_data.city)

   console.log(this.travel_data.area)
   console.log(this.travel_data.type);

   if(this.travel_data.travel_type=="Area Visit"){
     
   if(this.travel_data.district.length>0)
   {
        console.log(this.travel_data.district)

        for (let i = 0; i < this.travel_data.district.length; i++) 
        {
            this.district.push(this.travel_data.district[i].district_name)
            console.log(this.district)

        }
        for (let i = 0; i < this.travel_data.area.length; i++) {
          this.area.push(this.travel_data.area[i].area)
        }
        for (let i = 0; i < this.travel_data.city.length; i++) {
          this.city2.push(this.travel_data.city[i].city)
        }
  
   }
  
  }
   console.log(this.district);
   this.travel_data.district=this.district
   this.travel_data.area=this.area
   this.travel_data.city=this.city2

   console.log(this.travel_data.district)
   
if(this.navParams.get('data')){

  // this.travel_data.district = [];
  // this.travel_data.district = (this.travel_data.area);
  
}

    this.service.addData(this.travel_data,'TravelPlan/add_travelPlan').then((result)=>
    {
      this.service.dismiss()
      let toast = this.toastCtrl.create({
        message: 'Travel Plan Saved Successfully!',
        duration: 3000
      });

      let toast1 = this.toastCtrl.create({
        message: 'Travel Plan Updated Successfully!',
        duration: 3000
      });
      console.log(result);
      if(result=='success' && !this.travel_data.id)
      { 
        toast.present();
        // this.getTravelPlan(this.travel_data.travel_date);
        this.travel_data.travel_type = '';
        this.travel_data.dr_id =''; 
        this.travel_data.state ='';
        this.travel_data.district ='';
        // this.navCtrl.push(DashboardPage);
        this.navCtrl.push(TravelListPage);

      }
      if(result=='success' && this.travel_data.id)
      { 
        toast1.present();
        this.navCtrl.pop();
        this.service.dismiss()

        // this.navCtrl.push(DashboardPage);
      }
      if(result=='exist')
      {
        this.service.presentToast('Travel Plan Already Exists !!')
        return;
      }
      
    },err=>
    {
      this.service.dismiss()
      
    });
    
  }
  
  deleteTravelPlan(id,i,flag)
  {
    
    if(flag=='1')
    {
      this.presentAlert('Already Visted')
    }
    else
    {
      let alert = this.alertCtrl.create({
        title: 'Delete Travel Plan',        
        message: 'Do you want to delete travel plan?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              
              this.service.addData({'id':id},'TravelPlan/deleteTravelPlan').then((result)=>
              {
                let toast = this.toastCtrl.create({
                  message: 'Travel Plan Deleted!',
                  duration: 3000
                });
                if(result=='success')
                {
                  toast.present();
                  this.travel_list.splice(i,1);
                  this.getTravelPlan(this.travel_data.travel_date);
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
  
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle:msg ,
      buttons: [          
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }
  
  

  test(){
    console.log(this.travel_data.area);
    
  }
  
  test1(event,from){
    
    
    console.log(from);
    if(from == 'company_name'){
      console.log(this.travel_data);
      console.log(this.travel_data.dr_id);
      console.log(event);
      console.log(event.value);
      this.travel_data.dr_id = event.value;
      
    }
    else if(from == 'district_list'){
      console.log(this.travel_data);
      console.log(this.travel_data.district);
      console.log(event);
      console.log(event.value);
      this.travel_data.district = event.value;
      // this.getCityList();
      
    }
    
    else if(from == 'city_list'){
      console.log(this.travel_data);
      console.log(this.travel_data.city);
      console.log(event);
      console.log(event.value);
      this.travel_data.city = event.value;
      
    }
    
    
  }
  

  getCityList()
  {
    this.getChannelPartner();

    console.log(this.travel_data);
    // this.show_loading()
    
    this.service.addData({'district_name':this.travel_data.district,'state_name':this.travel_data.state},'TravelPlan/city_list').then((result)=>{
      // this.loading.dismiss()
      console.log(result);
      this.city_list=result;
      
      // if(this.navParams.get('from') == 'travel detail page' && this.navParams.get('travel_id') && this.travel_data.travel_type == 'Area Visit'){
      //   for(let tmp_index = 0 ;tmp_index<this.travel_plan_detail_for_update.selected_data.length ; tmp_index++){
      //     var Index = (this.city_list.findIndex(row=>row.city == this.travel_plan_detail_for_update.selected_data[tmp_index].city));
      //     console.log(Index);
      //     if(Index != -1){
      //       this.travel_data.city.push(this.city_list[Index]);
      //     }
        
      //   }
      //   console.log(this.travel_data);
      // }
      
    // },err=>
    // {
    //   this.loading.dismiss()
      
    });
  }
  update_travel_plan(){
    console.log("update_travel_plan method calls");
    
    var planExist = false
    console.log(this.travel_data);
    
    if(this.travel_list.length && this.travel_list[0].id != this.travel_data.id){
      planExist=true
    }
    
    console.log(planExist);
    
    if(planExist)
    {
      this.dbService.presentToast('Travel Plan Already Exists !!')
      return
    }
    this.travel_data.id = this.travel_data.id
    
    this.service.show_loading()
    this.service.addData(this.travel_data,'TravelPlan/update_travelPlan').then((result)=>{
      
      this.service.loading.dismiss()
      
      let toast = this.toastCtrl.create({
        message: 'Travel Plan Update Successfully!',
        duration: 3000
      });
      console.log(result);
      if(result=='success')
      {
        toast.present();
        this.navCtrl.pop();
        
      }
      
    },err=>
    {
      this.service.dismiss()
      
    });
    
  }
}
