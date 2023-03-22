import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, Loading, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { AboutPage } from '../about/about';
import { DealerOrderPage } from '../dealer-order/dealer-order';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { NearestDealerPage } from '../nearest-dealer/nearest-dealer';
import { ConstantProvider } from '../../providers/constant/constant';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DealerDealerListPage } from '../dealer-dealer-list/dealer-dealer-list';
import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { ProductsPage } from '../products/products';
import { PrimaryOrderAddPage } from '../primary-order-add/primary-order-add';
import { SecondaryOrderAddPage } from '../secondary-order-add/secondary-order-add';
import { LoyaltyAboutPage } from '../loyalty/loyalty-about/loyalty-about';
import { LoyaltyContactPage } from '../loyalty/loyalty-contact/loyalty-contact';
import { LoyaltyVideoPage } from '../loyalty/loyalty-video/loyalty-video';
import { DealerCheckInPage } from '../dealer-check-in/dealer-check-in';
import { PrimaryOrderPage } from '../primary-order/primary-order';
import { SecondaryOrderPage } from '../secondary-order/secondary-order';
import { InvoiceListPage } from '../invoice-list/invoice-list';
import { LedgerPage } from '../ledger/ledger';
import { PaymentPage } from '../payment/payment';
import { DistributorSaleTargetPage } from '../distributor-sale-target/distributor-sale-target';
import { ProfilePage } from '../profile/profile';
import { SurveyListPage } from '../survey/survey-list/survey-list';
import { LoyaltyEnterCouponCodePage } from '../loyalty-enter-coupon-code/loyalty-enter-coupon-code';
import { LoyaltyCataloguePage } from '../loyalty-catalogue/loyalty-catalogue';
import { LoyaltyGiftTrackerPage } from '../loyalty/loyalty-gift-tracker/loyalty-gift-tracker';
import { LoyaltyGiftGalleryPage } from '../loyalty/loyalty-gift-gallery/loyalty-gift-gallery';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { CongratulationsPage } from '../loyalty/congratulations/congratulations';
import { LoyaltyPointHistoryPage } from '../loyalty/loyalty-point-history/loyalty-point-history';
import { MyInfluencerPage } from '../my-influencer/my-influencer';
import { InfluencerPointTransferPage } from '../influencer-point-transfer/influencer-point-transfer';
import { PopGiftListPage } from '../sales-app/pop-gift/pop-gift-list/pop-gift-list';
import { SupportListPage } from '../support-list/support-list';
import { AnnouncementNoticesListPage } from '../announcement-notices-list/announcement-notices-list';
import { DistributorDealerWalletPage } from '../distributor-dealer-wallet/distributor-dealer-wallet';
import { DashboardNewPage } from '../dashboard-new/dashboard-new';
import { TargetPage } from '../target/target';
import { AnnouncementListPage } from '../announcement/announcement-list/announcement-list';

@IonicPage()
@Component({
    selector: 'page-dealer-home',
    templateUrl: 'dealer-home.html',
})
export class DealerHomePage {
    lable: any;
    prodCount: any = {};
    Dr_Data: any = {};
    banner: any = []
    dashboardData: any = {}
    appbanner: any = [];
    loading: Loading;
    bannerURL: any;
    user_data: any;
    announcementCount: any;
    paymentDetail:any = {}
    
    constructor(
        public navCtrl: NavController,
        public socialSharing: SocialSharing,
        public events: Events,
        public constant: ConstantProvider,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public service: DbserviceProvider,
        public serve: MyserviceProvider,
        public alertCtrl: AlertController,
        public locationAccuracy: LocationAccuracy,
        private barcodeScanner: BarcodeScanner,
        public geolocation: Geolocation,
        public toastCtrl: ToastController) {
            this.bannerURL = constant.upload_url1+'banner/';
        }
        
        
        ionViewWillEnter() {
            this.Dr_Data = this.constant.UserLoggedInData;
            this.getDashBoardData()
            
        }
        userDetails: any = {};
        getDashBoardData() {
            this.serve.presentLoading()
            this.serve.addData({ dr_id: this.constant.UserLoggedInData.id, type: this.constant.UserLoggedInData.type }, 'login/login_data').then((res) => {
                if(res['statusCode']==200){
                    this.dashboardData = res['loginData']['login_data'];

                    if(this.dashboardData.type == 1 || this.dashboardData.type == 7){
                        this.getPaymentDetail()
                    }
                    this.announcementCount = res['loginData']['chk_announcement'];
                    this.userDetails = res['loginData'];
                    this.serve.dismissLoading()
                    this.bannerDetail();
                }else{
                    this.serve.dismissLoading()
                    this.serve.errorToast(res['statusMsg'])
                }
            }, err => {
                this.serve.Error_msg(err);
                this.serve.dismiss();
            })
        }
        
