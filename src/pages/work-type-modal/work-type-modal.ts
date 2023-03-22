import { Component } from '@angular/core';
import {
  IonicPage, NavController, NavParams, ToastController, ViewController, ActionSheetController,
  LoadingController, Events, AlertController, Platform
} from 'ionic-angular';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';

@IonicPage()
@Component({
  selector: 'page-work-type-modal',
  templateUrl: 'work-type-modal.html',
})
export class WorkTypeModalPage {
  working_type: any = []
  input_type: any = false;
  spinner: any = false;
  user_id: any
  id: any
  image: any = '';
  image_data: any = [];
  data: any = {};
  type: string = '';
  strtReadin: any = 0;
  workType: any = '';
  leave_data_count: any = {}
  leave_data: any = []
  loading: any = ''
  
  
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public serv: AttendenceserviceProvider,
    public viewcontrol: ViewController,
    public loadingCtrl: LoadingController,
    public actionSheetController: ActionSheetController,
    public locationAccuracy: LocationAccuracy,
    public serve: MyserviceProvider,
    public geolocation: Geolocation,
    private camera: Camera,
    public constant : ConstantProvider,
    private storage: Storage,
    public track: GeolocationserviceProvider,
    public openNativeSettings: OpenNativeSettings,
    public alertCtrl: AlertController,
    public events: Events,
    public platform: Platform) {
      this.type = this.navParams.get('type');
      this.id = this.navParams.get('id');
      this.image = this.navParams.get('image');
      this.image_data = this.navParams.get('image_data');
      
      if (this.type == 'start') {
        this.storage.get('userId').then((id) => {
          if (typeof (id) !== 'undefined' && id) {
            this.user_id = id;
          }
        });
      }
      this.data.working_type = 'Working';
      
    }
    
    
    close() {
      
      this.viewcontrol.dismiss();
    }
    presentLoading() {
      this.loading = this.loadingCtrl.create({
        spinner: 'dots',
      });
      
      this.loading.present();
    }
    
    
    startAttend() {
      this.spinner = true
      if (this.image_data != '') {
        this.platform.ready().then(() => {
          
          var whiteList = ['com.package.example', 'com.package.example2'];
          (<any>window).gpsmockchecker.check(whiteList, (result) => {
            
            if (result.isMock) {
              
              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'Please Remove Third Party Location Apps',
                buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.serve.addData({'app_name':result.mocks[0]['name'], 'package_name':result.mocks[0]['package']}, 'Login/thirdPartyDisabled').then((result) => {
                        if (result['statusCode'] == 200) {
                          this.storage.set('token', '');
                          this.storage.set('role', '');
                          this.storage.set('displayName', '');
                          this.storage.set('role_id', '');
                          this.storage.set('name', '');
                          this.storage.set('type', '');
                          this.storage.set('token_value', '');
                          this.storage.set('userId', '');
                          this.storage.set('token_info', '');
                          this.constant.UserLoggedInData = {};
                          this.constant.UserLoggedInData.userLoggedInChk = false;
                          this.events.publish('data','1', Date.now());
                          this.serve.errorToast("Your account is blocked");
                          this.navCtrl.setRoot(SelectRegistrationTypePage);
                          
                        } else {
                          this.serve.errorToast(result['statusMsg'])
                        }
                      },
                      error => {
                        this.serve.Error_msg(error);
                      })
                    }
                  }
                ]
              });
              alert.present();
            }
            else{
              this.serve.presentLoading();
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  
                  let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    
                    var lat = resp.coords.latitude
                    var lng = resp.coords.longitude
                    this.serve.addData({ 'lat': lat, 'lng': lng, 'image': this.image_data, 'working_type': this.data.working_type }, 'AppAttendence/startAttendence').then((result) => {
                      if (result['statusCode'] == 200) {
                        this.events.publish('user:login');
                        this.viewcontrol.dismiss();
                        this.serve.dismissLoading();
                        this.serve.successToast(result['statusMsg'])
                        this.image_data = []
                        this.spinner = false;
                      } else {
                        this.spinner = false;
                        this.viewcontrol.dismiss();
                        this.serve.dismissLoading()
                        this.image_data = []
                        this.serve.errorToast(result['statusMsg'])
                      }
                    },
                    error => {
                      this.serve.Error_msg(error);
                      this.spinner = false;
                      this.serve.dismissLoading()
                    })
                    
                  }).catch((error) => {
                    this.serve.dismissLoading();
                    this.spinner = false;
                    this.presentConfirm('Turn On Location permisssion !', 'please go to Settings -> Location to turn on <strong>Location permission</strong>')
                  });
                },
                error => {
                  this.serve.dismissLoading();
                  this.spinner = false;
                  this.serve.errorToast('Please Allow Location!!')
                })};
              }, (error) => console.log(error));
            })
          } else {
            this.spinner = false;
            this.serve.dismissLoading();
            this.serve.errorToast('Please Upload Image')
          }
        }
        
        takePhoto() {
          const options: CameraOptions =
          {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth: 500,
            targetHeight: 400,
            cameraDirection: 1,
            correctOrientation: true,
          }
          
          this.camera.getPicture(options).then((imageData) => {
            this.image = 'data:image/jpeg;base64,' + imageData;
            if (this.image) {
              this.image_data.push(this.image);
            }
          },
          (err) => {
            if (err == 20) {
              this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
            } console.log('Error of camera', err)
          });
        }
        presentConfirm(title, msg) {
          let alert = this.alertCtrl.create({
            enableBackdropDismiss: false,
            title: title,
            message: msg,
            cssClass: 'alert-modal',
            buttons: [
              
              {
                text: 'Cancel',
                handler: () => {
                }
              },
              {
                text: 'Settings',
                handler: () => {
                  this.openSettings()
                }
              }
            ]
          });
          alert.present();
        }
        openSettings() {
          this.openNativeSettings.open("application_details")
        }
        
        remove_image(i: any) {
          this.image_data.splice(i, 1)
        }
        
      }
      