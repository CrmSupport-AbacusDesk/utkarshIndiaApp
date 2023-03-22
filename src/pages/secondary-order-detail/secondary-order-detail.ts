import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, Events, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { ConstantProvider } from '../../providers/constant/constant';
import { Camera } from '@ionic-native/camera';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { FileOpener } from '@ionic-native/file-opener';
import { SecondaryAddItemPage } from '../secondary-add-item/secondary-add-item';
import { OrderStatusChangePage } from '../order-status-change/order-status-change';


@IonicPage()
@Component({
    selector: 'page-secondary-order-detail',
    templateUrl: 'secondary-order-detail.html',
})
export class SecondaryOrderDetailPage {
    summary: string = "active";
    order_id: any;
    orderDetail: any = [];
    OrderList: any = [];
    userDetail: any = [];
    order_item_array: any = [];
    login: any;
    order_id1: any = '';
    currentDate: any = '';
    orderDate: any = '';
    orderDate1: any;
    orderitem: any = []
    retailer_list = []
    dispatch: boolean = false;
    loginData: any = {};
    upload_url: any = '';
    userType: any = '';
    pdfUrl: any;
    globalCollapsible: boolean = false;
    openCollapse: any;
    gst: any;
    discount_amt: any;
    discounted_amt: any;
    gst_amount: any;
    order: any = {};
    order_data: any = {};
    subTotal: any;
    amount: any;
    tag: any;
    show_image: boolean = false
    active: any = {};
    order_item_discount: any = {};
    value: any = {};
    user_data: any = {};
    today_date = new Date().toISOString().slice(0, 10);
    
    brand_assign: any = [];
    loading: any;
    
    constructor(public navCtrl: NavController, private fileOpener: FileOpener, public events: Events, public constant: ConstantProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public navParams: NavParams, public service: MyserviceProvider, public toastCtrl: ToastController, public alertCtrl: AlertController, public storage: Storage, public actionSheetController: ActionSheetController, public camera: Camera, private transfer: FileTransfer, public db: DbserviceProvider, public file: File) {
        this.summary = 'active';
        this.pdfUrl = this.constant.upload_url1 + 'orderPdf/';
        this.OrderList = [
            '1', '2', '3', '4', '5', '6'
        ]
        
    }
    ionViewWillEnter() {
        if (this.navParams.get('login')) {
            this.login = this.navParams.get('login');
        }
        else {
            this.login = 'DrLogin'
        }
        
        
        this.collObject.index = true;
        this.upload_url = this.constant.upload_url2;
        this.storage.get("loginData")
        .then(resp => {
            
            this.loginData = resp;
            
        })
        
        
        this.storage.get('loginType').then((loginType) => {
            
            if (loginType == 'CMS') {
                this.userType = 'notDrLogin'
            }
            else {
                this.userType = 'drLogin'
            }
        });
        
        
        if (this.userType == 'CMS') {
            this.user_data = this.db.tokenInfo;
        }
        else {
            this.user_data = this.constant.UserLoggedInData.all_data;
        }
        
        if (this.navParams.get('order_id')) {
            this.order_id1 = this.navParams.get('order_id');
            this.getOrderDetail(this.order_id1);
        }
        
        this.currentDate = moment().format("YY:MM:DD");
        
        
        
        this.storage.get('order_item_array').then((order_item) => {
            
            if (typeof (order_item) !== 'undefined' && order_item) {
                this.order_item_array = order_item;
                
            }
        });
        
        if (this.navParams.get("id")) {
            this.order_id = this.navParams.get("id");
            if (this.order_id) {
                
                
                this.getOrderDetail(this.order_id);
            }
        }
        
        if (this.navParams.get('customer_order_detail')) {
            this.userDetail = this.navParams.get('customer_order_detail');
            // this.orderDetail = this.navParams.get('customer_order_item');
            this.tag = this.navParams.get('tag');
        }
        
    }
    
    
    ionViewDidLoad() {
        
    }
    
    
    getOrderDetail(order_id) {
        
        this.service.addData({ "Id": order_id }, "AppOrder/secondaryOrderDetail").then((result) => {
            if (result['statusCode']) {
                this.userDetail = result['result'];
                
                this.orderitem = result['result']['item_details'];
            } else {
                this.service.errorToast(result['statusMsg'])
            }
            
        })
    }
    
    
    
    delete_item(index, id, order_id) {
        
        let alert = this.alertCtrl.create({
            title: 'Confirm ',
            message: 'Are you sure you want to delete this item ?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        
                        this.delete_order_item(index, id, order_id);
                    }
                }
            ]
        })
        
        alert.present();
    }
    
    ADD_Item(id) {
        this.orderDetail.map(row => {
            row.discount = row.discount_percent;
        })
        this.navCtrl.push(SecondaryAddItemPage, { "order_item": this.orderitem, "order_data": this.userDetail, 'order_id': this.order_id });
    }
    
    delete_order_item(index, id, order_id) {
        
        this.service.presentLoading();
        this.service.addData({ 'id': id }, 'AppOrder/secondaryOrderDeleteItem').then((result) => {
            if (result['statusCode'] == 200) {
                this.orderitem.splice(index, 1);
                this.service.dismissLoading();
                this.service.successToast(result['statusMsg'])
                this.getOrderDetail(this.order_id);
            } else {
                this.service.errorToast(result['statusMsg'])
                this.service.dismissLoading();
            }
        })
    }
    
    collObject: any = {}
    
    
    
    changeStatus() 
    {
        let modal = this.modalCtrl.create(OrderStatusChangePage,{'id':this.userDetail.id, 'order_status':this.userDetail.order_status});
        modal.onDidDismiss(data =>
            {
                // this.getOrderDetail(this.order_id);
            });
            
            modal.present();
        }
        
    }
    