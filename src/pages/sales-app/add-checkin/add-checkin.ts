import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar, Platform, AlertController, Select, Events } from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice'
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { EndCheckinPage } from '../end-checkin/end-checkin';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { AddRetailerPage } from '../../add-retailer/add-retailer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { ConstantProvider } from '../../../providers/constant/constant';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';
@IonicPage()
@Component({
  selector: 'page-add-checkin',
  templateUrl: 'add-checkin.html',
})
export class AddCheckinPage {

  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('selectActivities') selectRef: Select;
  @ViewChild(Navbar) navBar: Navbar;
  userPincode: any
  userPincodeCheck = true;
  showAdd = false;
  savingFlag = false;
  data: any = {};
  distributor_list: any = [];
  distribution_data: any = [];
  Activities: any = [];
  form: any = {};
  addNewDealer: any = false;
  spinnerLoader: boolean = false;
  distributorList: any = [];
  checkin_data: any = [];
  state_list: any = [];
  filter: any = []
  filter_category_active: any = false;
  filter_active: any = false;
  AddCheckinForm: FormGroup;
  load_data: any = "0";
  limit = 0;
  hideList: boolean = true
  AddRetailer: boolean = false
  flag: any = '';
  district_list: any = [];
  customer_type: any = {};
  pagefrom: any;
  newData: any = {};
  city_list: any = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public constant: ConstantProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public service: MyserviceProvider,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public diagnostic: Diagnostic,
    public platform: Platform,
    public events: Events,
    public locationAccuracy: LocationAccuracy,
    public openNativeSettings: OpenNativeSettings,
    public geolocation: Geolocation, public storage: Storage) {

    this.data = {};



    if (this.navParams.get('data')) {
      this.distribution_data = this.navParams.get('data');
      this.data.type = this.distribution_data.type;
      this.data.dr_id = this.distribution_data.id;
      this.data.type_name = { 'company_name': this.distribution_data.company_name };
      this.type_name.company_name = this.distribution_data.company_name;
      this.type_name.name = this.distribution_data.name;
      this.type_name.mobile = this.distribution_data.mobile;
    }
    this.AddCheckinForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])]
    })

  }
  userType: any;
  ionViewDidLoad() {
    this.getNetworkType()
    this.get_states();
    this.get_district();
    this.getCityList();
    // this.get_distributor()
    this.storage.get('user_type').then((userType) => {
      if (userType == 'OFFICE') {
        this.data.type = 3;
        this.get_network_list(this.data.type, '')
        this.userType = userType
      }

    });


  }


  loading: any;
  networkType: any = []
  otherType: any = []

  getNetworkType() {
    this.service.presentLoading()
    this.service.addData({}, "AppCheckin/allNetworkModule").then((result => {
      if (result['statusCode'] == 200) {
        this.networkType = result['modules'];
        this.service.dismissLoading()
      } else {
        this.service.dismissLoading()
        this.service.errorToast(result['statusMsg'])
      }
    }))
  }
  category_list: any = []

  typeboolean: any


  get_distributor() {
    this.service.presentLoading();
    this.service.addData({ checkin_type: "checkin", dr_type: 1, type_name: "Distributor" }, 'AppCheckin/getNetworkList').then((resp) => {
      if (resp['statusCode'] == 200) {
        this.distributor_list = resp['result'];
        this.service.dismissLoading();

      } else {
        this.service.dismissLoading();
        this.service.errorToast(resp['statusMsg']);
      }
    }, err => {
      this.service.dismissLoading();
      this.service.errorToast('Something Went Wrong!')
    })

  }

  test(data) {
    this.data.type = data;
    this.string = undefined
    this.get_network_list(data, '')
    this.typeboolean = false

  }



  distributor_network_list: any = [];
  string: any = {}
  search: any = {}
  object_data: any = {}
  get_network_list(network_type, search) {
    this.data.type_name = {};
    let index = this.networkType.findIndex(row => row.type == network_type);
    console.log(index);
    console.log(network_type);
    if (index != -1) {
      this.newData.distribution_type = this.networkType[index].distribution_type;
      this.newData.module_name = this.networkType[index].module_name;
      this.newData.type = this.networkType[index].type;
    }
    if (network_type != 'Other') {
      let String = ''
      if (!this.string) {
        let String = ''
      } else {
        String = this.string.value
      }
      if (this.newData.type == 3) {
        this.showAdd = true
      } else {
        this.showAdd = false
      }
      this.service.addData({ 'dr_type': Number(this.data.type), 'type_name': this.newData.distribution_type, 'checkin_type': 'checkin', 'filter': this.string }, 'AppCheckin/getNetworkList').then((result) => {
        this.distributor_network_list = result['result'];
        this.object_data.display_name = 'Add New Retailer'
        this.object_data.new_counter = 'TRUE'
        for (let i = 0; i < this.distributor_network_list.length; i++) {
          // this.distributor_network_list[i] =  this.object_data
          if ((this.distributor_network_list[i].display_name == null || this.distributor_network_list[i].display_name == '') && (this.distributor_network_list[i].name != "" || this.distributor_network_list[i].mobile != "")) {
            this.distributor_network_list[i].display_name = this.distributor_network_list[i].display_name;
            this.distributor_network_list[i].display_name = this.distributor_network_list[i].name + '  ' + '(' + this.distributor_network_list[i].mobile + ')'
          }
        }
        this.filter = []
        this.open();
      });
    }
  }
  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  save_retailer() {
    this.savingFlag = true
    if (!this.form.id) {
      if (!this.form.assign_dr_id) {
        this.service.errorToast('Please Select Distributor!')
      }
    }
    this.form.assign_dr_id = this.form.assign_dr_id.id
    this.form.display_name = this.form.company_name + "-" + this.form.name + "-" + this.form.mobile
    this.form.type_id = 3;
    this.service.addData({ "data": this.form }, "AppCheckin/addDealer")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.savingFlag = false
          this.form.dr_id = resp['result']['dr_id']
          this.form.display_name = this.form.company_name + "-" + this.form.name + "-" + this.form.mobile
          this.form.dr_type = 3
          this.form.dr_type_name = "Secondary Dealers"
          this.form.new_counter = "TRUE"
          this.form.type_name = "Dr"
          this.startVisit(this.form)
        } else {
          this.savingFlag = false
          this.service.errorToast(resp['statusMsg']);
        }
      },
        error => {
          this.service.Error_msg(error);
          this.savingFlag = false
        })
  }
  onAddPort(event) {
    this.get_distributor()
    this.AddRetailer = true
    this.selectComponent.close();
  }
  open() {
    this.selectComponent.open();
  }
  load: any = "0";
  type_name: any = {};

  other_name: any = '';
  dr_name: any
  other(name, type_name) {
    console.log(type_name)
    this.hideList = false
    this.type_name = type_name;
    this.load = "1";
    this.dr_name = name
   
  }


  checkExist = false
  error: any



  startVisit(newRetailer) {
    this.spinnerLoader = true;
    this.platform.ready().then(() => {

      var whiteList = [];

      (<any>window).gpsmockchecker.check(whiteList, (result) => {
        if (result.isMock) {
          let alert = this.alertCtrl.create({
            title: 'Alert!',
            subTitle: 'Please Remove Third Party Location Apps',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.service.addData({ 'app_name': result.mocks[0]['name'], 'package_name': result.mocks[0]['package'] }, 'Login/thirdPartyDisabled').then((result) => {
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
                      this.events.publish('data', '1', Date.now());
                      this.service.errorToast("Your account is blocked");
                      this.navCtrl.setRoot(SelectRegistrationTypePage);
                    } else {
                      this.service.errorToast(result['statusMsg'])
                    }
                  },
                    error => {
                      this.service.Error_msg(error);
                    })
                }
              }
            ]
          });
          alert.present();
        }
        else {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {

            let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
            this.geolocation.getCurrentPosition(options).then((resp) => {


              var lat = resp.coords.latitude
              var lng = resp.coords.longitude

              if (this.distribution_data == '') {
                if (newRetailer != 'blank') {
                  this.data.dr_id = newRetailer.dr_id;
                  this.data.dr_name = newRetailer.dr_name;
                  this.data.dr_type_name = newRetailer.dr_type_name;
                  this.data.new_counter = newRetailer.new_counter;
                  this.data.display_name = newRetailer.display_name;
                } else {
                  this.data.dr_id = this.data.type_name.id;
                  this.data.dr_name = this.data.type_name.name;
                  this.data.new_counter = this.data.type_name.new_counter;
                  this.data.display_name = this.data.type_name.display_name;
                  this.data.dr_type_name = this.newData.module_name;
                  this.data.type_name = this.newData.distribution_type;
                }
                this.data.lat = lat;
                this.data.lng = lng;
                this.service.addData({ 'lat': this.data.lat, 'lng': this.data.lng, 'dr_type_name': this.data.dr_type_name, 'type_name': this.data.type_name, 'dr_type': this.data.type, 'activity_type': this.data.activity_type, 'dr_id': this.data.dr_id, 'new_counter': this.data.new_counter, 'display_name': this.data.display_name }, 'AppCheckin/startVisitNew').then((result) => {

                  if (result['statusCode'] == 200) {
                    this.spinnerLoader = false;

                    if (this.navCtrl.getViews().length >= 2) {
                      this.navCtrl.remove(1, 1, { animate: false })
                      this.navCtrl.pop({ animate: false })
                    }
                    this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data });
                    this.service.dismissLoading();
                    this.service.successToast(result['statusMsg']);
                  }
                  else {
                    this.spinnerLoader = false;
                    this.service.dismissLoading();
                    this.service.errorToast(result['statusMsg'])
                  }

                }, error => {
                  this.spinnerLoader = false;
                  this.service.Error_msg(error);
                  this.service.dismissLoading();
                });
              }

            }).catch((error) => {
              this.spinnerLoader = false;
              this.service.dismissLoading();
              this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
            });
          },
            error => {
              this.spinnerLoader = false;
              this.service.dismissLoading();
              this.service.errorToast('Allow Location Permission')
            });
        }



      }, (error) => console.log(error));

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
  form1: any = {};

  getSateteDistrcit() {
    if (this.form.pincode.length == 6) {
      this.form1.pincode = this.form.pincode;
      this.service.addData(this.form1, "AppCustomerNetwork/getStateDistict")
        .then(resp => {
          if (resp['statusCode'] == 200) {
            this.form.state = resp['result'].state_name;
            this.form.district = resp['result'].district_name;
          } else {
            this.service.errorToast(resp['statusMsg']);
          }
        },
          err => {
            this.service.errorToast('Something Went Wrong!')
          });
    }

  }

  get_states() {
    this.service.addData({}, "AppCustomerNetwork/getStates")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.state_list = resp['state_list'];
        } else {
        }
      }, error => {
        this.service.Error_msg(error);
      })
  }

  get_district() {
    this.service.addData({ "state_name": this.form.state }, "AppCustomerNetwork/getDistrict")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.district_list = resp['district_list'];
        } else {
          this.service.errorToast(resp['statusMsg']);
        }
      },
        err => {
          this.service.errorToast('Something Went Wrong!')
        })
  }
  getCityList() {
    this.form.city1 = [];
    this.service.addData({ 'district_name': this.form.district, 'state_name': this.form.state }, 'AppCustomerNetwork/getCity').then((result) => {
      if (result['statusCode'] == 200) {
        this.city_list = result['city'];
      } else {
        this.service.errorToast(result['statusMsg']);

      }


    }, err => {
      this.service.errorToast('Something Went Wrong!')
    });

  }

}
