import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { PrimaryOrderMainPage } from '../primary-order-main/primary-order-main';

@IonicPage()
@Component({
    selector: 'page-primary-order-add',
    templateUrl: 'primary-order-add.html',
})
export class PrimaryOrderAddPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('category') categorySelectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

    data: any = {};
    form: any = {};
    user_data: any = {};
    btndisable: boolean = false;
    order_data: any = {};
    special_discount: any = 0;
    type: any = '';
    cart_array: any = []
    order_item: any = [];
    userType: any;
    showSave = false;
    showEdit = true;
    active: any = {};
    addToListButton: boolean = true;
    ItemGST: any = '';
    order_total: any = '';
    total_Order_amount: any = ''
    Dist_state = ''
    Dr_type = ''
    color_list: any = [];
    brand_list: any = [];
    product: any = {};
    show_price: any = false;
    SpecialDiscountLable: any = '';
    cash_discount_percent: any = 0;
    cd_value: any = 0;
    ins_value: any = 0;
    tcs_value: any = 0;
    leave: any = 0;
    temp_product_array: any = [];
    distributor_list: any = [];
    grand_amt: any = {};
    sub_total: any = 0;
    dis_amt: any = 0;
    gst_amount: any = 0;
    net_total: any = 0;
    spcl_dis_amt: any = 0
    grand_total: any = 0;
    order_discount: any = 0;
    sub_total_before_cd: any = 0;
    sub_total_after_cd: any = 0;
    grand_total_before_tcs: any = 0;
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
    itemType: any;
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
    total_gst_amount: any = 0;
    order_grand_total: any = 0;
    drList: any = [];
    product_detail: any = {};
    brandList: any = [];
    colorList: any = [];
    btnDisableSave: boolean = false;
    btnDisableDraft: boolean = false;


    constructor(
        public navCtrl: NavController,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController
        , public service: MyserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        public appCtrl: App) {
        this.order_item = this.navParams.get('order_item')
        this.order_data = this.navParams.get('order_data')
        this.drtype = this.navParams['data'].type || '';
        this.checkin_id = this.navParams.get('checkin_id')
        setTimeout(() => {
            this.get_item_list('', 'blank');
        }, 2000);

    }
    ionViewDidEnter() {
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            this.disableSelectFromCheckin = true;
            this.drtype = this.navParams.get('order_type');
            this.data.networkType = this.navParams.get('dr_type');
            this.type = this.navParams.get('dr_type');
            this.data.id = this.navParams.get('id');
            this.data.company_name = this.navParams.get('dr_name');
            this.data.display_name = this.navParams.get('display_name');
            this.distributors(this.data)
        }

        this.navBar.backButtonClick = () => {
            this.backAction()
        };
        // this.platform.registerBackButtonAction(() => {
        //     this.backAction()
        // });
        let nav = this.appCtrl.getActiveNav();
        if (nav && nav.getActive()) {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if (nav.getPrevious() && nav.getPrevious().name) {
                previuosView = nav.getPrevious().name;
            }
        }
        this.data.variableDiscount = 0


    }

    networkType: any = []
    distributors(data, event: any = '') {
        this.data.type_name = []
        this.add_list = []
        this.data.segment = {}
        if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {
            this.service.addData({ 'dr_type': data.networkType, 'checkin_dr_id': this.navParams.get('id'), 'master_search': event.text }, 'AppOrder/followupCustomer').then((result) => {
                let TemData
                TemData = result['result'];
                let Index = TemData.findIndex(row => row.id == data.id);

                if (Index != -1) {
                    this.drList.push({ id: TemData[Index].id, company_name: TemData[Index].company_name, display_name: TemData[Index].display_name })
                    this.data.type_name = TemData[Index];
                }
            });
        } else {
            this.Dr_type
            this.service.addData({ 'dr_type': data, 'master_search': event.text }, 'AppOrder/followupCustomer').then((result) => {
                if (result['statusCode'] == 200) {
                    this.drList = result['result'];
                } else {
                    this.service.errorToast(result['statusMsg'])
                }
            });
        }
    }


    ionViewDidLoad() {
        this.storage.get('user_type').then((userType) => {
            if (userType == 'OFFICE') {
                this.data.networkType = 3;
                // this.get_network_list(this.data.networkType)
                this.userType = userType
                //   this.get_network_list(1)
            }
        });
    }



    backAction() {

        if (this.add_list.length > 0) {
            let alert = this.alertCtrl.create({
                title: 'Are You Sure?',
                subTitle: 'Your Order Data Will Be Lost',
                cssClass: 'alert-modal',

                buttons: [{
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        this.service.presentToast('Your Data is Safe')
                    }
                },
                {
                    text: 'Yes',
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
        }
    }



    Lead_retailer_distributor: any = [];

    get_state_list(name) {
        this.Dist_state = this.data.type_name.state
    }

    get_distributor() {
        // this.service.show_loading();
        this.service.addData({ 'type': 1 }, 'DealerData/get_type_list').then((result) => {
            this.distributor_list = result;

            // this.service.dismiss();
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
        if (type == 'draft') {
            str = 'You want to save this order as draft ?'
            this.btnDisableDraft = true;
        }
        else {
            str = 'You want to submit this order ?'
            this.btnDisableSave = true;
        }
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: str,
            cssClass: 'alert-modal',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.btnDisableDraft = false;
                    this.btnDisableSave = false;
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

    dr_id: any = {};


    searchPorts(event) {
        // let text = event.text.trim().toLowerCase();
        // event.component.startSearch();

        // this.conditionedItemHeader.filter = {}
        // this.conditionedItemHeader.filter.start = 0
        // this.conditionedItemHeader.filter.limit = 20
        // let data = {}

        // this.service.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
        //     .then(resp => {
        //         if (resp['statusCode'] == 200) {
        //             this.item_list = resp['result'];
        //             //    event.component.items = this.filterPorts(ports, text);
        //                event.component.endSearch();
        //         } else {
        //             this.service.errorToast(resp['statusMsg'])
        //         }
        //     },
        //         err => {
        //         })

        //     // 
        // //   }); 
    }
    segmentFilter: any;

    OnlyNumber(event: any) {
        const pattern = /[0-9]+/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
    }
    conditionedItemHeader: any = {}
    without_segment: boolean = false
    get_item_list(event, list) {
        this.itemType = list
        let search = event.text

        this.conditionedItemHeader.filter = {}
        this.conditionedItemHeader.filter.start = 0
        this.conditionedItemHeader.filter.limit = 20;
        this.conditionedItemHeader.filter.order_type = 'primary';
        this.conditionedItemHeader.filter.search = search;
        if (this.add_list.length > 0) {
            this.conditionedItemHeader.filter.gst = this.product_detail.gst
        }
        if (this.add_list.length > 0) {
            this.conditionedItemHeader.filter.fixed_brand = this.brandList;
        }

        if (this.drList.length > 0) {
            let newIndex = this.drList.findIndex(row => row.id == this.data.type_name.id);
            this.conditionedItemHeader.filter.brand = this.drList[newIndex]['brand'] || this.data.type_name.brand;
            this.conditionedItemHeader.filter.dr_id = this.drList[newIndex]['id'];

        }

        let data = {}
        // if(list != 'blank'){

        // let Segment = list
        // let Index = Segment.findIndex(row => row.id == this.data.segment.id)

        // this.data.segmentName = Segment[Index].category
        // let GST = Segment[Index].gst
        // this.product_detail.gst = GST
        // this.conditionedItemHeader.cat_id = this.data.segment.id
        // this.without_segment =  false
        // }else{
        //     this.conditionedItemHeader.cat_id = ''
        //     this.without_segment =  true
        // }
        this.service.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
            .then(resp => {
                if (resp['statusCode'] == 200) {

                    this.item_list = resp['result'];
                    for (let index = 0; index < this.item_list.length; index++) {
                        this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
                    }
                } else {
                    this.service.errorToast(resp['statusMsg']);
                }

            })
    }



    get_product_details(event) {
        this.data.brand = '';
        this.data.color = '';
        this.service.addData({ 'product_id': event.id, 'order_type': 'primary', 'brand': this.data.type_name.brand }, "AppOrder/segmentItemsDetails")
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
                    this.service.errorToast(resp['statusMsg'])
                }
            })
    }

    itemsFilter: any;
    getMoreItems(event: { component: IonicSelectableComponent; text: string }) {

        this.conditionedItemHeader.filter.start = this.item_list.length;
        this.service.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
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
                    this.service.errorToast(resp['statusMsg'])

                }
            },
                err => {
                })
    }

    get_product_Size(dr_id, product_id) {
        let Feature_Api = ""
        let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id)
        if (Index != -1) {
            this.data.product_name = this.item_list[Index].product_name
            this.data.feature_apply = this.item_list[Index].feature_apply
            this.data.product_code = this.item_list[Index].product_code
        }

        this.service.addData({ 'state_name': this.Dist_state, 'dr_id': dr_id, 'category_id': this.product_detail.category_id, 'gst_percent': this.data.product_id.gst, 'product_id': this.data.product_id.id }, "AppOrder/segmentItemPriceWithoutFeatures")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.product_resp = true
                    this.product_list = resp['result'];

                    if (this.product_list.length > 0) {
                        for (let i = 0; i < this.product_list.length; i++) {
                            this.product_list[i].edit_true = false;
                        }
                    }
                } else {
                    this.service.errorToast(resp['statusMsg'])
                    this.product_resp = false
                }
            },
                err => {
                })
    }



    addToList() {

        for (let i = 0; i < this.product_list.length; i++) {
            if (this.product_list[i]['qty']) {
                let existIndex
                existIndex = this.add_list.findIndex(row => row.product_id == this.product_list[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color);


                if (existIndex == -1) {
                    this.product_list[i]['product_name'] = this.data.product_name;
                    this.product_list[i]['segment_id'] = this.data.segment.id;
                    this.product_list[i]['brand'] = this.data.brand;
                    this.product_list[i]['color'] = this.data.color;
                    this.product_list[i]['segment_name'] = this.data.segmentName;
                    this.product_list[i]['product_code'] = this.data.product_code;
                    this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * (this.product_list[i]['net_price']);
                    this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_detail.gst)) / 100);
                    this.product_list[i]['gst_percent'] = (this.product_detail.gst);
                    this.product_list[i]['total_amount'] = parseFloat(this.product_list[i].gst_amount) + parseFloat(this.product_list[i].amount);
                    this.add_list.push(this.product_list[i]);
                    this.temp_add_list.push(this.product_list[i])

                }
                else {

                    this.product_list[i]['product_name'] = this.data.product_name;
                    this.product_list[i]['segment_id'] = this.data.segment.id;
                    this.product_list[i]['segment_name'] = this.data.segmentName;
                    this.product_list[i]['product_code'] = this.data.product_code;
                    this.product_list[i]['product_code'] = this.data.product_code;
                    this.product_list[i]['brand'] = this.data.brand;
                    this.product_list[i]['color'] = this.data.color;
                    this.add_list[existIndex]['qty'] = parseInt(this.add_list[existIndex]['qty']) + parseInt(this.product_list[i]['qty']);
                    this.add_list[existIndex]['amount'] = parseFloat(this.add_list[existIndex]['amount']) + parseInt(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
                    this.add_list[existIndex]['gst_amount'] = ((this.add_list[existIndex]['amount']) * (this.product_detail.gst)) / 100;

                    // this.add_list[existIndex].total_item_discount = parseInt(this.product_list[i].discounted_price) * parseInt(this.product_list[i]['qty'])
                    this.add_list[existIndex].gst_percent = (this.product_detail.gst);
                    this.add_list[existIndex].total_amount = parseFloat(this.add_list[existIndex].gst_amount) + parseFloat(this.add_list[existIndex].amount);

                }
            }

        }

        this.total_qty = 0;
        this.netamount = 0;
        this.total_gst_amount = 0;
        this.order_discount = 0;
        this.total_Order_amount = 0;
        this.order_total = 0;

        for (let i = 0; i < this.add_list.length; i++) {
            this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
            this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
            this.order_discount = parseFloat(this.add_list[i].discounted_price) * parseFloat(this.add_list[i]['qty']) + parseFloat(this.order_discount);
            this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
            this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
            this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
        }

        this.total_Order_amount = parseFloat(this.total_Order_amount);
        this.order_discount = parseFloat(this.order_discount);
        this.sub_total_before_cd = parseFloat(this.order_total);
        this.cash_discount_percent = parseFloat(this.data.type_name.cash_discount_percentage);
        this.cd_value = parseFloat(this.sub_total_before_cd) * this.cash_discount_percent / 100;
        this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
        this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
        this.order_total = parseFloat(this.sub_total_after_cd) + parseFloat(this.ins_value)
        this.total_gst_amount = parseFloat(this.order_total) * parseFloat(this.product_detail.gst) / 100;
        this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
        this.tcs_value = parseFloat(this.grand_total_before_tcs) * parseFloat(this.data.type_name.tcs_percentage) / 100;
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

        for (let i = 0; i < this.add_list.length; i++) {
            this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
            this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
            this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
            this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
            this.total_gst_amount = parseInt(this.add_list[i].gst_amount) + parseInt(this.total_gst_amount);
            this.order_discount = parseInt(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']) + parseInt(this.order_discount);
        }

        this.total_Order_amount = this.total_Order_amount;
        this.order_discount = this.order_discount;
        this.sub_total_before_cd = this.order_total;
        this.cash_discount_percent = this.data.type_name.cash_discount_percentage;
        console.log(this.cash_discount_percent);
        this.cd_value = this.sub_total_before_cd * this.cash_discount_percent / 100;
        console.log(this.cd_value);
        this.sub_total_after_cd = this.sub_total_before_cd - (this.cd_value);
        console.log(this.sub_total_after_cd);

        this.ins_value = this.sub_total_after_cd * 0.06 / 100;

        this.order_total = this.sub_total_after_cd + (this.ins_value)

        this.total_gst_amount = this.order_total * this.product_detail.gst / 100;

        this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));

        this.tcs_value = this.grand_total_before_tcs * this.data.type_name.tcs_percentage / 100;

        this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));


    }


    save_order(type) {
        this.btndisable = true;

        this.leave = 1
        this.user_data.type = this.data.networkType;

        if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
            this.data.delivery_from = this.data.delivery_from.id;
        } else {
            this.data.delivery_from = this.data['type_name'].id;
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
        this.user_data.cash_discount_percent = this.cash_discount_percent;
        this.user_data.tcs_percent = this.data.type_name.tcs_percentage;

        this.user_data.gst_percent = this.product_detail.gst;
        this.user_data.cd_value = this.cd_value;
        this.user_data.sub_total_after_cd = this.sub_total_after_cd;
        this.user_data.ins_value = this.ins_value;
        this.user_data.order_total = this.order_total;
        this.user_data.total_gst_amount = this.total_gst_amount;
        this.user_data.grand_total_before_tcs = this.grand_total_before_tcs;
        this.user_data.tcs_value = this.tcs_value;
        this.user_data.order_grand_total = this.order_grand_total;


        this.user_data.product_code = this.data.product_code
        if (this.data.distributor_id && this.data.delivery_from)
            this.user_data.distributor_id = this.data.delivery_from

        // var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.order_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount, 'special_discount': this.special_discount, 'special_discount_amount': this.spcl_dis_amt }

        this.service.addData({ "cart_data": this.add_list, "user_data": this.user_data, "checkin_id": this.checkin_id }, "AppOrder/primaryOrdersAdd").then(resp => {
            if (resp['statusCode'] == 200) {
                var toastString = ''
                if (this.user_data.order_status == 'Draft') {
                    this.service.successToast(resp['statusMsg'])
                    this.btnDisableDraft = false;
                    this.btnDisableSave = false;
                }
                else {
                    this.service.successToast(resp['statusMsg'])
                    this.btnDisableDraft = false;
                    this.btnDisableSave = false;
                }

                this.navCtrl.popTo(PrimaryOrderMainPage)

            } else {
                this.service.errorToast(resp['statusMsg']);
                this.btnDisableDraft = false;
                this.btnDisableSave = false;
            }
        },
            error => {
                this.btndisable = false;
                this.btnDisableDraft = false;
                this.btnDisableSave = false;
                this.service.Error_msg(error);
                this.service.dismiss();
            })



    }


    editRate(id, index) {
        this.active[index] = Object.assign({ 'qty': "1" });
        this.showSave = true;
        this.idMode = id;
        this.product_list[index].edit_true = false;
    }


    updateRate(editedRate, index) {
        this.idMode = 0;
        this.active = {};
        this.product_list[index].edit_true = true;
    }

}
