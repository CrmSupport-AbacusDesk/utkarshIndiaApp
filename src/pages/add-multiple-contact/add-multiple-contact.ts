import { Component } from '@angular/core';
import { IonicPage,AlertController, NavController,LoadingController ,NavParams } from 'ionic-angular';
// import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';



/**
* Generated class for the AddMultipleContactPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-add-multiple-contact',
  templateUrl: 'add-multiple-contact.html',
})
export class AddMultipleContactPage {
  
  form:any={
    mobile:null,
    name:null,
    email:null,
    dob:null,
    doa:null,
    Designation:null
  };
  checkExist=false;
  today_date = new Date().toISOString().slice(0,10);
  sendEmpData:any=[];
  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider,private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    
    console.log(this.navParams);
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddMultipleContactPage');
  }
  
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
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
  
  check_mobile_existence(mobile)
  {   
    // this.form={}
    this.form.mobile=mobile
    
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
          
          this.db.presentToast('Mobile No. Already Exists')
          
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
    
    
    addToList(){
      console.log("SUBMIT METHOD CALL");
      console.log(this.form);
      this.sendEmpData.push(this.form);
      this.form={};
      console.log(this.sendEmpData);
    }
    
    listdelete(i)
    {
      this.sendEmpData.splice(i, 1);
      console.log(this.sendEmpData);
      
    }
    
    saveContactInfo(){
      console.log(this.sendEmpData);
      if(this.navParams.get('checkin_id')  && this.navParams.get('dr_type')){
        console.log("from checkin dr id = " + this.navParams.get('dr_id'));
      }
      else{
        console.log("from lead detail dr id = " + this.navParams.get('dr_id'));
        
        this.db.show_loading()
        this.db.addData({'contact_arr':this.sendEmpData,'dr_id': this.navParams.get('dr_id') },'Distributor/distributors_contact_add').then((result)=>
        {
          this.db.dismiss();
          
        },err=>
        {
          this.db.dismiss();

        })
      }

      this.navCtrl.pop();
    }
    
  }
  