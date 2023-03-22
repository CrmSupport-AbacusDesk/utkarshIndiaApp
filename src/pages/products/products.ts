import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, ModalController } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { SQLite } from '@ionic-native/sqlite';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';


@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    products: any = [];
    filter:any ={};
    flag: any = '';
    
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public service: MyserviceProvider,
        public loadingCtrl: LoadingController,
        private app: App,
        public modalCtrl: ModalController,
        public constant: ConstantProvider,
        private sqlite: SQLite,
        public storage: Storage) {
            this.getCatalogueData();
        }
        
        doRefresh(refresher) {
            this.getCatalogueData();
            refresher.complete();
        }
        
        
        getCatalogueData() {
            this.service.presentLoading();
            this.filter.limit = 20;
            this.filter.start = 0;
            this.service.addData({'filter':this.filter}, 'AppCustomerNetwork/segmentList').then((result) => {
                if (result['statusCode'] == 200) {
                    this.service.dismissLoading();
                    this.products = result['data'];
                } else {
                    this.service.errorToast(result['statusMsg']);
                    this.service.dismissLoading();
                }
            }, error => {
                this.service.Error_msg(error);
                this.service.dismissLoading();
            });
        }
        
        
        loadData(infiniteScroll) {
            this.filter.limit = this.products.length;
            this.service.addData({ 'filter': this.filter}, 'AppCustomerNetwork/segmentList').then(result => {
                if (result['result'] == '') {
                    this.flag = 1;
                }
                else {
                    setTimeout(() => {
                        this.products = this.products.concat(result['data']);
                        infiniteScroll.complete();
                    }, 1000);
                }
            }, error => {
                this.service.Error_msg(error);
                this.service.dismiss();
            });
        }
        
        
        
        goOnProductDetailPage(id, sub_cat_count) {
            if(sub_cat_count  > 0)
            {
                this.navCtrl.push(ProductSubdetailPage, { 'id': id })
            }
            else{
                this.navCtrl.push(ProductDetailPage, { 'id': id, 'type':'category'}) 
            }
        }
        
        
        
        
    }
    