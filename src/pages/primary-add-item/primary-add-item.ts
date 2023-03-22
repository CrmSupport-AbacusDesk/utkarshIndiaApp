import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { OrderListPage } from '../order-list/order-list';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartDetailPage } from '../cart-detail/cart-detail';
import { ViewChild } from '@angular/core';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PrimaryOrderDetailPage } from '../primary-order-detail/primary-order-detail';
import { toArray } from 'rxjs/operator/toArray';

@IonicPage()
@Component({
    selector: 'page-primary-add-item',
    templateUrl: 'primary-add-item.html',
})
export class PrimaryAddItemPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('category') categorySelectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
    distributorSelected: any = false
    categoryList: any = [];
    data: any = {};
    form: any = {};
    catCode_List: any = [];
    segment_list2: any = [];
    // total_item_discount: any =[]
    user_state: any = '';
    autocompleteItems: any = [];
    order_detail: any = {};
    user_data: any = {};
    itemType: any = {};
    disable_marka: boolean = false;
    btndisable: boolean = false;
    disable_transport: boolean = false;
    order_data: any = {};
    special_discount: any = 0;
    type: any = '';
    order_id: any = '';
    cart_array: any = []
    adddMoreItem: any = false
    order_item: any = [];
    checkinData: any = {};
    userType: any;
    prod_cat_list;
    sub_total_before_cd: any = 0;
    cd_value: any = 0;
    sub_total_after_cd: any = 0;
    ins_value: any = 0;
    grand_total_before_tcs: any = 0;
    tcs_value: any = 0;
    order_grand_total: any = 0;
    showSave = false;
    showEdit = true;
    active: any = {};
    addToListButton: boolean = true;
    ItemGST: any = '';
    Dist_state = ''
    Dr_type = ''
    total_Order_amount: any = ''
    order_total: any = ''
    color_list: any = [];
    brand_list: any = [];
    product: any = {};
    show_price: any = false;
    SpecialDiscountLable: any = ''
    leave: any = 0;
    temp_product_array: any = [];
    cash_discount_percent: any = 0;
    distributor_list: any = [];
    grand_amt: any = {};
    sub_total: any = 0;
    dis_amt: any = 0;
    gst_amount: any = 0;
    net_total: any = 0;
    spcl_dis_amt: any = 0
    grand_total: any = 0;
    order_gst: any = 0;
    distributor_network_list: any = [];
    from_product = false
    filter: any = {};
    no_rec: any = {};
    userId: any = {};
    product_list: any = [];
    order: any = {};
    flag: any = {};
    sizeList: any = {};
    qty: any;
    product_resp: boolean;
    mode = 0;
    distributorlist: any = [];
    drtype: any;
    checkin_id: any = 0;
    idMode: any;
    retailerID: any;
    tmpdata: any = {};
    disableSelect: boolean = false;
    disableSelectFromCheckin: boolean = false;
    add_list: any = [];
    temp_add_list: any = [];
    new_add_list: any = [];
    total_qty: any = 0;
    netamount: any = 0;
    tcs_percent: any = 0;
    fixedBrand: any = [];
    total_gst_amount: any = 0;
    order_discount: any = 0;
    new_grand_total: any = 0;
    drList: any = [];
    product_detail: any = {};
    brandList: any = [];
    colorList: any = [];
    lastGstPercent: any = 0;
    constructor(
        public navCtrl: NavController,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController
        , public service1: MyserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        public service: DbserviceProvider,
        public db: MyserviceProvider,
        public appCtrl: App) {
        this.order_item = this.navParams.get('order_item')
        this.order_data = this.navParams.get('order_data')
        this.drtype = this.navParams['data'].type;
        this.checkin_id = this.navParams.get('checkin_id');
    }
    ionViewDidEnter() {

        if (this.navParams.get('order_data') && this.navParams.get('order_item')) {
            this.disableSelect = true
            this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
            this.tmpdata.id = this.navParams.get('order_data')['dr_id']
            this.order_id = this.navParams.get('order_data')['order_id']
            this.distributors(this.tmpdata)
            // this.get_distributor_list(this.tmpdata)
        }
        // this.get_segment('blank')

        if (this.order_data && this.order_item) {
            this.total_Order_amount = 0
            for (let i = 0; i < this.order_item.length; i++) {
                this.order_item[i].total_amount = this.order_item[i].amount
                this.order_item[i].amount = this.order_item[i].sub_total
                this.total_Order_amount = this.order_item[i].price + this.total_Order_amount
            }
            this.total_Order_amount = parseFloat(this.order_data.total_order_amount);
            this.total_gst_amount = parseFloat(this.order_data.order_gst)
            this.order_grand_total = parseFloat(this.order_data.order_grand_total)
            this.sub_total_after_cd = parseFloat(this.order_data.sub_total_after_cd)
            this.cash_discount_percent = parseFloat(this.order_data.cash_discount_percent);
            this.cd_value = parseFloat(this.order_data.cash_discount)
            this.sub_total_after_cd = parseFloat(this.order_data.sub_total_after_cd)
            this.sub_total_before_cd = parseFloat(this.order_data.sub_total_before_cd)
            this.ins_value = parseFloat(this.order_data.insurance);
            this.grand_total_before_tcs = parseFloat(this.order_data.grand_total_before_tcs);
            this.tcs_value = parseFloat(this.order_data.tcs);
            this.tcs_percent = parseFloat(this.order_data.tcs_percent);

            this.order_discount = parseFloat(this.order_data.order_discount)
            this.order_total = parseFloat(this.order_data.order_total);
            this.total_qty = parseFloat(this.order_data.order_item);
            this.total_gst_amount = this.total_gst_amount.toFixed()
            this.new_grand_total = this.new_grand_total.toFixed()
            this.total_gst_amount = parseFloat(this.total_gst_amount)
            // this.new_grand_total = parseInt(this.new_grand_total)
            this.order_total = parseFloat(this.order_total)
        }


        if (this.order_item && this.order_item.length > 0) {

            this.db.addData({ "Id": this.navParams.get('order_data')['id'] }, "AppOrder/primaryOrdersDetail").then((result) => {
                this.order_detail = result['result'];
                this.add_list = result['result']['item_details'];
                this.order_id = this.navParams.get('order_data')['id']
                for (let i = 0; i < this.add_list.length; i++) {
                    this.add_list[i].product_price = this.add_list[i]['price'];
                    this.lastGstPercent = this.add_list[i]['gst_percent'];
                }
                this.fixedBrand.push(this.add_list[0]['brand']);

            });

        }
        setTimeout(() => {
            this.get_item_list('', 'blank', this.lastGstPercent)
        }, 1000);

        this.sub_total = 0;
        this.dis_amt = 0;
        this.gst_amount = 0;
        this.net_total = 0;
        this.spcl_dis_amt = 0
        this.grand_total = 0;
        this.order_gst = 0;
        this.cart_array.map((item) => {
            this.product = item
        })
        //     }    
        // }

        this.navBar.backButtonClick = () => {

            this.backAction()

        };
        this.platform.registerBackButtonAction(() => {
            this.backAction()
        });
        let nav = this.appCtrl.getActiveNav();
        if (nav && nav.getActive()) {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if (nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
            }

        }
    }
    networkType: any = []

    distributors(data) {
        this.data.type_name = []
        this.add_list = []
        this.segment_list = []
        this.data.segment = {}
        this.navParams.get('checkin_id')
        if ((this.navParams.get('order_item')) || (this.navParams.get('order_data')) || this.navParams.get('checkin_id')) {
            this.drList.push({ id: data.id, company_name: data.company_name })
            this.data.type_name = this.drList[0]
        } else {
            this.Dr_type
            this.service1.addData({ 'dr_type': data }, 'AppOrder/followupCustomer').then((result) => {
                this.drList = result['result'];
            });
        }
    }


    ionViewDidLoad() {
        this.storage.get('user_type').then((userType) => {
            if (userType == 'OFFICE') {
                this.data.networkType = 3;
                this.userType = userType
            }
        });
    }



    backAction() {
        if (this.add_list.length > 0) {
            let alert = this.alertCtrl.create({
                title: 'Are You Sure?',
                subTitle: 'Your Order Data Will Be Lost ',
                cssClass: 'alert-modal',

                buttons: [{
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.service1.presentToast('Your Data is Safe')
                    }
                },
                {
                    text: 'Yes',
                    cssClass: 'close-action-sheet',
                    handler: () => {
                        this.navCtrl.pop();
                        this.add_list = [];

                    }
                }]
            });
            alert.present();
        }
        else {
            this.navCtrl.pop();
            console.log('Array Blank');
        }
    }





    Lead_retailer_distributor: any = [];

    get_state_list(name) {

        console.log(this.data.type_name);
        this.Dist_state = this.data.type_name.state
        console.log(this.Dist_state)
    }


    onKeyUp(x) { // appending the updated value to the variable 
        console.log(x);
        if (x.key != '') {
            this.mode = 1;
        }
    }



    test(test) {
        console.log(test);

    }


    get_distributor() {
        // this.service1.show_loading();
        this.service1.addData({ 'type': 1 }, 'DealerData/get_type_list').then((result) => {
            this.distributor_list = result;

            // this.service1.dismiss();
            if (this.distributor_list.length == 1) {
                this.data.distributor_id = this.distributor_list[0]
            }
            else {
                // this.distributorSelectable.open();
            }

        });
    }

    save_orderalert(type) {
        var str

        if (this.grand_total > 20000000) {
            let alert = this.alertCtrl.create({
                title: 'Max order value reached',
                subTitle: 'Maximum order value is 2 Cr. !',
                cssClass: 'alert-modal',

                buttons: [{
                    text: 'Okay',
                    role: 'Okay',
                    handler: () => {

                    }
                },
                ]
            });
            alert.present();
            return
        }
        if (type == 'save') {
            str = 'You want to save this order as draft ?'
        }
        else {
            str = 'You want to submit this order ?'
        }
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: str,
            cssClass: 'alert-modal',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {

                }
            },
            {
                text: 'Confirm',
                cssClass: 'close-action-sheet',
                handler: () => {
                    this.save_order(type)
                }
            }]
        });
        alert.present();
    }



    goToProductPage() {
        if (this.order_data)
            this.data.order_data = this.order_data

        this.navCtrl.push(ProductsPage, { "order": true, "order_data": this.data, "cart_array": this.cart_array });



    }
    item_list: any = [];
    segment_list: any = [];

    dr_id: any = {};
    get_segment(data) {
        this.segment_list = []
        this.data.segment
        this.db.addData({}, "AppOrder/segmentList")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.segment_list = resp['result'];
                } else {
                    this.db.errorToast(resp['statusMsg'])

                }
            },
                err => {
                })
    }

    searchPorts(event: { component: IonicSelectableComponent; text: string }) {
        let text = event.text.trim().toLowerCase();
        event.component.startSearch();

        // this.portsSubscription = this.portService
        //   .getPortsAsync()
        //   .subscribe((ports) => {
        //     // Subscription will be closed when unsubscribed manually.
        //     if (this.portsSubscription.closed) {
        //       return;
        //     }

        // event.component.items = this.filterPorts(ports, text);
        // event.component.endSearch();
        //   }); 
    }
    segmentFilter: any;
    getMoreSegments(event: { component: IonicSelectableComponent; text: string }) {

        this.segmentFilter.start = this.segment_list.length;
        this.db.addData({ 'filter': this.segmentFilter }, "AppOrder/segmentList")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.segment_list = resp['result'];
                    setTimeout(() => {
                        this.segment_list = this.segment_list.concat(resp['result']);
                        event.component.items = this.segment_list
                        event.component.endInfiniteScroll();
                    }, 1000);
                } else {
                    this.db.errorToast(resp['statusMsg'])

                }
            },
                err => {
                })
    } 
    OnlyNumber(event: any) {
        const pattern = /[0-9]+/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    conditionedItemHeader: any = {}
    without_segment: boolean = false
    get_item_list(event, list, lastGst) {
        this.itemType = list
        let search = event.text
        this.conditionedItemHeader.filter = {}
        this.conditionedItemHeader.filter.start = 0
        this.conditionedItemHeader.filter.limit = 20;
        this.conditionedItemHeader.filter.order_type = 'primary';
        this.conditionedItemHeader.filter.search = search
        this.conditionedItemHeader.filter.brand = this.order_detail.brand;
        this.conditionedItemHeader.filter.dr_id = this.order_detail.dr_id;
        this.conditionedItemHeader.filter.gst = lastGst;
        this.conditionedItemHeader.filter.fixed_brand = this.fixedBrand; 
        if (list != 'blank') {

            let Segment = list
            let Index = Segment.findIndex(row => row.id == this.data.segment.id)

            this.data.segmentName = Segment[Index].category
            let GST = Segment[Index].gst
            this.ItemGST = GST
            this.conditionedItemHeader.cat_id = this.data.segment.id;
            this.without_segment = false
        } else {
            this.conditionedItemHeader.cat_id = ''
            this.without_segment = true
        }

        this.db.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.item_list = resp['result'];
                    for (let index = 0; index < this.item_list.length; index++) {
                        this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
                    }
                } else {
                    this.db.errorToast(resp['statusMsg'])
                }
            },
                err => {
                })
    }



    get_product_details(event) {
        this.data.brand = '';
        this.data.color = '';
        this.db.addData({ 'product_id': event.id, 'order_type': 'primary', 'brand': this.order_detail.brand }, "AppOrder/segmentItemsDetails")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.product_detail = resp['result'];
                    this.brandList = this.product_detail['brand'];
                    this.colorList = this.product_detail['color'];
                    if (this.brandList.length == 1) {
                        this.data.brand = this.brandList[0];
                    }
                    if (this.colorList.length == 1) {
                        this.data.color = this.colorList[0];
                    }
                } else {
                    this.db.errorToast(resp['statusMsg'])
                }
            })
    }


    itemsFilter: any;
    getMoreItems(event: { component: IonicSelectableComponent; text: string }) {

        this.conditionedItemHeader.filter.start = this.item_list.length;
        this.db.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.item_list = resp['result'];
                    for (let index = 0; index < this.item_list.length; index++) {
                        this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
                    }
                    setTimeout(() => {
                        this.item_list = this.item_list.concat(resp['result']);
                        event.component.items = this.item_list
                        event.component.endInfiniteScroll();
                    }, 1000);
                } else {
                    this.db.errorToast(resp['statusMsg'])

                }
            },
                err => {
                })
    }

    get_product_Size(dr_id, product_id) {
        console.log('ERR')
        let Feature_Api = ""
        let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id)
        if (Index != -1) {
            this.data.product_name = this.item_list[Index].product_name
            this.data.feature_apply = this.item_list[Index].feature_apply
            this.data.product_code = this.item_list[Index].product_code
        }


        this.db.addData({ 'state_name': this.Dist_state, 'dr_id': dr_id, 'category_id': this.product_detail.category_id, 'gst_percent': this.data.product_id.gst, 'product_id': this.data.product_id.id }, "AppOrder/segmentItemPriceWithoutFeatures").then(resp => {

            if (resp['statusCode'] == 200) {
                this.product_resp = true
                this.product_list = resp['result'];

                if (this.product_list.length > 0) {
                    for (let i = 0; i < this.product_list.length; i++) {
                        this.product_list[i].edit_true = false;
                    }
                }
            } else {
                this.db.errorToast(resp['statusMsg'])
                this.product_resp = false;
            }
        },
            err => {
            })
    }





    loadData(infiniteScroll) {
        var dr_id
        if (this.data && this.data.type_name)
            dr_id = this.data.type_name.id
        else
            dr_id = this.userId

        this.filter.limit = this.cart_array.length;
        this.service.post_rqst({ 'filter': this.filter, 'order': this.order, 'dr_id': dr_id, 'userId': this.userId, 'userType': this.userType }, 'Product/productList').subscribe(response => {
            if (response.products == '') {
                this.flag = 1;
            }
            else {
                setTimeout(() => {
                    this.cart_array = this.cart_array.concat(response.products);
                    if (this.order == true) {
                        for (let i = 0; i < this.cart_array.length; i++) {
                            this.cart_array[i].qty = 0;
                        }
                    }

                    infiniteScroll.complete();
                }, 1000);
            }
        });
    }

    getsizeData() {
        //   this.service1.show_loading();

        this.no_rec = false;

        this.service.post_rqst({ 'userId': this.userId }, 'Product/sizeList').subscribe((response) => {
            this.sizeList = response.sizeList;
            // this.service1.dismiss();

            if (!this.sizeList.length) {
                this.no_rec = true
            }

        }, er => {
            // this.service1.dismiss();
        });
    }
    addToList() {
        console.log(this.data);
        for (let i = 0; i < this.product_list.length; i++) {
            if (this.product_list[i]['qty'] && this.product_list[i]['net_price']) {
                let existIndex = this.add_list.findIndex(row => row.product_id == this.product_list[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color);
                if (existIndex == -1) {
                    this.product_list[i]['product_name'] = this.data.product_name;
                    this.product_list[i]['segment_id'] = this.data.segment.id;
                    this.product_list[i]['product_name'] = this.data.product_name;
                    this.product_list[i]['product_code'] = this.data.product_code;
                    this.product_list[i]['discount_amount'] = this.product_list[i]['discounted_price'];
                    this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
                    this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * (this.product_list[i]['net_price']).toFixed();
                    this.product_list[i]['gst_amount'] = ((parseFloat(this.product_list[i]['amount']) * parseFloat(this.product_detail.gst)) / 100).toFixed();
                    this.product_list[i].gst_percent = (this.product_detail.gst);
                    this.product_list[i]['brand'] = this.data.brand;
                    this.product_list[i]['color'] = this.data.color;
                    this.product_list[i].total_amount = parseFloat(this.product_list[i].gst_amount) + parseFloat(this.product_list[i].amount);
                    this.add_list.push(this.product_list[i]);
                    this.temp_add_list.push(this.product_list[i])
                }
                else {
                    this.product_list[i]['product_name'] = this.data.product_name;
                    this.product_list[i]['segment_id'] = this.data.segment.id;
                    this.product_list[i]['segment_name'] = this.data.segmentName;
                    this.product_list[i]['color'] = this.data.color;
                    this.product_list[i]['brand'] = this.data.brand;
                    this.product_list[i]['product_code'] = this.data.product_code;
                    this.product_list[i]['discount_amount'] = this.product_list[i]['discounted_price'];
                    this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
                    this.add_list[existIndex]['qty'] = parseFloat(this.add_list[existIndex]['qty']) + parseFloat(this.product_list[i]['qty']);
                    this.add_list[existIndex]['amount'] = parseFloat(this.add_list[existIndex]['amount']) + parseFloat(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
                    this.add_list[existIndex]['gst_amount'] = (parseFloat(this.add_list[existIndex]['amount']) * parseFloat(this.product_detail.gst)) / 100;
                    this.add_list[existIndex].gst_percent = parseFloat(this.product_detail.gst);
                    this.add_list[existIndex].total_amount = parseFloat(this.add_list[existIndex].gst_amount) + parseFloat(this.add_list[existIndex].amount);
                }
                console.log(this.add_list);
            }
        }
        this.total_qty = 0;
        this.netamount = 0;
        this.order_total = 0;
        this.total_gst_amount = 0;
        this.total_Order_amount = 0;
        this.order_discount = 0
        // this.total_item_discount = 0;
        for (let i = 0; i < this.add_list.length; i++) {
            // this.add_list[i].product_price =  this.add_list[i]['price']
            this.total_qty = (parseFloat(this.total_qty) + parseFloat(this.add_list[i]['qty']));
            this.netamount = parseFloat(this.netamount) + parseFloat(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
            this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
            this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
            // this.total_Order_amount = parseFloat(this.total_Order_amount) + parseFloat(this.add_list[i]['product_price']);
            this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
            this.order_discount = parseFloat(this.add_list[i].discount_amount) * parseFloat(this.add_list[i]['qty']) + parseFloat(this.order_discount);
        }
        this.total_Order_amount = parseFloat(this.total_Order_amount);
        this.order_discount = parseFloat(this.order_discount);
        this.sub_total_before_cd = parseFloat(this.order_total);
        this.cash_discount_percent = parseFloat(this.order_detail.cash_discount_percent);
        console.log(this.cash_discount_percent);
        this.cd_value = parseFloat(this.sub_total_before_cd) * parseFloat(this.cash_discount_percent) / 100;
        this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
        this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
        this.order_total = parseFloat(this.sub_total_after_cd) + parseFloat(this.ins_value)
        this.total_gst_amount = parseFloat(this.order_total) * this.product_detail.gst / 100;
        this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
        this.tcs_value = this.grand_total_before_tcs * this.order_detail.tcs_percent / 100;
        this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));
        this.product_list = [];
        this.data.brand = '';
        this.data.color = '';
        this.data.product_id = {};
        this.addToListButton = true;

    }

    DeleteItem(i) {
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: 'Your Want To Delete This Item ',
            cssClass: 'alert-modal',
            buttons: [{
                text: 'No',
                role: 'cancel',
                handler: () => {
                }
            },
            {
                text: 'Yes',
                handler: () => {
                    this.listdelete(i)
                }
            }]
        });
        alert.present();
    }
    listdelete(i) {
        this.add_list.splice(i, 1);
        this.total_qty = 0;
        this.netamount = 0;
        this.total_gst_amount = 0;
        this.order_discount = 0;
        this.total_Order_amount = 0;
        this.order_total = 0;
        // this.total_item_discount = 0;
        console.log(this.add_list);
        for (let i = 0; i < this.add_list.length; i++) {
            this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
            this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
            this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
            this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
            this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
            this.order_discount = parseFloat(this.add_list[i].discount_amount) * parseFloat(this.add_list[i]['qty']) + parseFloat(this.order_discount);
            // this.total_item_discount = parseInt(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']);
        }
        this.total_Order_amount = parseFloat(this.total_Order_amount);
        this.order_discount = parseFloat(this.order_discount);
        this.sub_total_before_cd = parseFloat(this.order_total);
        this.cash_discount_percent = parseFloat(this.order_detail.cash_discount_percent);
        this.cd_value = parseFloat(this.sub_total_before_cd) * parseFloat(this.cash_discount_percent) / 100;
        this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
        this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
        this.order_total = parseFloat(this.sub_total_after_cd) + parseFloat(this.ins_value)
        this.total_gst_amount = parseFloat(this.order_total) * this.product_detail.gst / 100;
        this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
        this.tcs_value = this.grand_total_before_tcs * this.order_detail.tcs_percent / 100;
        this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));


    }


    save_order(type) {
        this.btndisable = true;
        this.leave = 1
        this.user_data.type = this.data.networkType;
        this.user_data.order_status = 'Pending';
        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
        }

        if (this.user_data.type == "3") {
            if (!this.data.delivery_from) {
                let toast = this.toastCtrl.create({
                    message: 'Please Select Distributor!',
                    duration: 3000
                });
                toast.present();
                return;
            }
            this.user_data.distributor_id = this.data.delivery_from
        }

        this.special_discount = this.special_discount;
        this.user_data.special_discount_amount = this.spcl_dis_amt;
        this.user_data.Disctype = this.type;
        this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
        this.user_data.dr_id = this.data.type_name.id
        this.user_data.remark = this.data.remark;
        this.user_data.total_Order_amount = this.total_Order_amount;
        this.user_data.order_discount = this.order_discount;
        this.user_data.sub_total_before_cd = this.sub_total_before_cd;
        this.user_data.cash_discount_percent = this.order_detail.cash_discount_percent;
        this.user_data.tcs_percent = this.order_detail.tcs_percent;
        this.user_data.gst_percent = this.product_detail.gst;
        this.user_data.cd_value = this.cd_value;
        this.user_data.sub_total_after_cd = this.sub_total_after_cd;
        this.user_data.ins_value = this.ins_value;
        this.user_data.order_total = this.order_total;
        this.user_data.total_gst_amount = this.total_gst_amount;
        this.user_data.grand_total_before_tcs = this.grand_total_before_tcs;
        this.user_data.tcs_value = this.tcs_value;
        this.user_data.order_grand_total = this.order_grand_total;

        if (this.data.distributor_id && this.data.delivery_from)
            this.user_data.distributor_id = this.data.delivery_from

        var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount, 'special_discount': this.special_discount, 'special_discount_amount': this.spcl_dis_amt }

        this.service1.addData({ "cart_data": this.add_list, "user_data": this.user_data, "orderId": this.order_id }, "AppOrder/primaryOrderAddItem").then(resp => {
            if (resp['statusCode'] == 200) {
                this.service1.successToast(resp['statusMsg'])

                console.log(this.user_data.distributor_id);


                this.navCtrl.popTo(PrimaryOrderDetailPage);

            } else {
                this.service1.errorToast(resp['statusMsg'])
            }
        })


    }


    editRate(id, index) {
        this.active[index] = Object.assign({ 'qty': "1" });
        this.showSave = true;
        this.idMode = id;
        // this.editProductID = id;
        // this.showError=true;
        this.product_list[index].edit_true = false;
    }


    updateRate(editedRate, index) {

        this.idMode = 0;
        this.active = {};
        this.product_list[index].edit_true = true;
    }

}