        getPaymentDetail() {
            this.serve.addData({}, 'AppCustomerNetwork/getPaymentInfo').then((result) => {
                if (result['statusCode'] == 200) {
                    this.paymentDetail = result['paymentInfo']['dr_upper_info'];
                }
                else {
                    this.serve.errorToast(result['statusMsg']);
                }
                
            });
        }
        bannerDetail() {
            
            this.serve.addData({}, 'AppInfluencer/bannerList').then((result) => {
                if (result['statusCode'] == 200) {
                    this.appbanner = result['banner_list'];
                }
                else {
                    this.serve.errorToast(result['statusMsg']);
                }
                
            });
        }
        
        GoToProfile() {
            this.navCtrl.push(ProfilePage);
        }
        open_menu() {
            this.events.publish('side_menu:navigation_barDealer');
        }
        
        goOnContactPage() {
            // this.navCtrl.push(ContactPage,{mode:'dealer'});
            this.navCtrl.push(LoyaltyContactPage);
            
        }
        goToSurvey() {
            this.navCtrl.push(SurveyListPage)
        }
        
        goToVideo() {
            this.navCtrl.push(LoyaltyVideoPage)
        }
        goToDealerCheckin() {
            this.navCtrl.push(DealerCheckInPage)
        }
        goTopop() {
            this.navCtrl.push(PopGiftListPage)
        }
        goToSupport() {
            this.navCtrl.push(SupportListPage)
        }
        
        orderAdd() {
            if (this.Dr_Data.type != 3 ) {
                this.navCtrl.push(PrimaryOrderAddPage, { 'Dist_login': 'Primary order', 'dr_name': this.Dr_Data.name, 'id': this.Dr_Data.id, 'dr_type': this.Dr_Data.type, 'display_name': this.Dr_Data.displayName });
            } else if(this.Dr_Data.type == 3) {
                this.navCtrl.push(SecondaryOrderAddPage, { 'Dist_login': 'Secondary order', 'dr_name': this.Dr_Data.name, 'id': this.Dr_Data.id, 'dr_type': this.Dr_Data.type, 'display_name': this.Dr_Data.displayName });
            }
        }
        goToOrderlist() {
            if (this.Dr_Data.type != 3) {
                
                this.navCtrl.push(PrimaryOrderPage);
            } else if(this.Dr_Data.type == 3) {
                this.navCtrl.push(SecondaryOrderPage);
                
            }
        }
        
        goTosecondary() {
            this.navCtrl.push(SecondaryOrderPage)
        }
        goToTarget() {
            this.navCtrl.push(DistributorSaleTargetPage)
        }
        goOnLedger() {
            this.navCtrl.push(LedgerPage);
        }
        goOnInvoice() {
            this.navCtrl.push(InvoiceListPage);
        }
        goOnPayment() {
            this.navCtrl.push(PaymentPage, {'dr_code':this.Dr_Data.all_data.dr_code});
        }
        
        goOnAboutPage() {
            this.navCtrl.push(AboutPage, { mode: 'dealer' });
        }
        
        goToarrivals() {
            this.navCtrl.push(NewarrivalsPage)
        }
        
        goToAbout() {
            this.navCtrl.push(LoyaltyAboutPage)
        }
        goOnProductPage() {
            this.navCtrl.push(ProductsPage, { 'mode': 'home' });
        }
        
        goToOrders(type) {
            this.navCtrl.push(DealerOrderPage, { mode: 'dealer', type: type });
        }
        
