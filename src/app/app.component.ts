import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events, App, ToastController, AlertController, MenuController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../providers/constant/constant';
import { DbserviceProvider } from '../providers/dbservice/dbservice';
import * as jwt_decode from "jwt-decode";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import moment from 'moment';
import { AttendenceserviceProvider } from '../providers/attendenceservice/attendenceservice';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MyserviceProvider } from '../providers/myservice/myservice';
import { LeaveListPage } from '../pages/leave-list/leave-list';
import { SecondaryOrderPage } from '../pages/secondary-order/secondary-order';
import { PopGiftOutgoingPage } from '../pages/sales-app/pop-gift/pop-gift-outgoing/pop-gift-outgoing';
import { CategoryPage } from '../pages/category/category';
import { Network } from '@ionic-native/network';
import { DealerHomePage } from '../pages/dealer-home/dealer-home';
import { DealerProfilePage } from '../pages/dealer-profile/dealer-profile';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { CancelpolicyModalPage } from '../pages/cancelpolicy-modal/cancelpolicy-modal';
import { AttendenceNewPage } from '../pages/attendence-new/attendence-new';
import { CheckinNewPage } from '../pages/checkin-new/checkin-new';
import { LoyaltyHomePage } from '../pages/loyalty/loyalty-home/loyalty-home';

// import { FCM } from '@ionic-native/fcm'



