import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { Storage } from '@ionic/storage';
import { ProductDetailPage } from '../product-detail/product-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-catalogue-home',
  templateUrl: 'catalogue-home.html',
})
export class CatalogueHomePage {

  category_list:any = [];
  best_selling:any = [];
  new_arrival:any = [];
  image_url:any = '';
  products: any=[];
  userId:any = '';

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public events: Events,
              public service:DbserviceProvider,
              public service1: MyserviceProvider,
              public constant:ConstantProvider,
              public storage: Storage)
  {
    console.log(constant);
    
    this.image_url = this.constant.upload_url1 + 'Products/'
    console.log(this.image_url);

    this.storage.get('userId').then((userId) => 
    {
        if(typeof(userId) !== 'undefined' && userId)
        {
             this.userId = userId;
        }
    });
    console.log(this.userId); 
    
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad CatalogueHomePage');
  }



  open_menu()
  {
      // console.log(this.user_logged_in);
      this.events.publish('user:navigation_menu');
  }

  goToLogin()
  {
     
    this.navCtrl.push(LoginPage);
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getCatalogueData();
    refresher.complete();
  }

  goToProductList(type,data)
  {
      this.navCtrl.push(ProductsPage,{"type":type,"data":data});
      // this.navCtrl.push(ProductSubdetailPage,{'id':50});
  }

  goOnProductDetailPage(id)
  {
     this.navCtrl.push(ProductDetailPage,{'id':id});
  }

  goToarrivals()
  {
        this.navCtrl.push(NewarrivalsPage)
  }

  getCatalogueData()
  {
    this.service1.show_loading();

    this.service.get_request('Product/product_list').subscribe((response)=>
    {
      console.log(response);

this.products= response.product_list;

console.log(this.products);

      this.category_list = response.categories;
      this.best_selling = response.best_selling;
      this.new_arrival = response.new_arrival;
      this.service1.dismiss();

    },er=>
    {
      this.service1.dismiss();
    });  
  }

}