        goto_executive() {
            this.navCtrl.push(DealerExecutiveListPage);
        }
        
        
        goToNearestDealers(type) {
            var data = this.constant.UserLoggedInData.all_data;
            this.navCtrl.push(NearestDealerPage, { pincode: data.pincode, type: type });
        }
        
        
        
        delaerexecutive(type) {
            this.navCtrl.push(DealerExecutiveAppPage, { "type": type });
        }
        
        goToassignedDr() {
            this.navCtrl.push(DealerDealerListPage);
        }
        
        
        
        
        check_location() {
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                let options =
                {
                    maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
                };
                
                this.geolocation.getCurrentPosition(options).then((resp) => {
                    var lat = resp.coords.latitude
                    var lng = resp.coords.longitude
                    this.serve.addData({ user_data: this.constant.UserLoggedInData, "lat": lat, "lng": lng }, "dealerData/add_location")
                    .then(resp => {
                    })
                },
                error => {
                    let toast = this.toastCtrl.create({
                        message: 'Allow Location Permissions',
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                });
            });
        }
        
        doRefresh(refresher) {
            this.getDashBoardData()
            this.bannerDetail();
            setTimeout(() => {
                refresher.complete();
            }, 1000);
        }
        notification() {
            this.serve.addData('', "dealerData/send_push_notification")
            .then(resp => {
            })
        }
        
        
        
        goToCoupon() {
            this.navCtrl.push(LoyaltyEnterCouponCodePage, { 'type': 'retailer' })
        }
        
        goOnDigitalcatPage() {
            this.navCtrl.push(LoyaltyCataloguePage)
        }
        
        goToTracker() {
            this.navCtrl.push(LoyaltyGiftTrackerPage)
        }
        goToGift() {
            this.navCtrl.push(LoyaltyGiftGalleryPage)
        }
        goOnPointeListPage() {
            this.navCtrl.push(LoyaltyPointHistoryPage)
        }
        
        
        goOnInfluencer() {
            this.navCtrl.push(MyInfluencerPage)
        }
        goOnDistributorLedger() {
            this.navCtrl.push(InfluencerPointTransferPage)
        }
        
        qr_code: any = '';
        
        showAlert(text) {
            let alert = this.alertCtrl.create({
                title: 'Alert!',
                cssClass: 'action-close',
                subTitle: text,
                buttons: ['OK']
            });
            alert.present();
        }
        showSuccess(text) {
            let alert = this.alertCtrl.create({
                title: 'Success!',
                cssClass: 'action-close',
                subTitle: text,
                buttons: ['OK']
            });
            alert.present();
        }
        scan() {
            const options: BarcodeScannerOptions = {
                prompt: ""
            };
            this.barcodeScanner.scan(options).then(resp => {
                this.qr_code = resp.text;
                if (resp.text != '') {
                    this.serve.addData({ 'coupon_code': this.qr_code }, 'Influencer/coupon_code_scan').then((r: any) => {
                        if (r['status'] == 'Success' && r['bonus_point'] > 0) {
                            let contactModal = this.modalCtrl.create(CongratulationsPage, { 'scan_point': r['coupon_point'], 'user_type': 'retailer', 'bonus_point': r['bonus_point'] });
                            contactModal.present();
                            return;
                        }
                        else if (r['status'] == 'Success') {
                            this.showSuccess(r['coupon_point'] + " points has been added into your wallet");
                            this.navCtrl.push(DealerHomePage);
                            return;
                        }
                        else {
                            this.showAlert(r['msg']);
                        }
                    });
                }
                else {
                }
            });
        }
        goToWallet(){
            this.navCtrl.push(DistributorDealerWalletPage);
        }
        
        
        getNotification() {
            this.navCtrl.push(AnnouncementNoticesListPage);
        }
        
        
        viewAchievement(type) {
            this.navCtrl.push(TargetPage, { 'user_data': this.user_data, 'page_type':'Dr' })
        }
        goToDashboard() {
            this.navCtrl.push(DashboardNewPage, { 'user_data': this.user_data, 'page_type':'Dr' });
        }
        announcementList() {
            this.navCtrl.push(AnnouncementListPage)
        }
        
        
    }