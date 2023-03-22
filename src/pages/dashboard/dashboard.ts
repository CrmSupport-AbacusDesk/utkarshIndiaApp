import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events, Platform, MenuController, ModalCmp, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import moment from 'moment';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { GeolocationserviceProvider } from '../../providers/geolocationservice/geolocationservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { Network } from '@ionic-native/network';
import { ExpenseListPage } from '../expense-list/expense-list';
import { LmsLeadListPage } from '../sales-app/new-lead/lms-lead-list/lms-lead-list';
import { ContractorMeetListPage } from '../Contractor-Meet/contractor-meet-list/contractor-meet-list';
import { FollowupListPage } from '../followup-list/followup-list'
import { AnnouncementListPage } from '../announcement/announcement-list/announcement-list';
import { EndCheckinPage } from '../sales-app/end-checkin/end-checkin';
import { CheckinNewPage } from '../checkin-new/checkin-new';
import { LeaveListPage } from '../leave-list/leave-list';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';
import { RetailerListPage } from '../retailer-list/retailer-list';
import { FollowupAddPage } from '../followup-add/followup-add';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { PrimaryOrderMainPage } from '../primary-order-main/primary-order-main';
import { SecondaryOrderMainPage } from '../secondary-order-main/secondary-order-main';
import { AttendenceNewPage } from '../attendence-new/attendence-new'
import { TargetPage } from '../target/target';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DashboardNewPage } from '../dashboard-new/dashboard-new';
import { ProfilePage } from '../profile/profile';
import { SurveyListPage } from '../survey/survey-list/survey-list';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { TaskListPage } from '../task-list/task-list';
import { SiteListPage } from '../loyalty/site-list/site-list';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ScanningPage } from '../scanning/scanning';
import { ProductsPage } from '../products/products';
import { LoyaltyCataloguePage } from '../loyalty-catalogue/loyalty-catalogue';
import { NotificationPage } from '../notification/notification';
import { AnnouncementNoticesListPage } from '../announcement-notices-list/announcement-notices-list';
import { HolidayListPage } from '../holiday-list/holiday-list';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';


