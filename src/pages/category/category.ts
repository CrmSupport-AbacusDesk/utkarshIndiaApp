import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { ProductDetailPage } from '../product-detail/product-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { MyserviceProvider } from '../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  skelton:any={}
  data:any={};
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public service:DbserviceProvider,
              public service1: MyserviceProvider,
              public loadingCtrl:LoadingController,
              private app:App,
              public offlineService: OfflineDbProvider,
              private sqlite: SQLite) 
  {
        this.skelton = new Array(10);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ProductsPage');
      // this.presentLoading();
      // this.getCategoryData();
  }

  ionViewWillEnter()
  {
      // this.getProductCategoryList();
      this.getCategoryData();

  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    // this.getProductCategoryList();
    this.getCategoryData();
    this.flag='';
    refresher.complete();
  }
  
  goToNewArrivals()
  {
    console.log('newArrivals')
    this.navCtrl.push(NewarrivalsPage);
  }

  goToProductList(type,data)
  {
      this.navCtrl.push(ProductsPage,{"type":type,"data":data});
      // this.navCtrl.push(ProductSubdetailPage,{'id':50});
  }

   
    getCategoryData()
    {
      this.service1.show_loading();

      this.no_rec=false;

      this.service.post_rqst({'filter' : this.filter},'Product/categoryList').subscribe((response)=>
      {
          console.log(response);
          this.prod_cat_list = response.categories;
          this.service1.dismiss();

          if(!this.prod_cat_list.length)
          {
            this.no_rec=true
          }

      },er=>
      {
        this.service1.dismiss();
      });  
    }

    ionViewDidLeave()
    {
      let nav = this.app.getActiveNav();
      if(nav && nav.getActive())
      {
        let activeView = nav.getActive().name;
        let previuosView = '';
        if(nav.getPrevious() && nav.getPrevious().name)
        {
          previuosView = nav.getPrevious().name;
        }
        console.log(previuosView);
        console.log(activeView);
        console.log('its leaving');
        if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
        {

          console.log(previuosView);
          this.navCtrl.popToRoot();
        }
      }
    }

    // // master search start
    // goToProductsWithSearch(globalSearchData)
    // {
    //   setTimeout(() => {
        
    //     this.navCtrl.push(ProductDetailPage, {'id':'', categoryName:'', globalSearchData: globalSearchData, src: 'mainCategory'})
    //   }, 500);
    // }


    // goOnCategoryListPage(name) 
    // {

    //   this.presentLoading2();
    //   this.filter.name = name;

    //   this.offlineService.onReturnLocalDBHandler().subscribe((db) => {

    //           this.offlineService.onGetCategoryRowsHandler(db, name).subscribe(categoryData => {

    //                   this.loading.dismiss();

    //                   const categoryLength = categoryData.rows.length;

    //                   if(categoryLength == 1) {

    //                         console.log('list length is one');

    //                         const item = categoryData.rows.item(0);
    //                         console.log(item);
    //                         const categoryId = item.id;
    //                         this.navCtrl.push(ProductDetailPage,{'id':categoryId,src: 'mainCategory'});

    //                   } else {

    //                         console.log('list length is two');
    //                         this.navCtrl.push(ProductsPage,{'name':name})
    //                   }
    //           });
    //   });
    // }

    // goOnCategoryListPageWithLiveServer(name)
    // {
    //   this.presentLoading2();
    //   this.filter.limit = 0;
    //   this.filter.name = name;
    //   this.service.post_rqst({'filter' : this.filter},'app_master/checkCategoryLength')
    //   .subscribe((r)=>
    //   {
    //     console.log(r);
    //     this.loading.dismiss();
    //     if(r['categories'].length == 1)
    //     {
    //       console.log('list length is one');
    //       this.navCtrl.push(ProductDetailPage,{'id':r['categories'][0].id})

    //     }
    //     else{
    //       console.log('list length is two');

    //       this.navCtrl.push(ProductsPage,{'name':name})
    //     }
    //   },(error: any) => {
    //     this.loading.dismiss();
    //   })
    // }

    // getProductCategoryList(name = '') 
    // {

    //         this.filter.name = name;
    //         if(name) {
    //           this.filter.name = '%' +name + '%';
    //         }
    //         this.no_rec=false
    //         this.offlineService.onGetMainCategoryListHandler(this.filter).subscribe(data => {

    //               console.log(data);
    //               this.prod_cat_list = [];

    //               for (let i = 0; i < data.rows.length; i++) {

    //                     let item = data.rows.item(i);
    //                     this.prod_cat_list.push(item);
    //                     console.log(item);
    //                     console.log(item.id);
    //                     this.offlineService.onReturnImagePathHandler('mainCategoryImage', item.image, item.id).subscribe((imageResultData) => {

    //                           console.log(imageResultData);

    //                           const categoryIndex = this.prod_cat_list.findIndex(row => row.id == imageResultData.recordId);

    //                           console.log(this.prod_cat_list);
    //                           console.log('categoryIndex ' + categoryIndex);

    //                           this.prod_cat_list[categoryIndex].imageCompletePath = imageResultData['imagePath'];

    //                     });
    //               }

    //               console.log(this.prod_cat_list);
    //               if(!this.prod_cat_list.length)
    //               {
    //                 this.no_rec=true
    //               }
    //         });
    // }

    // getCategoryImages(categoryId,index)
    // {
    //     console.log(categoryId)
    //     //  this.prod_cat_list[index]['image'] = 'http://phpstack-83335-1428632.cloudwaysapps.com/dd_api/app/uploads/newarrival.jpg';
    //     this.service.post_rqst({'categoryid':categoryId},'app_master/getcategoryImage').subscribe((res)=>
    //     {
    //       console.log(res)
    //       console.log(res['categories'][0]['image'])
    //       this.prod_cat_list[index]['image'] = res['categories'][0]['image']
    //     })
    // }

    // loadData(infiniteScroll)
    // {
    //   console.log('loading');

    //   this.filter.limit=this.prod_cat_list.length;
    //   this.service.post_rqst({'filter' : this.filter},'app_master/parentCategoryList').subscribe( r =>
    //     {
    //       console.log(r);
    //       if(r['categories']=='')
    //       {
    //         this.flag=1;
    //       }
    //       else
    //       {
    //         setTimeout(()=>{
    //           for (let index = this.prod_cat_list.length; index < r['categories'].length; index++) {
    //             console.log(r['categories'][index])
    //             this.getCategoryImages(r['categories'][index]['main_category'],index)
    //           }
    //           this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
    //           console.log('Asyn operation has stop')
    //           infiniteScroll.complete();
    //         },1000);
    //       }
    //     });
    // }

    // presentLoading()
    // {
    //   // this.loading = this.loadingCtrl.create({
    //   //   content: "Please wait...",
    //   //   dismissOnPageChange: true
    //   // });
    //   // this.loading.present();
    // }

    // presentLoading2()
    // {
    //   this.loading = this.loadingCtrl.create({
    //     content: "",
    //     dismissOnPageChange: true
    //   });
    //   this.loading.present();
    // }

  
  }
