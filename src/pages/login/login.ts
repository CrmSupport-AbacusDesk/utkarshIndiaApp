import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform, Nav } from 'ionic-angular';
import { LoginserviceProvider } from '../../providers/loginservice/loginservice';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { OtpverifyPage } from '../otpverify/otpverify';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { CatalogueHomePage } from '../catalogue-home/catalogue-home';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { RegistrationPage } from '../login-section/registration/registration';
import { AppVersion } from '@ionic-native/app-version';



@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    
    @ViewChild(Nav) nav: Nav;
    
    registerType: any = '';
    validations_form: FormGroup;
    register_type: any = {};
    rootPage: any;
    spinner : boolean = false;
    app_version:any;
    form = { phone: '', otp: 0, registerType: '' };
    
    constructor(public navCtrl: NavController, public appVersion: AppVersion, public navParams: NavParams, public service: LoginserviceProvider, public FormBuilder: FormBuilder, public LoadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public platform: Platform, public db: MyserviceProvider, public loadingCtrl: LoadingController) {
        this.getVersion();
        this.register_type = this.navParams.get('registerType1');
        this.registerType = this.navParams.get('registerType');
        this.spinner = false
        this.validations_form = FormBuilder.group({
            phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        })
        
    }
    
    loading: any = 0;
    loading1: any;
    
    
    MobileNumber(event: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    



    getVersion(){
        this.appVersion.getVersionNumber().then(resp => {
            this.app_version = resp;
        });
    }

   



    login_submit() {
        this.loading = 1
        this.spinner = true
        
        if (this.validations_form.invalid) {
            this.validations_form.get('phone').markAsTouched();
            return;
        }
        
        if (this.form.phone == '5953356262' || this.form.phone == '8800132607' || this.form.phone == '8799730083') {
            this.form.otp = 123456;
        }
        else {
            // this.form.otp = Math.floor(100000 + Math.random() * 900000);
            this.form.otp = 123456;
        }
        
        this.form.registerType = this.registerType;
        this.service.otp_send(this.form).then((response: any) => {
            if (response['statusCode'] == 200) {
                this.db.successToast(response['statusMsg'])
                this.navCtrl.push(OtpverifyPage, { data: this.form, otp_data: response['data'], 'app_version': this.app_version  });
                this.loading = 0
                this.spinner = false
            }
            else {
                if(this.registerType != 'Other'){
                    this.db.errorToast(response['statusMsg'])
                    this.loading = 0
                    this.spinner = false   
                }
                if (this.registerType == 'Other') {
                    if (response['statusCode'] == 404){
                        this.navCtrl.push(RegistrationPage, { data: this.form, otp_data: response['data'], 'app_version': this.app_version });
                    }
                    else{
                        this.db.errorToast(response['statusMsg'])
                    }
                    this.loading = 0
                    this.spinner = false   
                }  
            }
            
        }, err => {
            this.db.dismiss();
            
        });
        
    }
    bck() {
        this.navCtrl.push(SelectRegistrationTypePage);
    }
    showError() {
        let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Please enter correct Mobile!',
            buttons: ['OK']
        });
        alert.present();
    }
    
    
    ionViewDidLoad() {
    }
    
    homePage() {
        this.navCtrl.push(SelectRegistrationTypePage);
    }
    
    register() {
        // this.navCtrl.push(SignupPage,{'registerType':this.register_type});
    }
}