@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {
    attend_id: any = '';
    currentTime: any = '';
    checkinMode: any = {};
    attendanceMode: any = '';
    user_id: any = '';
    doughnutChart: any;
    qr_code: any;
    checkinChart: any;
    followupChart: any;
    skLoading: boolean = true
    spinner: boolean = false
    attendence_data: any = [];
    appbanner: any = [];
    announcementCount: any;
    enquiry_count: number;
    checkin_data: any = [];
    timer;
    checkin_out: any = ''
    today_date = new Date().toISOString().slice(0, 10);
    checkedToggle: any = '';
    subscription: any;
    vehicle: any = '';
    last_attendence_data: any = {};
    today_count: any = {};
    user_data: any = {};
    today_checkin: any = [];
    total_dealer: any = [];
    total_distributor: any = [];
    total_direct_dealer: any = [];
    user_logged_in: boolean;
    start_attend_time: any;
    stop_attend_time: any;
    total_primary_order: any = [];
    total_secondary_order: any = [];
    primary_order_sum: number;
    secondary_order_sum: number;
    targetVsAchievement: any = {};
    dr_credit_details: any = {};
    today_followup: any = [];
    image: any = '';
    image_data: any = [];
    bannerURL: any = '';
    influencerUser: any = [];

    constructor(private network: Network,
        public navCtrl: NavController,
        public diagnostic: Diagnostic,
        public loadingCtrl: LoadingController,
        private androidPermissions: AndroidPermissions,
        public geolocation: Geolocation
        , private storage: Storage
        , public attendence_serv: AttendenceserviceProvider
        , public toastCtrl: ToastController
        , public alertCtrl: AlertController
        , public events: Events
        , public locationAccuracy: LocationAccuracy
        , public platform: Platform
        , public push: Push
        , public service: MyserviceProvider
        , public track: GeolocationserviceProvider
        , public menu: MenuController
        , public constant: ConstantProvider
        , public modal: ModalController
        , private camera: Camera
        , public modalCtrl: ModalController
        , public openNativeSettings: OpenNativeSettings
        , private barcodeScanner: BarcodeScanner) {
        // this.getNetworkType()


    }


    ionViewWillEnter() {

        this.pending_checkin();
        this.last_attendence();
        this.events.publish('current_page', 'Dashboard');
        this.storage.get('token').then((token) => {
            if (typeof (token) !== 'undefined' && token) {
                this.user_logged_in = true;

            }
        });
        this.storage.get('userId').then((id) => {
            if (typeof (id) !== 'undefined' && id) {
                this.user_id = id;

            }
        });

        this.platform.ready().then(() => {
            this.network.onConnect().subscribe(() => {
                this.constant.connectionChk = 'online;'
            });
            this.network.onDisconnect().subscribe(() => {
                this.constant.connectionChk = 'offline';
            });

        })

    }
    leave: any = []


    ionViewDidLeave() {
        this.events.publish('current_page', '');
    }

    getInfluencer() {
        this.service.addData({}, 'AppInfluencer/influencerList').then(result => {
            if (result['statusCode'] == 200) {
                this.influencerUser = result['result'];
            }
            else {
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        });
    }

    takePhoto(type) {
        this.platform.ready().then(() => {
            var whiteList = [''];
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
                    this.spinner = true
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then((res) => {
                        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
                            let options = { maximumAge: 3000, timeout: 15000, enableHighAccuracy: false };
                            this.geolocation.getCurrentPosition(options).then((resp) => {

                                var lat = resp.coords.latitude
                                var lng = resp.coords.longitude
                                this.spinner = false;

                                this.diagnostic.requestCameraAuthorization().then((isAvailable: any) => {

                                    const options: CameraOptions =
                                    {
                                        quality: 70,
                                        destinationType: this.camera.DestinationType.DATA_URL,
                                        sourceType: this.camera.PictureSourceType.CAMERA,
                                        encodingType: this.camera.EncodingType.PNG,
                                        mediaType: this.camera.MediaType.PICTURE,
                                        cameraDirection: this.camera.Direction.FRONT,
                                        targetWidth: 400,
                                        targetHeight: 400,
                                        correctOrientation: true,
                                    }
                                    this.camera.getPicture(options).then((imageData) => {
                                        this.image = 'data:image/jpeg;base64,' + imageData;
                                        if (this.image) {
                                            this.fileChange(this.image);
                                            this.openModal(type)
                                        }
                                    },
                                        (err) => {

                                            this.spinner = false
                                            if (err == 20) {
                                                this.presentConfirm('Turn On Camera & Media permisssion !', 'Go to <strong>Settings</strong> -> to turn on <strong>Camera permission</strong> & <stong>Files and  media</strong>')
                                            }
                                        });
                                })
                                    .catch((error: any) => {
                                    });


                            }).catch((error) => {
                                this.spinner = false
                                this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                            });
                        })
                            .catch((error) => {
                                this.spinner = false
                                this.presentConfirm('Turn On Location permisssion !', 'please go to <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
                            })




                    },
                        error => {
                            this.spinner = false

                            this.service.errorToast('Please Allow Location!!')
                        });
                }

            });
        })
    }

    fileChange(img) {
        this.image_data.push(img);
        this.image = '';
    }
    openModal(type) {
        let workTypeModal = this.modal.create(WorkTypeModalPage, { 'type': type, 'id': this.last_attendence_data.attend_id, 'image': this.image, 'image_data': this.image_data });

        workTypeModal.onDidDismiss(data => {
            this.image_data = []
            this.events.publish('user:login');
            this.last_attendence();
        });

        workTypeModal.present();

        //   });

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
    pending_checkin() {
        this.service.addData({}, 'AppCheckin/pendingCheckin').then((result) => {
            if (result['statusCode'] == 200) {
                this.checkin_data = result['checkin_data'];
            } else {
                this.service.errorToast(result['statusMsg'])
            }
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }
    bannerDetail() {
        this.service.addData({}, 'Influencer/banner_list').then((r) => {
            this.service.dismiss();
            this.appbanner = r['banner_list']
        });
    }


    stop_attend() {
        this.service.presentLoading()
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
            let options = { maximumAge: 10000, timeout: 15000, enableHighAccuracy: true };
            this.geolocation.getCurrentPosition(options).then((resp) => {
                var lat = resp.coords.latitude
                var lng = resp.coords.longitude
                this.service.addData({ 'lat': lat, 'lng': lng, 'attendence_id': this.last_attendence_data.attend_id, 'image': this.last_attendence_data.image }, "AppAttendence/stopAttendence").then((result) => {
                    if (result['statusCode'] == 200) {
                        this.service.dismissLoading()
                        this.service.successToast(result['statusMsg']);
                        this.last_attendence()
                    } else {
                        this.service.dismissLoading()
                        this.service.errorToast(result['statusMsg']);
                        this.last_attendence()
                    }
                }, err => {
                    this.service.Error_msg(err);
                    this.service.dismissLoading()

                })

            }).catch((error) => {
                this.service.dismissLoading()
                this.presentConfirm('Turn On Location permisssion !', 'please go to  <strong>Settings</strong> -> Location to turn on <strong>Location permission</strong>')
            });
        },
            error => {
                this.service.dismissLoading()
                this.service.presentToast('Please Allow Location !!')
            });

    }





    stopAttendanceAlert() {
        this.spinner = true

        if (this.checkin_data.length == 0 || this.checkin_data == null) {
            this.platform.ready().then(() => {

                var whiteList = ['com.package.example', 'com.package.example2'];

                (<any>window).gpsmockchecker.check(whiteList, (result) => {


                    if (result.isMock) {
                        this.spinner = false
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
                        this.spinner = false
                        let alert = this.alertCtrl.create({
                            title: 'Stop Time',
                            message: 'Do you want to stop work time?',
                            cssClass: 'alert-modal',
                            buttons: [
                                {
                                    text: 'No',
                                    role: 'cancel',
                                    handler: () => {

                                    }
                                },
                                {
                                    text: 'Yes',
                                    handler: () => {
                                        this.stop_attend();

                                    }
                                }


                            ]
                        });
                        alert.present();
                    }


                });

            });
        } else {
            this.spinner = false
            this.service.errorToast('Please Check Out First')
        }

    }


    Approval_array: any
    expense: any
    leaveany: any
    team_count: any
    flag: boolean = false
    last_attendence() {
        this.skLoading = true
        this.service.addData({}, 'login/login_data').then((result) => {
            if (result['statusCode'] == 200) {
                this.skLoading = false
                this.getNetworkType();
                this.last_attendence_data = result['loginData']['attendence_data'];
                this.today_count = result['loginData']['today_count'];
                this.team_count = result['loginData']['team_count'];
                this.storage.set('team_count', this.team_count);
                this.announcementCount = result['loginData']['chk_announcement'];
                this.enquiry_count = result['loginData']['unread_enquiry_count'];
                this.Approval_array = result['loginData']['Approval_array']['PendingTravelPlan'];
                this.expense = result['loginData']['Approval_array']['expense'];
                this.leaveany = result['loginData']['Approval_array']['leave'];
                this.user_data = result['loginData']['user_data'];
                this.service.userData = this.user_data;
                console.log(this.user_data);
                if (this.last_attendence_data.start_time != '') {
                    var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                    var H = +this.last_attendence_data.start_time.substr(0, 2);
                    var h = (H % 12) || 12;
                    var ampm = H < 12 ? "AM" : "PM";
                    this.start_attend_time = h + this.last_attendence_data.start_time.substr(2, 3) + ' ' + ampm;
                }
                if (this.last_attendence_data.stop_time != '') {
                    var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                    var H = +this.last_attendence_data.stop_time.substr(0, 2);
                    var h = (H % 12) || 12;
                    var ampm = H < 12 ? "AM" : "PM";
                    this.stop_attend_time = h + this.last_attendence_data.stop_time.substr(2, 3) + ' ' + ampm;
                }

            } else {
                this.skLoading = false
                this.service.errorToast(result['statusMsg'])
            }
        }, error => {
            this.skLoading = false;
            this.service.Error_msg(error);
        })
    }


    goSiteListPage(moduleName, scanRight, pointsRight, type) {
        this.navCtrl.push(SiteListPage, { 'userType': this.user_data.user_type, 'moduleName': moduleName, 'scanRight': scanRight, 'type': type, 'pointsRight': pointsRight })
    }

    goToCheckin() {
        if (this.checkin_data.length == 0) {

            this.navCtrl.push(CheckinNewPage);
        } else {
            this.navCtrl.push(EndCheckinPage, { 'data': this.checkin_data })
        }

    }
    goToEvent() {

        this.navCtrl.push(CheckinNewPage);

    }
    scanProduct() {

        const options: BarcodeScannerOptions = {
            prompt: ""
        };
        this.barcodeScanner.scan(options).then(resp => {
            this.qr_code = resp.text;
            if (resp.text != '') {
                this.service.presentLoading()
                this.service.addData({ 'coupon_code': this.qr_code, }, 'AppCouponScan/fetchProduct').then((r: any) => {
                    if (r['statusCode'] == 200) {
                        let result;
                        result = r['result']
                        setTimeout(() => {
                            this.service.dismissLoading()
                            this.navCtrl.push(ScanningPage, { 'product_detail': result, 'page_type': 'scan' })
                        }, 600);
                    }
                    else {
                        setTimeout(() => {
                            this.service.dismissLoading()
                            this.service.errorToast(r['statusMsg'])
                        }, 600);
                    }
                },
                    err => {
                        this.service.dismissLoading();
                        this.service.Error_msg(err);
                    });
            }
            else {
            }
        }, err => {
            this.presentConfirm('Turn On Camera permisssion !', 'please go to <strong>Settings</strong> -> Camera to turn on <strong>Camera permission</strong>')
        })

    }

    manualProduct() {
        this.navCtrl.push(ScanningPage, { 'page_type': 'manual' })
    }





    goToLead() {
        this.navCtrl.push(LmsLeadListPage);

    }
    goTopop() {
        this.navCtrl.push(PopGiftListPage)
    }
    goToAttendence() {
        this.navCtrl.push(AttendenceNewPage);
    }
    goToTask() {
        this.navCtrl.push(TaskListPage);
    }

    goToFollowupAdd() {
        this.navCtrl.push(FollowupAddPage);
    }
    goToFollowup() {
        this.navCtrl.push(FollowupListPage);
    }


    goToLeave(type) {
        this.navCtrl.push(LeaveListPage, { 'from': type });
    }
    goToExpense(type) {
        this.navCtrl.push(ExpenseListPage, { 'view_type': type });
    }
    goToTravel(type) {
        this.navCtrl.push(TravelListNewPage, { 'view_type': type });
    }
    GoToProfile() {
        this.navCtrl.push(ProfilePage,);
    }
    goToDashboard() {
        this.navCtrl.push(DashboardNewPage, { 'user_data': this.user_data });
    }
    goToenquiry() {
        this.navCtrl.push(LmsLeadListPage)
    }
    goToExpenseAdd() {
        this.navCtrl.push(ExpenseAddPage, {
            from: 'expense', view_type: 'Team'
        });
    }

    goToevent() {
        this.navCtrl.push(ContractorMeetListPage);
    }
    goToSurvey() {
        this.navCtrl.push(SurveyListPage);
    }

    goToMainDistributorListPage(type) {
        if (type == 3) {
            this.navCtrl.push(RetailerListPage, { 'type': type })
        } else {

            this.navCtrl.push(MainDistributorListPage, { 'type': type })
        }

    }
    goToPrimaryOrders(type) {
        this.navCtrl.push(PrimaryOrderMainPage, { 'type': type });
    }
    goToSecondaryOrders(type) {
        this.navCtrl.push(SecondaryOrderMainPage, { 'type': type });
    }
    goOnProductPage() {
        this.navCtrl.push(ProductsPage, { 'mode': 'home' });
    }

    viewAchievement(type) {
        this.navCtrl.push(TargetPage, { 'user_data': this.user_data })
    }
    goOnDigitalcatPage() {
        this.navCtrl.push(LoyaltyCataloguePage)
    }

    announcementModal() {
        this.navCtrl.push(AnnouncementNoticesListPage);
    }
    gotoHolidayList() {
        this.navCtrl.push(HolidayListPage);

    }
    announcementList() {
        this.navCtrl.push(AnnouncementListPage)
    }

    networkType: any = []
    getNetworkType() {
        this.service.addData('', "AppCustomerNetwork/distributionNetworkModule").then(result => {
            this.networkType = result['modules'];
        }, err => {
            this.service.Error_msg(err);
            this.service.dismiss();
        })
    }
    doRefresh(refresher) {

        this.last_attendence();
        this.pending_checkin();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }




}
