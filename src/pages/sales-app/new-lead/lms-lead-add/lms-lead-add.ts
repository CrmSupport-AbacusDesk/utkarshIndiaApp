import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-lms-lead-add',
  templateUrl: 'lms-lead-add.html',
})
export class LmsLeadAddPage {

  today_date = new Date().toISOString().slice(0,10);


  
  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera,public db:MyserviceProvider,private alertCtrl: AlertController,public loadingCtrl: LoadingController) {
    this.getNetworkType()
this.source()

  }
  
  form:any={};
  form1:any={};
  isAddContact:any;
  area_list:any=[];
  image: any = '';
  image_data: any = [];


  checkExist=false
  user_data:any={};
  
  submit()
  {
    console.log(this.form);
    if(this.checkExist==true)
    {
      this.db.presentToast('Mobile No. Already Exists !!');
      return
    }
    if(this.form.mobile.length!=10)
    {
      return
    }
    
    // type_id = type_id;
    this.db.show_loading()
    this.db.addData({"data":this.form,"loginData":this.user_data,'visiting_card_image':this.image_data },"Lead/save_lead")
    .then(resp=>{
      
      console.log(resp);
      this.db.dismiss()
      
      if(resp['msg'] == 'success')
      {
        this.db.presentToast("Success!");
        this.navCtrl.pop();
      }
    },
    err=>{
      this.db.dismiss()
    });
  }
  
  ionViewDidLoad() {
    this.get_states();
    console.log('ionViewDidLoad LmsLeadAddPage');
    if(this.navParams.get('data'))
    {
      this.form = this.navParams.get('data');
      this.form.type_id = this.form.type
      console.log(this.form);
      this.form.dob=this.form.date_of_birth
      this.form.doa=this.form.date_of_anniversary
console.log(this.form.doa);

      // this.travel_data=this.travel_data['travel']
      this.get_district();
      // this.form.district=[];
    //  this.lead_data.push(this.form.district)
    //  console.log(this.lead_data);

    }
  }
  
  state_list:any=[];
  get_states()
  {
    this.db.addData({},"dealerData/getStates")
    .then(resp=>{
      console.log(resp);
      this.state_list = resp['state_list'];
    },
    err=>{
      this.db.errToasr()
    })
  }
  networkType:any=[]
  getNetworkType(){
      this.db.addData('', "lead/leadNetworkModule").then((result => {
        console.log(result);
        this.networkType = result['modules'];
      }))
    }
  district_list:any=[];
  get_district()
  {
    this.db.addData({"state_name":this.form.state},"dealerData/getDistrict")
    .then(resp=>{
      console.log(resp);
      this.district_list = resp['district_list'];
    },
    err=>{
      this.db.errToasr()
    })
  }
  
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
  
  checkDealerExist()
  {
    console.log(this.form.mobile.length);
    
    if(this.form.mobile.length == 10)
    {
      console.log(this.form.mobile.length);
      
      console.log(this.form.mobile);
      // this.check_mobile_existence2(this.form.mobile)
    }
  }
  
  check_num()
  {
    this.checkExist=false
    console.log(this.form.mobile.length);
    
    if(this.form.mobile && this.form.mobile.length == 10)
    {
      console.log(this.form.mobile.length);
      
      console.log(this.form.mobile);
      this.check_mobile_existence(this.form.mobile)
    }
  }
  city_list:any=[]
  getCityList()
  {
    this.form.city1 = [];
    console.log(this.form);
    // this.show_loading()
    
    this.db.addData({'district_name':this.form.district,'state_name':this.form.state},'dealerData/getCity').then((result)=>{
      // this.loading.dismiss()
      console.log(result);
      this.city_list=result['city'];
      
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
  source_list:any=[]
  source(){
    this.db.addData3({},'Lead/lead_source_list').then((result)=>{
      console.log(result);
      
     this.source_list=result['lead_source_list']
     
      // this.db.dismiss();
      
    },err=>
    {
      this.db.dismiss()
      
      // this.db.presentToast('Failed To Get ')
    }) 
  }
  check_mobile_existence(mobile)
  {   
    // this.form={}
    this.db.show_loading()
    this.db.addData({'mobile':mobile},'Enquiry/check_mobile_existenceLead').then((result)=>
    {
      this.db.dismiss()
      
      if(result['executive']!=0)
      {
        let alert=this.alertCtrl.create({
          title:'Exists !!',
          subTitle: 'Mobile No Is Already Registered With An Executive !!',
          cssClass:'action-close',
          
          buttons: [
            {
              text:'Okay',
              cssClass: 'close-action-sheet',
              handler:()=>
              {
              }
            }]
          });
          alert.present();
          this.form.mobile='';
          return;
        }
        if(result['check_mobile']==1)
        {
          this.checkExist=true
          
          this.db.presentToast('Dealer With Same Mobile No. Already Exists')
          
        }
        else
        {
          this.form.DealerExist=false;
          
          this.checkExist=false
        }
        
      },err=>
      {
        this.db.dismiss()
        
      })
    }

    selectarea(){
      console.log(this.form);
      
      this.form1.state=this.form.state;
      this.form1.district=this.form.district;
      this.form1.city=this.form.city1;

      console.log(this.form1);
      

      // this.db.addData3(this.form1,"User/city_user_list")
      this.db.addData(this.form1,"dealerData/getArea")
      .then(resp=>{
        console.log(resp);
        this.area_list = resp['area'];
        console.log(this.area_list);
        this.form.area='';
        // this.district_list = resp['district_list'];
      },
      err=>{
        this.db.errToasr()
      })
    }
    
    selectAddressOnBehalfOfPincode()
    {{
      // this.db.show_loading()
        this.db.addData({'pincode':this.form.pincode},'Enquiry/selectAddressOnBehalfOfPincode').then((result)=>{
          console.log(result);
          
         
          this.form.state = result['state_name']
          this.get_district()
          this.form.district = result['district_name']
          this.form.city = result['city']
          this.form.area = result['area']
          this.selectarea();
          // this.db.dismiss();
          
        },err=>
        {
          this.db.dismiss()
          
          // this.db.presentToast('Failed To Get ')
        })
      }
    }



    // addMultipleContact(data){
    //   console.log(this.form.isAddContact);
    //   console.log(data);
    // }


    takePhoto() {
      console.log("i am in camera function");
      const options: CameraOptions =
      {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 500,
        targetHeight: 400,
        cameraDirection:1,
        correctOrientation : true,
      }
      
      console.log(options);
      this.camera.getPicture(options).then((imageData) => {
        this.image = 'data:image/jpeg;base64,' + imageData;
        console.log(this.image);
        if (this.image) {
          this.fileChange(this.image);
        }
      },
      (err) => {
      });
    }


    fileChange(img) {
      // this.image_data=[];
      this.image_data.push(img);
      console.log(this.image_data);
      this.image = '';
    }

    remove_image(i: any) {
      this.image_data.splice(i, 1);
    }
    update()
    {
      console.log(this.form);
      if(this.checkExist==true)
      {
        this.db.presentToast('Mobile No. Already Exists !!');
        return
      }
      if(this.form.mobile.length!=10)
      {
        return
      }
      this.db.show_loading()
      console.log(this.form.district);
      // Distributor/save_lead
      // 
      this.db.addData({"id":this.form.id,"data":this.form},"Lead/update_lead")
      .then(resp=>{
        console.log(resp);
        this.db.dismiss()
        
        if(resp == 'Success')
        {
          this.db.presentToast("Success!");
          this.navCtrl.pop();
        }
      },
      err=>{
        this.db.dismiss()
      });
    }

  }