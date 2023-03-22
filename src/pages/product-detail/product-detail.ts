import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, Keyboard, ModalController, ActionSheet, ActionSheetController } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SQLite } from '@ionic-native/sqlite';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { AddOrderPage } from '../add-order/add-order';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../../providers/constant/constant';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { ViewProfilePage } from '../view-profile/view-profile';
import { ProductSubDetail2Page } from '../product-sub-detail2/product-sub-detail2';
import { SocialSharing } from '@ionic-native/social-sharing';



@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  pageType:any ={};

  resultData: any = {};
  images: any = {};
  cat_id: any = '';
  filter: any = {};
  image: any = {};
  prod_list: any = [];
  prod_cat: any = {};
  prod_count: any = '';
  loading: Loading;
  total_count: any = '';
  flag: any = '';
  no_rec: any = false;
  skelton: any = {}
  src: any;
  categoryName: any;
  globalSearchData: any;

  prod_id: any = '';
  prod_detail: any = [];
  res: any = [];
  related_products: any = [];
  data1: any = [];
  cart_array: any = [];
  data: any = {};
  order: any = false;
  image_url: any = '';
  existInFavourite: any = '';
  user_data: any = {};
  userType: any
  product_detail: any = [];
  uploadUrl: any = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: DbserviceProvider,
    public service1: MyserviceProvider,
    public loadingCtrl: LoadingController,
    private app: App,
    private sqlite: SQLite,
    public modalCtrl: ModalController,
    public actionsheet: ActionSheetController,
    public keyboard: Keyboard,
    public socialSharing: SocialSharing,
    public storage: Storage,
    public constant: ConstantProvider
  ) {
    this.image_url = this.constant.upload_url1 + 'product_image/'
    this.pageType = this.navParams.get('type');
    this.prod_id = this.navParams.get('id');
    if(this.pageType){
      this.getProductDetail();
    }
  }

  ionViewDidLoad() {


  

  }


  doRefresh(refresher) {
    this.flag = '';
    // this.getProductList(this.cat_id,'');
    this.getProductDetail();
    refresher.complete();
  }





  getProductDetail() {
    this.filter.start = 0
    this.filter.limit = 20;
    if(!this.filter.search_key){
      this.service1.presentLoading();
    }

    let header

    if(this.pageType == 'category'){
      header = {'cat_id': this.prod_id, 'filter': this.filter}
    }
    if(this.pageType == 'sub_category'){
      header = {'sub_cat_id': this.prod_id, 'filter': this.filter}
    }

    this.service1.addData(header, 'AppCustomerNetwork/segmentItems').then(response => {
      if (response['statusCode'] == 200) {
        this.prod_detail = response['data'];
        this.filter.start = this.prod_detail.length;
        this.service1.dismissLoading()
      } else {
        this.service1.errorToast(response['statusMsg'])
        this.service1.dismissLoading()
      }

    }, error => {
      this.service1.Error_msg(error);
      this.service1.dismiss();
    });

  }
  loadData(infiniteScroll) {
    this.filter.start = this.prod_detail.length;
    this.filter.limit = 20;

    let header
    if(this.pageType == 'category'){
      header = {'cat_id': this.prod_id, 'filter': this.filter}
    }
    if(this.pageType == 'sub_category'){
      header = {'sub_cat_id': this.prod_id, 'filter': this.filter}
    }

    this.service1.addData(header, 'AppCustomerNetwork/segmentItems')
      .then((r) => {
        if (r['dr_list'] == '') {
          this.flag = 1;
        }
        else {
          setTimeout(() => {
            this.prod_detail = this.prod_detail.concat(r['data']);
            infiniteScroll.complete();
          }, 1000);
        }
      }, error => {
        this.service1.Error_msg(error);
        this.service1.dismiss();
      });
  }


  goToDetail(id) {
    this.navCtrl.push(ProductSubDetail2Page, { id: id })
  }


  imageModal(src) {
    this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
  }

  shareProductsImage(prodDetail, imagePath) {
    let shareDatas
    shareDatas = ("Product Name:" + prodDetail.product_name + "\n" + "Product Code:" + prodDetail.product_code + "\n" + "Description:" + prodDetail.description)
    let shareActionSheet = this.actionsheet.create({
      title: 'Share Image',
      cssClass: 'cs-actionsheet',
      buttons: [
        {
          text: 'Whatsapp',
          icon: 'logo-whatsapp',
          handler: () => {
            this.socialSharing.shareViaWhatsApp(shareDatas, imagePath, null).then((e) => {

            }).catch((r) => {
            })
          }
        },
        {
          text: 'Share Image',
          icon: 'share',
          handler: () => {
            this.socialSharing.share(shareDatas, null, imagePath, null).then((e) => {
            }).catch((r) => {
            })
          }
        },
        {
          cssClass: 'cs-cancel',
          text: 'Cancel',
          role: 'cancel',
          icon: 'cancel',
          handler: () => {
          }
        }
      ]
    })
    shareActionSheet.present();
  }


}
