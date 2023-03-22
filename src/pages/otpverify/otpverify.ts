import { Component, NgZone, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, Loading, Platform, Events, Nav } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { TabsPage } from '../tabs/tabs';
import { DashboardPage } from '../dashboard/dashboard';
declare var SMS: any;
import { MyserviceProvider } from '../../providers/myservice/myservice';
import {Observable} from 'rxjs/Rx';
import { CategoryPage } from '../category/category';
import { DealerHomePage } from '../dealer-home/dealer-home';
import { ConstantProvider } from '../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { LoyaltyHomePage } from '../loyalty/loyalty-home/loyalty-home';
// import { SmsRetriever } from '@awesome-cordova-plugins/sms-retriever';
import { Device } from '@ionic-native/device';



@IonicPage()
@Component({
    selector: 'page-otpverify',
    templateUrl: 'otpverify.html',
})
export class OtpverifyPage 
{
    @ViewChild(Nav) nav: Nav;
    
    loading:any = true;
    otp_values = {one: '', two: '', three: '', four: '', five: '', six: ''};
    otpCredentials = { otp: '', mobile: '', mobile_no: ''};
    cred_detail:any=[];
    temp_arr:any=[];
    otp_value:any=[];
    show_message:boolean=false;
    notification_token:any='';
    disable_resend_button:boolean=false;
    final_time:any;
    interval_1:any;
    interval_2:any;
    last_page:any;
    arr:any;
    keycode:any;
    registration_data:any={};
    login_page:any;
    role:any;
    data_value = {};
    resendActiveClass:boolean = false;
    public data = { mobile: '', otp:''};
    public data2 = { mobile: ''};
    test:any;
    otp:number;
    validations_form: FormGroup;
    appVersion:any ={};
    // otpForm: FormGroup;
    otp_data:any={};
    
    equalto(field_name): ValidatorFn {
        
        return (control: AbstractControl): {[key: string]: any} => {
            
            let input = control.value;
            
            let isValid=control.root.value[field_name]==input
            if(!isValid)
            return { 'equalTo': {isValid} }
            else
            return null;
        };
    }
    
    constructor(public navCtrl: NavController,private device: Device, public constant:ConstantProvider, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public serv: LoginserviceProvider, public formBuilder: FormBuilder, public storage: Storage, public toastCtrl: ToastController,
        public platform: Platform,  public zone: NgZone,public events: Events,public FormBuilder: FormBuilder,public myservice :MyserviceProvider  )
        {
            this.data_value = navParams.get('data');
            this.appVersion = navParams.get('app_version');
            this.data_value['device_unique_id']  = this.device.uuid;
            this.data_value['app_version']  = this.appVersion;
            this.data_value['device_info'] = this.device.model + ',' + this.device.platform + ',' + this.device.version + ',' + this.device.manufacturer;
            this.otp_data = navParams.get('otp_data');
            this.validations_form = FormBuilder.group({
                otp: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
            })
            
            this.time_counter();
            this.resendActiveClass=true;
            setTimeout(()=>{
                this.resendActiveClass=false;
            },30000);
        }
        ionViewWillEnter(){
            this.resendActiveClass = true
            this.maxTime=30;
            this.StartTimer();
        }
        
        ionViewDidLoad() {
            this.platform.ready().then((readySource) =>
            {
                var str= this.otp_value;
                var arr = (""+str).split("");
                this.data_value['appVersion']  = this.appVersion;
                this.data_value['device_unique_id']  = this.device.uuid;
                this.data_value['device_info'] = this.device.model + ',' + this.device.platform + ',' + this.device.version + ',' + this.device.manufacturer;
            })
        }
        
        ionViewWillLeave(){
            clearInterval(this.interval_1);
            clearInterval(this.interval_2);
        }
        
        countDown:any;
        counter = 30*60;
        tick = 1000;
        time_counter()
        {
            this.countDown = Observable.timer(0, this.tick).take(this.counter).map(() => --this.counter)
            this.countDown = Observable.timer(0, this.tick).take(this.counter).map(() => 
            {
                --this.counter;
                if(this.counter == 0)
                {
                    this.data_value['otp'] = Math.floor(100000 + Math.random() * 900000);
                }
            })
        }
        
