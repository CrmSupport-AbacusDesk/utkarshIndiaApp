import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../providers/myservice/myservice';
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
  selector: 'page-secondary-order-add',
  templateUrl: 'secondary-order-add.html',
})
export class SecondaryOrderAddPage {
  @ViewChild(Navbar) navBar: Navbar;

  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
  @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

  distributorSelected: any = false
  data: any = {};
  form: any = {};
  user_data: any = {};
  btndisable: boolean = false;
  distributorSelect: boolean = false;
  disabledistFromCheckin: boolean = false;
  order_data: any = {};
  type: any = '';
  total_Order_amount: any = '';
  cart_array: any = []
  OrderItem: any = [];
  order_discount: any = 0;
  Distributor_list: any = [];
  checkinData: any = {};
  userType: any;
  itemType: any;
  prod_cat_list;
  showSave = false;
  showEdit = true;
  active: any = {};
  addToListButton: boolean = true;
  ItemGST: any = '';
  Dist_state = ''
  Dr_type = ''
  color_list: any = [];
  brand_list: any = [];
  product: any = {};
  show_price: any = false;
  SpecialDiscountLable: any = ''
  order_total: any = ''
  leave: any = 0;
  temp_product_array: any = [];
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  grand_total: any = 0;
  from_product = false
  filter: any = {};
  userId: any = {};
  product_list: any = [];
  order: any = {};
  qty: any;
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
  new_grand_total: any = 0;
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
    public viewCtrl: ViewController,
    public service: MyserviceProvider,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public storage: Storage,
    public modal: ModalController,
    public platform: Platform,
    public appCtrl: App) {
    this.data.gst_type = 'Gst Paid';
    this.drtype = this.navParams['data'].type;
    this.checkin_id = this.navParams.get('checkin_id');
    setTimeout(() => {
      this.get_item_list('', 'blank');
    }, 2000);

    if (this.navParams.get('checkin_id') || this.navParams.get('Dist_login')) {

      this.retailerID = this.navParams.get('id');
      if (this.navParams.get('id')) {
        this.disableSelect = true
      }
      this.tmpdata.id = this.navParams.get('id');
      this.tmpdata.company_name = this.navParams.get('dr_name');
      this.tmpdata.display_name = this.navParams.get('display_name');
      this.tmpdata.dr_id = this.navParams.get('dr_id')
      this.distributors(this.tmpdata);
    } else if (this.navParams.get('order_data') && this.navParams.get('OrderItem')) {
      this.retailerID = this.navParams.get('order_data')['id'];
      if (this.navParams.get('order_data')['id']) {
        this.disableSelect = true;
      }
      this.tmpdata.id = this.navParams.get('order_data')['id']
      this.tmpdata.company_name = this.navParams.get('order_data')['company_name']
      this.tmpdata.dr_id = this.navParams.get('order_data')['dr_id']
      this.tmpdata.dr_name = this.navParams.get('order_data')['dist_company_name']


      this.distributors(this.tmpdata);

    } else {
      this.distributors('')
    }

    if (this.navParams.get('for_order')) {
      this.checkinData = this.navParams.get('for_order')
      this.data.networkType = this.checkinData.dr_type;
    }

    this.order_data = this.navParams.get("order_data");
    this.OrderItem = this.navParams.get("OrderItem");
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
  Distributor: any = []
  distributors(event) {

    if (this.navParams.get('checkin_id') || (this.navParams.get('Dist_login'))) {
      this.service.addData({ 'dr_type': '3', 'checkin_dr_id': this.navParams.get('id'), 'master_search': event.text }, 'AppOrder/followupCustomer').then((result) => {
        if (result['statusCode'] == 200) {
          this.drList = result['result'];
          let Index = this.drList.findIndex(row => row.id == this.retailerID)
          if (Index != -1) {
            this.data.type_name = this.drList[Index];
            this.get_distributor_list(this.retailerID)
          } else {
          }
        } else {
          this.service.errorToast(result['statusMsg'])
        }
      });


    } else {
      this.Dr_type
      this.service.addData({ 'dr_type': '3', 'master_search': event.text }, 'AppOrder/followupCustomer').then((result) => {
        this.drList = result['result'];
      });
    }
  }


  searchDistributor_list(event) {
    let retailer_id

    retailer_id = this.data.type_name.id

    this.service.addData({ 'dealer_id': retailer_id, 'master_search': event.text }, 'AppOrder/getAssignDistributor').then((result) => {
      if (result['statusCode'] == 200) {
        this.Distributor_list = result['distributor_arr'];

      } else {
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {

    });

  }

  get_distributor_list(id) {
    let retailer_id
    if (this.navParams.get('checkin_id')) {
      retailer_id = id
    }
    else if (this.navParams.get('Dist_login')) {
      retailer_id = id
    }
    else {
      retailer_id = id.id
    }
    this.service.presentLoading();
    this.service.addData({ 'dealer_id': retailer_id, }, 'AppOrder/getAssignDistributor').then((result) => {
      if (result['statusCode'] == 200) {
        this.Distributor_list = result['distributor_arr'];
        this.service.dismissLoading();

      } else {
        this.service.dismissLoading();
        this.service.errorToast(result['statusMsg'])
      }
    }, err => {
      this.service.dismissLoading();

    });

  }
  ionViewDidLoad() {

    this.storage.get('user_type').then((userType) => {
      if (userType == 'OFFICE') {
        this.data.networkType = 3;
        this.userType = userType
        //   this.get_network_list(1)
      }

    });
  }

  ionViewDidEnter() {
    this.sub_total = 0;
    this.dis_amt = 0;
    this.gst_amount = 0;
    this.data.dr_disc = 0;
    this.net_total = 0;
    this.grand_total = 0;
    this.cart_array.map((item) => {
      this.product = item
    })
    this.navBar.backButtonClick = () => {

      this.backAction()

    };
    // this.platform.registerBackButtonAction(() => {
    //   this.backAction()
    // });
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
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.service.presentToast('Your Data is Safe')
          }
        },
        {
          text: 'Yes',
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







  Lead_retailer_distributor: any = [];
  get_state_list(name) {

    this.Dist_state = this.data.type_name.state

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
      str = 'You want to save this order as draft ?';
    }
    else {
      str = 'You want to submit this order ?';
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

  item_list: any = [];
  dr_id: any = {};


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
    this.conditionedItemHeader.filter.order_type = 'secondary';
    this.conditionedItemHeader.filter.search = search;
    if (this.data.type_name != undefined) {
      this.conditionedItemHeader.filter.dr_id = this.data.type_name.id;
    }
    if (this.data.distributor_id != undefined) {
      this.conditionedItemHeader.filter.brand = this.data.distributor_id.brand;
    }
    if (this.add_list.length > 0) {
      this.conditionedItemHeader.filter.gst = this.product_detail.gst
      this.conditionedItemHeader.filter.fixed_brand = this.brandList;
    }

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
            event.component.items = this.item_list
            event.component.endInfiniteScroll();
          }, 1000);
        } else {
          this.service.errorToast(resp['statusMsg'])

        }
      },
        err => {
          this.service.Error_msg(err);
        })
  }



  get_product_details(event) {
    this.data.brand = '';
    this.data.color = '';
    this.service.addData({ 'product_id': event.id, 'brand': this.data.distributor_id.brand, 'order_type': 'secondary' }, "AppOrder/segmentItemsDetails")
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
      discountValue = ''
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



  timeoutId: any = 0;
  get_product_Size(dr_id, product_id, type, discountValue) {
    let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id);
    if (Index != -1) {
      this.data.product_name = this.item_list[Index].product_name
      this.data.feature_apply = this.item_list[Index].feature_apply
      this.data.product_code = this.item_list[Index].product_code
    }

    let header

    if (type == 'listInput') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': dr_id, 'input_discount': this.data.dr_disc, 'product_id': this.data.product_id.id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_id.gst, 'category_id': this.product_detail.category_id, }
    }
    if (type == 'addPrice') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': dr_id, 'input_discount': 0, 'input_price': this.data.productPrice, 'product_id': this.data.product_id.id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_id.gst, 'category_id': this.product_detail.category_id, }
    }
    if (type == 'addDiscount') {
      header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'input_discount': this.data.dr_disc, 'dr_id': dr_id, 'product_id': this.data.product_id.id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.product_id.gst, 'category_id': this.product_detail.category_id, }
    }

    this.service.addData(header, "AppOrder/segmentItemPriceWithoutFeatures")
      .then(resp => {
        if (resp['statusCode'] == 200) {

          this.product_list = resp['result'];


          if (this.product_list.length > 0) {
            for (let i = 0; i < this.product_list.length; i++) {
              this.product_list[i].edit_true = false;
            }
          }

          if (this.product_list.length < 1) {
            this.data.product_id = '';
            this.data.brand = '';
            this.data.color = '';
            this.service.errorToast(resp['statusMsg']);
          }
          this.addToListButton = true;
        } else {
          this.service.errorToast(resp['statusMsg'])
        }
      },
        err => {
          this.service.Error_msg(err);
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
        this.product_list[i]['discount_amount'] = parseFloat(this.product_list[i]['discounted_price']) * parseFloat(this.product_list[i]['qty']);
        this.product_list[i]['discounted_price'] = parseFloat(this.product_list[i]['discounted_price']);


        if (this.data.gst_type == 'Gst Paid') {
          this.product_list[i]['gst_amount'] = parseFloat(this.product_list[i]['amount']) - ((((this.product_list[i]['amount'] * 100))) / (parseFloat(this.product_list[i]['gst_percent'] + 100)));
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
          this.add_list.push(this.product_list[i]);
        }
        if (this.data.gst_type == 'Gst Extra') {
          this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_list[i]['gst_percent'])) / 100);
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = parseFloat(this.product_list[i]['gst_amount']) + (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
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



  save_order(type) {
    this.btndisable = true;

    this.leave = 1
    this.user_data.type = this.data.networkType;

    if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name'].assign_distributor_id;
    }
    this.user_data.Disctype = this.type;
    this.user_data.order_discount = this.order_discount;

    this.user_data.gst_type = this.data.gst_type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.data.type_name.id
    this.user_data.distributor_id = this.data.distributor_id.id
    this.user_data.remark = this.data.remark
    if (this.data.distributor_id && this.data.delivery_from)
      this.user_data.distributor_id = this.data.delivery_from;

    var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount }
    if (type == 'draft') {
      this.btnDisableDraft = true;
    }
    if (type == 'submit') {
      this.btnDisableSave = true;
    }

    this.service.addData({ "cart_data": this.add_list, "user_data": this.user_data, "checkin_id": this.checkin_id }, "AppOrder/secondaryOrdersAdd").then(resp => {

      if (resp['statusCode'] == 200) {
        this.btnDisableDraft = false;
        this.btnDisableSave = false;
        var toastString = ''
        if (this.user_data.order_status == 'Draft') {
          this.service.successToast(resp['statusMsg'])
        }
        else {
          this.service.successToast(resp['statusMsg'])
        }
        this.navCtrl.popTo(SecondaryOrderMainPage)


      } else {
        this.service.errorToast(resp['statusMsg'])
      }
    }, error => {
      this.btndisable = false;
      this.btnDisableDraft = false;
      this.btnDisableSave = false;
      this.service.Error_msg(error);
      this.service.dismiss();
    });
  }

  resetChannel() {
    this.data.distributor_id = '';
    this.data.product_id = '';
    this.product_list = [];
    this.add_list = [];
    this.brandList = [];
    this.colorList = [];
  }

  resetForm() {
    this.data.product_id = '';
    this.product_list = [];
    this.add_list = [];
    this.brandList = [];
    this.colorList = [];
  }


}
