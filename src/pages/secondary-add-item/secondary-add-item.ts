import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { OrderListPage } from '../order-list/order-list';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartDetailPage } from '../cart-detail/cart-detail';
import { ViewChild } from '@angular/core';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SecondaryOrderMainPage } from '../secondary-order-main/secondary-order-main';
import { SecondaryOrderDetailPage } from '../secondary-order-detail/secondary-order-detail';



@IonicPage()
@Component({
  selector: 'page-secondary-add-item',
  templateUrl: 'secondary-add-item.html',
})
export class SecondaryAddItemPage {
  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
  @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  drList: any = [];
  brandList: any = [];
  colorList: any = [];
  total_Order_amount: any = '';
  product_detail: any = {};
  data: any = {};
  form: any = {};
  order_id: any = ''
  user_data: any = {};
  disable_marka: boolean = false;
  addToListButton: boolean = true;
  btndisable: boolean = false;
  order_data: any = {};
  type: any = '';
  order_total: any = '';
  order_grand_total: any = '';
  cart_array: any = []
  order_item: any = [];
  fixedBrand: any = [];
  Distributor_list: any = [];
  checkinData: any = {};
  userType: any;
  itemType: any;
  showSave = false;
  showEdit = true;
  active: any = {};
  ItemGST: any = '';
  Dist_state = ''
  Dr_type = ''
  color_list: any = [];
  brand_list: any = [];
  product: any = {};
  SpecialDiscountLable: any = ''
  leave: any = 0;
  distributor_list: any = [];
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  spcl_dis_amt: any = 0
  grand_total: any = 0;
  order_gst: any = 0;
  order_discount: any = 0;
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
  drtype: any;
  checkin_id: any = 0;
  idMode: any;
  retailerID: any;
  tmpdata: any = {};
  disableSelect: boolean = false;
  disableSelectFromCheckin: boolean = false;
  add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  total_discount_amount: any = 0;
  new_grand_total: any = 0;
  btnDisableSave: boolean = false;
  btnDisableDraft: boolean = false;
  lastdiscountPercent: any = 0;
  lastGstPercent: any = 0;


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
    public db: MyserviceProvider,
    public appCtrl: App) {
    this.data.gst_type = 'Gst Paid';
    this.drtype = this.navParams['data'].type;
    console.log(this.navParams);
    if (this.navParams.get('order_data') && this.navParams.get('order_item')) {
      this.disableSelect = true;
      this.retailerID = this.navParams.get('order_data')['id'];
      this.tmpdata.id = this.navParams.get('order_data')['id']
      this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
      this.tmpdata.dr_id = this.navParams.get('order_data')['dr_id'];
      this.tmpdata.dr_name = this.navParams.get('order_data')['dist_company_name']

      this.distributors(this.tmpdata);
      this.get_distributor_list(this.tmpdata)
    } else {
      this.distributors('hello')
    }
    if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')) {
      if (this.navParams.get('checkin_id')) {
        this.disableSelectFromCheckin = true;
      }
      this.drtype = this.navParams.get('order_type');
      this.data.networkType = this.navParams.get('dr_type');
      this.data.company_name = this.navParams.get('dr_name');
      this.data.id = this.navParams.get('id');
      // this.get_distributor_list(this.data.type_name);
      this.distributors(this.data);
    }

    if (this.navParams.get('for_order')) {
      this.checkinData = this.navParams.get('for_order')
      this.data.networkType = this.checkinData.dr_type;
    }

    this.order_data = this.navParams.get("order_data");
    this.order_item = this.navParams.get("order_item");

    if (this.order_data && this.order_item) {
      for (let i = 0; i < this.order_item.length; i++) {
        this.order_item[i].total_amount = this.order_item[i].total_amount
        this.order_item[i].amount = this.order_item[i].sub_total;
      }
      this.total_qty = parseFloat(this.order_data.total_order_qty);
      this.total_gst_amount = parseFloat(this.order_data.order_gst);
      this.total_Order_amount = parseFloat(this.order_data.order_total);
      this.order_discount = parseFloat(this.order_data.order_discount);
      this.order_total = parseFloat(this.order_data.order_grand_total);
      this.total_gst_amount = parseFloat(this.order_data.order_gst);
      this.new_grand_total = parseFloat(this.order_data.order_grand_total);
    }
    if (this.order_item && this.order_item.length > 0) {
      this.service.addData({ "Id": this.navParams.get('order_data')['id'] }, "AppOrder/secondaryOrderDetail").then((result) => {
        this.add_list = result['result']['item_details'];
        this.order_id = this.navParams.get('order_data')['id']
        for (let i = 0; i < this.add_list.length; i++) {
          this.add_list[i].product_price = this.add_list[i]['price']
          this.add_list[i].discounted_price = this.add_list[i]['discount_amount']
          this.add_list[i].dr_disc = this.add_list[i]['discount_percent']
          // let index = this.add_list.findIndex(d => parseInt(d.discount_percent) > 0);
          this.lastdiscountPercent = this.add_list[i]['discount_percent'];
          this.lastGstPercent = this.add_list[i]['gst_percent'];
        }
        this.fixedBrand.push(this.add_list[0]['brand']);
        this.get_item_list('', 'blank', this.lastGstPercent);


      })
    }


    if (this.navParams.get("data")) {
      this.data = this.navParams.get("data");
      if (this.data.from_product == true) {
        this.cart_array = this.navParams.get("cart_array");
        if (this.data.order_data) {
          this.order_data = this.data.order_data;
        }

        this.cart_array.map((item) => {
          this.product = item
        })

      }

    }

    if (this.order_data && this.order_data.order_id) {

      this.user_data = this.order_data;
    }

    this.events.subscribe(('AddOrderBackAction'), (data) => {
      this.backAction()

    })

  }
  networkType: any = []
  getNetworkType() {
    this.service.addData('', "Dashboard/allNetworkModule").then((result => {
      this.networkType = result['modules'];
    }))
  }
  distributors(data) {
    if (this.navParams.get('order_item') && this.navParams.get('order_data')) {
      this.drList.push({ id: data.id, company_name: data.company_name })
      this.data.type_name = this.drList[0]
    } else if (this.navParams.get('checkin_id')) {
      this.service.addData({ 'dr_type': '3' }, 'AppOrder/followupCustomer').then((result) => {
        this.drList = result['result'];
        let Index = this.drList.findIndex(row => row.id == this.retailerID)
        if (Index != -1) {
          this.data.type_name = this.drList[Index]
          this.get_distributor_list('data')
        } else {
        }

      });

    } else {
      this.Dr_type
      this.service.addData({ 'dr_type': '3' }, 'AppOrder/followupCustomer').then((result) => {
        this.drList = result['result'];
      });
    }
  }


  get_distributor_list(name) {

    // this.data.type_name.distributor = []
    if (this.navParams.get('order_item') && this.navParams.get('order_data')) {
      this.Distributor_list.push({ id: name.dr_id, company_name: name.dr_name })
      this.data.distributor_id = this.Distributor_list[0]
    } else {
      this.service.addData({ 'dealer_id': name.id }, 'AppOrder/getAssignDistributor').then((result) => {
        this.drList = result['result'];
        if (result['statusCode'] == 200) {
          this.Distributor_list = result['distributor_arr']
        } else {
          this.service.errorToast(result['statusMsg'])
        }
      })
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

  ionViewDidEnter() {

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

  backAction() {

    if (this.add_list.length > 0) {
      let alert = this.alertCtrl.create({
        title: 'Are You Sure?',
        subTitle: 'Your Order Data Will Be Lost ',
        cssClass: 'alert-modal',

        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.service.presentToast('Your Data is Safe')
          }
        },
        {
          text: 'Confirm',
          cssClass: 'close-action-sheet',
          handler: () => {
            this.navCtrl.pop();
          }
        }]
      });
      alert.present();
    }
    else {
      this.navCtrl.pop();
    }
  }

  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  MobileNumber1(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  Lead_retailer_distributor: any = [];
  get_state_list(name) {
    this.Dist_state = this.data.type_name.state
  }


  onKeyUp(x) { // appending the updated value to the variable 
    if (x.key != '') {
      this.mode = 1;
    }
  }



  item_list: any = [];
  segment_list: any = [];

  dr_id: any = {};
  get_segment(data) {
    this.segment_list = []
    this.data.segment
    this.service.addData({}, "AppOrder/segmentList")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.segment_list = resp['result'];
        } else {
          this.service.errorToast(resp['statusMsg'])

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
    this.service.addData({ 'filter': this.segmentFilter }, "AppOrder/segmentList")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.segment_list = resp['result'];

          for (let i = 0; i < this.segment_list.length; i++) {
            this.segment_list[i]['discounted_price'] = this.segment_list[i]['discounted_price']

          }

          setTimeout(() => {
            this.segment_list = this.segment_list.concat(resp['result']);
            event.component.items = this.segment_list
            event.component.endInfiniteScroll();
          }, 1000);
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      },
        err => {
        })
  }
  OnlyNumber(event: any) {
    const pattern = /[0-9]+/;
    let inputChar = String.fromCharCode(event.charCode);
  }
  conditionedItemHeader: any = {}
  without_segment: boolean = false
  get_item_list(event, list, lastGst) {
    this.itemType = list
    let search = event.text
    this.conditionedItemHeader.filter = {}
    this.conditionedItemHeader.filter.start = 0
    this.conditionedItemHeader.filter.limit = 20
    this.conditionedItemHeader.filter.search = search;
    this.conditionedItemHeader.filter.gst = lastGst;
    this.conditionedItemHeader.filter.fixed_brand = this.fixedBrand;
    let data = {}
    if (list != 'blank') {

      let Segment = list
      let Index = Segment.findIndex(row => row.id == this.data.segment.id)

      this.data.segmentName = Segment[Index].category
      let GST = Segment[Index].gst
      this.ItemGST = GST
      this.conditionedItemHeader.cat_id = this.data.segment.id
      this.without_segment = false
    } else {
      this.conditionedItemHeader.cat_id = ''
      this.without_segment = true
    }

    this.service.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          this.item_list = resp['result'];
          for (let index = 0; index < this.item_list.length; index++) {
            this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
          }
        } else {
          this.service.errorToast(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  itemsFilter: any;
  getMoreItems(event: { component: IonicSelectableComponent; text: string }) {

    this.conditionedItemHeader.filter.start = this.item_list.length;
    this.service.addData(this.conditionedItemHeader, "AppOrder/segmentItems")
      .then(resp => {
        if (resp['statusCode'] == 200) {
          // this.item_list = resp['result'];
          this.item_list = this.item_list.concat(resp['result']);
          for (let index = 0; index < this.item_list.length; index++) {
            this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
          }
          setTimeout(() => {
            console.log(this.item_list);
            event.component.items = this.item_list;
            console.log(event.component);
            event.component.endInfiniteScroll();
          }, 1000);
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      },
        err => {
        })
  }



  get_product_details(event) {
    this.data.brand = '';
    this.data.color = '';
    this.service.addData({ 'product_id': event.id, 'brand': this.order_data.brand, 'order_type': 'secondary' }, "AppOrder/segmentItemsDetails")
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




  async changeDiscount(dr_id, product_id, type, discountValue) {
    if (discountValue == 0) {
      discountValue == '';
    }

    let alert = await this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You Want To Change Discount ?',
      cssClass: 'alert-modal',
      inputs: [
        {
          name: 'discountValue',
          placeholder: 'Enter Discount..',
          type: 'number',
          min: 0,
          max: 100,
          value: discountValue,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.data.dr_disc = Math.abs(data.discountValue);
            this.lastdiscountPercent = Math.abs(data.discountValue);
            if (this.data.dr_disc > 0) {
              this.get_product_Size(dr_id, product_id, type, data.discountValue);
            } else {
              this.service.errorToast("Please Update Discount Above Greater Than 0");
            }
          }
        }
      ]
    });
    await alert.present();
  }
  setPrice: any;
  async changePrice(dr_id, product_id, type, set_price) {
    this.setPrice = set_price;
    let productPrice = '';

    let alert = await this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'You Want To Change Price ?',
      cssClass: 'alert-modal',
      inputs: [
        {
          name: 'productPrice',
          placeholder: 'Enter Price..',
          type: 'number',
          min: 0,
          max: 100,
          value: productPrice,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.data.productPrice = Math.abs(data.productPrice);

            if (set_price < this.data.productPrice) {
              this.get_product_Size(dr_id, product_id, type, data.productPrice);
            }
            else {
              this.service.errorToast("Price cannot be less than Net Price ₹" + set_price);
            }


          }
        }
      ]
    });
    await alert.present();
  }

  get_product_Size(dr_id, product_id, type, discountValue) {

    console.log(this.data.product_id);



    let Feature_Api = ""
    let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id)
    if (Index != -1) {
      this.data.product_name = this.item_list[Index].product_name
      this.data.feature_apply = this.item_list[Index].feature_apply
      this.data.product_code = this.item_list[Index].product_code
    }

    let header

    if (type == 'listInput') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': this.navParams.get('order_data')['dr_id'], 'product_id': this.data.product_id.id, 'input_discount': this.lastdiscountPercent, 'gst_type': this.data.gst_type, 'category_id': this.product_detail.category_id, 'gst_percent': this.data.product_id.gst }
    }
    if (type == 'addPrice') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': this.navParams.get('order_data')['dr_id'], 'input_discount': 0, 'input_price': this.data.productPrice, 'product_id': this.data.product_id.id, 'category_id': this.product_detail.category_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_id.gst }
    }
    if (type == 'addDiscount') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'input_discount': this.lastdiscountPercent, 'dr_id': this.navParams.get('order_data')['dr_id'], 'product_id': this.data.product_id.id, 'gst_type': this.data.gst_type, 'category_id': this.product_detail.category_id, 'gst_percent': this.data.product_id.gst }
    }

    this.service.addData(header, "AppOrder/segmentItemPriceWithoutFeatures")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.product_resp = true
          this.product_list = resp['result'];

          if (this.product_list.length > 0) {
            for (let i = 0; i < this.product_list.length; i++) {
              this.product_list[i].edit_true = false;
            }
          }
          this.addToListButton = true;

        } else {
          this.service.errorToast(resp['statusMsg'])
          this.product_resp = false
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
    this.service.addData({ 'filter': this.filter, 'order': this.order, 'dr_id': dr_id, 'userId': this.userId, 'userType': this.userType }, 'Product/productList').then(response => {
      if (response['products'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.cart_array = this.cart_array.concat(response['products']);
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
    //   this.service.show_loading();

    this.no_rec = false;
    this.service.addData({ 'userId': this.userId }, 'Product/sizeList').then((response) => {
      this.sizeList = response['sizeList'];
      this.service.dismiss();

      if (!this.sizeList.length) {
        this.no_rec = true
      }

    }, er => {
      // this.service.dismiss();
    });
  }


  addToList() {
    for (let i = 0; i < this.product_list.length; i++) {
      if (this.product_list[i]['qty'] && this.product_list[i]['product_price']) {
        let existIndex = this.add_list.findIndex(row => (row.product_id == this.product_list[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color));
        if (existIndex != -1) {
          this.add_list.splice(existIndex, 1)
        }
        this.product_list[i]['product_name'] = this.data.product_name;
        this.product_list[i]['product_code'] = this.data.product_code;
        this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
        this.product_list[i]['color'] = this.data.color;
        this.product_list[i]['brand'] = this.data.brand;
        this.product_list[i]['discounted_price'] = parseFloat(this.product_list[i]['discounted_price']);
        this.product_list[i]['discount_amount'] = parseFloat(this.product_list[i]['discounted_price']) * parseFloat(this.product_list[i]['qty']);

        if (this.data.gst_type == 'Gst Paid') {
          this.product_list[i]['gst_amount'] = parseFloat(this.product_list[i]['amount']) - ((((this.product_list[i]['amount'] * 100))) / (parseFloat(this.product_list[i]['gst_percent'] + 100)));
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
          this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
          this.add_list.push(this.product_list[i]);
        }
        if (this.data.gst_type == 'Gst Extra') {
          this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_list[i]['gst_percent'])) / 100);
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = parseFloat(this.product_list[i]['gst_amount']) + (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
          this.product_list[i]['discount_percent'] = this.product_list[i]['dr_disc'];
          this.add_list.push(this.product_list[i]);
        }
      }

    }

    this.total_qty = 0;
    this.netamount = 0;
    this.order_total = 0;
    this.total_gst_amount = 0;
    this.total_Order_amount = 0;
    this.order_discount = 0;


    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty += parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.order_discount += parseFloat(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
    }
    this.total_gst_amount = parseFloat(this.total_gst_amount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;
    this.order_total = this.order_total;
    this.order_discount = this.order_discount;
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.netamount) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.netamount)

    }
    this.data.brand = '';
    this.data.color = '';
    this.product_list = [];
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
    this.order_total = 0;
    this.order_discount = 0;
    this.new_grand_total = 0;
    this.total_Order_amount = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['product_price']);
      this.order_discount += parseFloat(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = this.add_list[i].gst_amount + this.total_gst_amount;
      this.order_total += parseFloat(this.add_list[i]['amount']);

    }
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.netamount) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.netamount)

    }
    this.total_qty = parseInt(this.total_qty);
    this.netamount = parseFloat(this.netamount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;

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

  save_order(type) {


    this.btndisable = true;
    this.leave = 1
    this.user_data.type = this.data.networkType;
    if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name'].assign_distributor_id;
    }
    this.user_data.order_discount = this.order_discount;
    this.user_data.special_discount_amount = this.spcl_dis_amt;
    this.user_data.Disctype = this.type;
    this.user_data.gst_type = this.data.gst_type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.data.type_name.id
    this.user_data.distributor_id = this.data.distributor_id.id
    this.user_data.remark = this.data.remark
    if (this.data.distributor_id && this.data.delivery_from)
      this.user_data.distributor_id = this.data.delivery_from

    var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount }

    if (type == 'draft') {
      this.btnDisableDraft = true;
    }
    if (type == 'submit') {
      this.btnDisableSave = true;
    }
    this.service.addData({ "cart_data": this.add_list, "user_data": this.user_data, "orderId": this.order_id }, "AppOrder/secondaryOrderAddItem").then(resp => {
      if (resp['statusCode'] == 200) {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        var toastString = ''
        this.service.successToast(resp['statusMsg'])
        if (this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')) {
          this.navCtrl.pop();
        }
        else {
          this.navCtrl.popTo(SecondaryOrderDetailPage)
        }

        this.service.presentToast(toastString)
      } else {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        this.service.successToast(resp['statusMsg'])
      }
    }, error => {
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