export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    index?: number;
    tabName?: string;
    tabComponent?: any;
    show: any;

}
@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;
    connectionChk: any = '';
    rootPage: any;
    tokenInfo: any = '';
    loginType: any = '';
    current_page: any;
    check_token: any;
    pages: PageInterface[];
    user_logged_in: boolean;
    userLoggedRole: any;
    userLoggedDisplayName: any;
    userRoleId: any;
    currentTime: any = '';
    userType: any;
    userName: any;
    versionNumber: any;
    userToken: any;
    checkin_data: any = {};

    constructor(private network: Network, public platform: Platform, statusBar: StatusBar, public menu: MenuController, public attendenceServe: AttendenceserviceProvider, splashScreen: SplashScreen, public modalCtrl: ModalController, public storage: Storage, public events: Events, public constant: ConstantProvider, private app: App, public toastCtrl: ToastController, public serve: MyserviceProvider, public service: DbserviceProvider, public myserv: MyserviceProvider, public alertCtrl: AlertController, public push: Push, public appVersion: AppVersion) {
        this.myserv.navigationEvent.subscribe(
            data => {
                this.nav.push(data.page)
            }
        )
        window.addEventListener('offline', (data) => {
            this.serve.isInternetConnection = false;
            this.nav.push(CancelpolicyModalPage)
        })

        window.addEventListener('online', (data) => {
            this.serve.isInternetConnection = true;
            this.events.publish('state', 'online');
        });

        events.subscribe('dealerProfileUpdated', (data) => {
            this.userLoggedDisplayName = data;
        })

        this.initPushNotification();
        this.constant.networkType = this.network.type;
        this.check_version();
        storage.get('loginType').then((loginType) => {
            this.loginType = loginType;
        });
        setTimeout(() => {
            if (this.loginType == 'CMS') {
                storage.get('token').then((val) => {
                    if (val == '' || val == null || val == undefined) {
                        this.rootPage = SelectRegistrationTypePage;
                    } else if (val) {
                        this.tokenInfo = this.getDecodedAccessToken(val);
                        this.rootPage = LoginPage, { 'registerType': 'Employee' };
                    }
                });
                events.subscribe('data', (data) => {
                    if (data == 1) {
                        storage.get('token_value').then((val) => {
                            this.nav.setRoot(LoginPage, { 'registerType': 'Employee' });
                        });
                    }
                })
            }
            else {
                setTimeout(() => {
                    if (this.constant.UserLoggedInData.userLoggedInChk == false) {
                        this.nav.setRoot(SelectRegistrationTypePage);
                    }
                    else {
                        if (this.constant.UserLoggedInData.loggedInUserType == 'Employee') {
                            storage.get('token_value').then((val) => {
                                if (val == '' || val == null || val == undefined) {
                                    this.nav.setRoot(SelectRegistrationTypePage);
                                }
                                else {
                                    this.initPushNotification();
                                    this.nav.setRoot(DashboardPage);
                                }
                            });
                            this.currentTime = moment().format("HH:mm:ss");


                            this.storage.get('token').then((token) => {
                                if (typeof (token) !== 'undefined' && token) {
                                    this.user_logged_in = true;
                                }
                                else {
                                    this.user_logged_in = false;
                                    this.rootPage = SelectRegistrationTypePage;
                                }
                            });
                            this.storage.get('name').then((name) => {
                                if (typeof (name) !== 'undefined' && name) {
                                    this.userName = name;
                                }
                            });
                            this.storage.get('role_id').then((roleId) => {
                                if (typeof (roleId) !== 'undefined' && roleId) {
                                    this.userRoleId = roleId;
                                }
                            });
                            this.storage.get('user_type').then((userType) => {
                                if (typeof (userType) !== 'undefined' && userType) {
                                    this.userType = userType;
                                }
                            });
                            setTimeout(() => {
                                this.storage.get('role').then((role) => {
                                    if (typeof (role) !== 'undefined' && role) {
                                        this.userLoggedRole = role;
                                    }
                                    if (this.user_logged_in) {
                                    }
                                });
                                this.storage.get('displayName').then((displayName) => {
                                    if (typeof (displayName) !== 'undefined' && displayName) {
                                        this.userLoggedDisplayName = displayName;
                                    }
                                });
                            }, 1000);
                            this.storage.get('token_value').then((token_value) => {
                                if (typeof (token_value) !== 'undefined' && token_value) {
                                    this.userToken = token_value;
                                }
                            });
                            this.events.subscribe('current_page', (data) => {
                                this.current_page = data;
                            });
                        }
                        else if (this.constant.UserLoggedInData.loggedInUserType == 'DrLogin') {

                            storage.get('token_value').then((val) => {
                                if (val == '' || val == null || val == undefined) {
                                    this.nav.setRoot(SelectRegistrationTypePage);
                                }
                                else {
                                    this.initPushNotification();
                                    this.nav.setRoot(DealerHomePage);
                                    if (this.constant.UserLoggedInData.displayName) {
                                        this.userLoggedDisplayName = this.constant.UserLoggedInData.displayName
                                    }
                                }

                            });

                        }

                        else if (this.constant.UserLoggedInData.loggedInUserType == 'Other') {
                            storage.get('token_value').then((val) => {
                                if (val == '' || val == null || val == undefined) {
                                    this.initPushNotification();
                                    this.nav.setRoot(SelectRegistrationTypePage);
                                }
                                else {
                                    this.nav.setRoot(LoyaltyHomePage);
                                }

                            });

                        }

                    }
                }, 500);

            }
            platform.ready().then(() => {
                if (this.loginType == 'CMS') {
                    this.network.onConnect().subscribe(() => {
                        this.service.connection = 'online';
                        this.constant.connectionChk = 'online'
                    });
                    this.network.onDisconnect().subscribe(() => {
                        this.service.connection = 'offline';
                        this.constant.connectionChk = 'offline';
                    });


                }
                else {
                    this.service.connection = 'online';
                    this.constant.connectionChk = 'online;'
                }
                statusBar.overlaysWebView(false);
                setTimeout(() => {
                    splashScreen.hide();
                }, 1000);
                statusBar.backgroundColorByHexString('black');
            });
        }, 500);

        if (this.network.type == 'none') {
            this.service.connection = 'offline';
            storage.get('token').then((val) => {
                if (val == '' || val == null || val == undefined) {
                    this.nav.setRoot(SelectRegistrationTypePage);
                }
                else {
                    this.nav.setRoot(LoginPage, { 'registerType': 'Employee' });
                }
            });
        }
        else {
            this.service.connection = 'online';
        }
        platform.registerBackButtonAction(() => {
            let nav = app.getActiveNav();
            let activeView = nav.getActive().name;
            const overlayView = this.app._appRoot._overlayPortal._views[0];
            if (overlayView && overlayView.dismiss) {
                overlayView.dismiss();
                return;
            }

            else if (nav.canGoBack()) {
                nav.pop();
            }

            else if (nav.canGoBack() == false) {
                let alert = this.alertCtrl.create({
                    title: 'App termination',
                    message: 'Are you sure you want Exit?',
                    buttons: [
                        {
                            text: 'Exit',
                            handler: () => {
                                this.platform.exitApp();
                            }
                        },
                        {
                            text: 'Stay',
                            handler: () => {
                            }
                        }

                    ]
                })
                alert.present();
            }
            else {
            }
        });
        //events favoritet
        this.events.subscribe('token_val_dr', (val) => {
            if (val) {
                this.user_logged_in = true;
            }
        });

        //events end
    }


    getDecodedAccessToken(token: string): any {
        try {
            return jwt_decode(token);
        }
        catch (Error) {
            return null;
        }
    }
    Requiredalert(text) {
        let alert = this.alertCtrl.create({
            title: 'Alert!',
            cssClass: 'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
    goOnProductPage() {
        this.nav.push(CategoryPage, { 'mode': 'home' });
    }






    goto_profile() {
        this.nav.push(DealerProfilePage);
    }

    open_profile() {
        this.nav.push(ProfilePage);
    }


    initPushNotification() {
        this.push.hasPermission().then((res: any) => {
            if (res.isEnabled) { }
        });

        const options: PushOptions = {
            android: {
                senderID: '696963043768',
                icon: './assets/imgs/logo_small',
                forceShow: true
            },
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {}
        };

        const pushObject: PushObject = this.push.init(options);
        pushObject.on('registration').subscribe((registration) => {
            this.constant.deviceId = registration.registrationId
            this.myserv.addData({ 'registration_id': registration.registrationId }, 'Login/updateNotificationToken')
                .then((r) => {
                });
        });

        pushObject.on('notification').subscribe((notification) => {
            var tmpNotification = notification;
            let confirmAlert = this.alertCtrl.create({
                title: 'New Notification',
                message: JSON.stringify(notification.message),
                buttons:
                    [
                        {
                            text: 'Ignore',
                            role: 'cancel'
                        },
                        {
                            text: 'View',
                            handler: () => {
                            }
                        }]
            });
        });
        pushObject.on('error').subscribe((error) =>
            console.error(error));
    }


    db_app_version: any = '';
    app_version: any = '';
    check_version() {
        this.myserv.addData("", 'login/app_version').then(resp => {
            this.db_app_version = resp['app_version'];
            this.appVersion.getVersionNumber().then(resp => {
                this.app_version = resp;
                if (this.app_version != this.db_app_version) {
                    let updateAlert = this.alertCtrl.create({
                        title: 'Update Available',
                        enableBackdropDismiss: false,
                        cssClass: 'alert-modal',
                        message: 'A newer version of this app is available for download. Please update it from PlayStore !',
                        buttons: [
                            {
                                text: 'Cancel',
                                handler: () => {
                                    setTimeout(() => {
                                    }, 500);

                                    this.platform.exitApp();
                                }
                            },
                            {
                                text: 'Update Now',
                                handler: () => {
                                    window.open('market://details?id=com.pearl.app&hl=en', '_system', 'location=yes');
                                    // window.open('https://play.google.com/store/apps/details?id=com.pearl.app&hl=en', '_system', 'location=yes');
                                    this.platform.exitApp();
                                }
                            }]
                    });
                    updateAlert.present();
                }
            });
        }, err => {
            this.serve.Error_msg(err);
            this.serve.dismiss();
        });
    }
    logout() {
        let alert = this.alertCtrl.create({
            title: 'Logout!',
            message: 'Are you sure you want Logout?',
            cssClass: 'alert-modal',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        // this.d.('Action Cancelled!')
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        //   this.itemsArr.splice(i,1);
                        this.storage.set('token', '');
                        this.storage.set('role', '');
                        this.storage.set('displayName', '');
                        this.storage.set('role_id', '');
                        this.storage.set('name', '');
                        this.storage.set('type', '');
                        this.storage.set('token_value', '');
                        this.storage.set('userId', '');
                        this.storage.set('token_info', '');
                        // this.storage.set('token_value','');
                        // this.storage.set('loggedInUserType','');
                        this.user_logged_in = false;
                        this.userLoggedRole = '';
                        this.userLoggedDisplayName = '';
                        this.userRoleId = '';
                        this.userType = '';
                        this.userName = '';
                        this.constant.UserLoggedInData = {};
                        this.constant.UserLoggedInData.userLoggedInChk = false;
                        this.nav.setRoot(SelectRegistrationTypePage);
                    }
                }
            ]
        })

        alert.present();

    }

    offlineAlert() {
        var text = 'Offline ! Please Connect To An Active Internet Connection'
        let alert = this.alertCtrl.create({
            title: 'Alert!',
            cssClass: 'action-close',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    login() {
        // this.nav.setRoot(SelectRegistrationTypePage);
        this.nav.push(LoginPage, { 'registerType': 'Employee' });

    }
    SelectType() {
        // this.nav.setRoot(SelectRegistrationTypePage);
        this.nav.push(SelectRegistrationTypePage);

    }

}