        maxtime:any=30;
        maxTime:any = 0;
        hidevalue:boolean = false;
        timer:any;
        StartTimer()
        {
            
            if(this.counter == 0)
            {
                this.counter = 30*60;;
                this.time_counter();
            }
            this.timer = setTimeout((x) => 
            {
                if(this.maxtime <= 0) { }
                this.maxTime -= 1;
                
                if(this.maxTime>0){
                    this.hidevalue = true;
                    this.StartTimer();
                }
                else{
                    this.maxtime = 30;
                    this.hidevalue = false;
                }
            }, 1000);
        }        
        
        DeviceID(){
            
            this.myservice.addData({ 'registration_id': this.constant.deviceId }, 'Login/updateNotificationToken')
            .then((r) => {
              
            });
        }
        verify_otp()
        {
            this.loading = true
            if(this.data_value['otp'] == this.data.otp)
            {
                this.serv.login_submit(this.data_value).then((result:any)=>{
                    if(result)
                    this.DeviceID()
                    {
                        this.loading = false
                        if(result.loggedInUserType=='Employee')
                        {
                            
                            
                            setTimeout(() => {
                                this.navCtrl.setRoot(DashboardPage);
                            }, 200);
                            
                            
                        }
                        else  if(result.loggedInUserType=='DrLogin')
                        {
                            this.constant.setData();
                            this.navCtrl.setRoot(DealerHomePage)
                        }
                        else  if(result.loggedInUserType=='Other')
                        {
                            this.constant.setData();
                            this.navCtrl.setRoot(LoyaltyHomePage)
                        }
                    }
                });
            }
            else
            {
                let alert = this.alertCtrl.create({
                    subTitle: 'OTP do not match',
                    buttons: ['Try Again']
                });
                alert.present();
            }
            
        }
        
        my_search(nameKey, myArray)
        {
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].PatientId === nameKey) {
                    return myArray[i];
                }
            }
        }
        
        resendOtp()
        {
            this.maxTime=30;
            this.StartTimer();
            if(this.counter == 0)
            {
                this.counter = 30*60;;
                this.time_counter();
            }
            this.serv.otp_send(this.data_value)
            .then((response:any)=>
            {
                if(response['msg'] == "exist")
                {
                    this.showSuccess("OTP has been send.")
                }
            });
            this.resendActiveClass=true;
            setTimeout(()=>{
                this.resendActiveClass=false;
            },30000);
        }
        
        
        inArray(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) return true;
            }
            return false;
        }
        
        showError(text) {
            
            let alert = this.alertCtrl.create({
                title: 'Error!',
                subTitle: text,
                buttons: ['OK']
            });
            alert.present();
        }
        
        showLoading() {
            this.loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img class="rotate h65" src="assets/imgs/logo-icon.png" />`,
                dismissOnPageChange: true
            });
            this.loading.present();
        }
        
        showSuccess(text) {
            
            let alert = this.alertCtrl.create({
                title: 'Success!',
                subTitle: text,
                buttons: ['OK']
            });
            alert.present();
        }
        
        
        moveFocus(nextElement,previousElement,ev) {
            this.keycode = ev.keyCode;
            if(ev.keyCode != 8 && nextElement)
            {
                nextElement.setFocus();
            }
            if(ev.keyCode == 8 && previousElement)
            {
                previousElement.setFocus();
            }
        }
        
        check_otp()
        {
            this.otpCredentials.otp='';
            for (var key in this.otp_values)
            {
                this.otpCredentials.otp += parseInt(this.otp_values[key]);
            }
            if(this.allTrue(this.otp_values))
            {
                this.verify_otp();
            }
        }
        
        allTrue(obj) {
            for(var o in obj)
            if(!obj[o]) return false;
            
            return true;
        }
        
        numberOnly(event): boolean {
            const charCode = (event.which) ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        }
        bck()
        {
            this.navCtrl.push(SelectRegistrationTypePage);
        }
        
    }
    