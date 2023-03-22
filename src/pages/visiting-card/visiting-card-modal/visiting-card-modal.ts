import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController, ViewController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';



@IonicPage()
@Component({
  selector: 'page-visiting-card-modal',
  templateUrl: 'visiting-card-modal.html',
})
export class VisitingCardModalPage {

  otp_chk:any=0;
  input_otp:any;
  otp_sent_to:any;
  dataToSend:any;
  form:any={};
  prv_otp:any;

  constructor(public navCtrl: NavController, public alertCtrl : AlertController, public navParams: NavParams, public viewCtrl: ViewController,public toastCtrl:ToastController,public service:DbserviceProvider) {
    // console.log(navParams.data.data.result);
    console.log(navParams.data.data);
    
    this.otp_sent_to = navParams.data.data.mobile;
    console.log(this.otp_sent_to);
    
    this.dataToSend = {
      id:navParams.data.data.id,
      status:'received',
    };
    console.log(navParams.data.data.id);
    
    this.OTPGenerate();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitingCardModalPage');
  }

  dismiss() 
  {
    this.viewCtrl.dismiss();
  }
  OTPGenerate(){

    var digits = '0123456789';
    let OTP = '';
    for(let i=0 ; i<4; i++){
      OTP+= digits[Math.floor(Math.random()*10)]
    }
  
    console.log(OTP);
    this.otp_chk = OTP;

        this.form.phone = parseInt(this.otp_sent_to);
        // this.form.otp = parseInt(this.otp_chk);
      this.form.otp = 123456;
        
        this.service.post_rqst(this.form,'distributor/send_common_otp')
        .subscribe((r)=>
        {
            console.log(r);

            if(r['status'] == "SUCCESS")
            {
                this.showSuccess("OTP has been send.")
                // this.prv_otp=r['otp'];
            }
        }
        ,err=>
        {
          
            this.showSuccess("Error..!!!")
            
        }
        );
        // this.resendActiveClass=true;
        // setTimeout(()=>{
        //     this.resendActiveClass=false;
        // },30000);
    // this.submitOTP();
  }

  submitOTP(){
    //alert(this.input_otp);
    if(this.input_otp==this.otp_chk)
    {
      
   this.service.post_request(this.dataToSend, 'distributors/change_status').subscribe((response)=>
   {
     console.log(response);
    
   },er=>
   {
     
   });
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'OTP Not Match',
        duration: 3000
    });
    toast.present();
    }

    // this.navCtrl.push(VisitingCardListPage);
    this.navCtrl.pop();

  }


  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }



}
