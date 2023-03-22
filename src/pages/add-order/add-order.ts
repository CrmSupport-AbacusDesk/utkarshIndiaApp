

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
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list'



@IonicPage()

@Component({
    selector: 'page-add-order',
    templateUrl: 'add-order.html',
})
export class AddOrderPage {
    @ViewChild(Navbar) navBar: Navbar;

    @ViewChild('category') categorySelectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;

    distributorSelected:any=false
    categoryList:any=[];
    data:any={};
    qty:any=0;

    form:any={};
    catCode_List:any=[];
    user_state:any='';
    autocompleteItems:any=[];
    user_data:any={};
    disable_marka:boolean = false;
    disable_transport:boolean = false;
    order_data:any={};
    special_discount:any=0;
    type:any='';
    cart_array:any=[]
    adddMoreItem:any=false
    order_item:any=[];
    checkinData:any={};
    userType:any;
    prod_cat_list;
    showSave = false;
    showEdit = true;
    active:any = {};
    addToListButton:boolean = true;
    add:boolean = true;

    itemGst = -1;
    color_list:any=[];
    brand_list:any=[];
    product:any={};
    show_price:any = false;
    SpecialDiscountLable:any=''
    leave:any=0;
    temp_product_array:any=[];
    distributor_list:any=[];
    grand_amt:any={};
    sub_total:any=0;
    dis_amt:any=0;
    gst_amount:any=0;
    net_total:any=0;
    spcl_dis_amt:any=0
    grand_total:any=0;
    order_gst:any=0;
    order_discount:any=0;
    distributor_network_list:any = [];
    from_product =false
    filter:any={};
    no_rec:any={};
    userId:any={};
    product_list:any=[];
    order:any={};
    flag:any={};
    sizeList:any={};
    mode=0;
    distributorlist:any = [];
    drtype:any;
    checkin_id:any=0;
    idMode: any;
    retailerID:any;
    tmpdata:any={};
    disableSelect:boolean = false;
    disableSelectFromCheckin:boolean = false;
    add_list:any=[];
    total_qty:any=0;
    netamount:any=0;
    total_gst_amount: any = 0;
    new_grand_total: any = 0;
    new_add_list:any=[];
    item_list:any=[];
    dr_id:any={};
    category_list:any=[];

    constructor(
        public navCtrl: NavController,
        public events:Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController
        ,public service1:MyserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        public service:DbserviceProvider,
        public db:MyserviceProvider,
        public appCtrl: App)
        {
          this.data.basic_discount=0;

          this.data.sr_discount=0;
          this.data.other_discount=0;
          this.data.cd_discount=0;

            this.get_distributor_list()
            // this.service.dismiss();
            // this.service1.dismiss();
            console.log(this.navParams);
            this.drtype=this.navParams['data'].type;
            this.checkin_id=this.navParams.get('checkin_id')
            if(this.navParams.get('order_data') && this.navParams.get('order_item')){
                this.disableSelect=true;
                console.log("in if condition");
                console.log(this.navParams.get('order_data')['id']);
                this.retailerID=this.navParams.get('order_data')['id'];

                this.tmpdata.assign_distributor=this.navParams.get('order_data')['distributor_name']
                this.tmpdata.assign_distributor_id=this.navParams.get('order_data')['distributor_id']
                console.log(this.tmpdata);


                // this.get_distributor_list(this.tmpdata);

            }

            if(this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')){

                if(this.navParams.get('checkin_id')){
                    this.disableSelectFromCheckin=true;
                }

                this.drtype=this.navParams.get('order_type');
                this.data.networkType=this.navParams.get('dr_type');
                this.get_network_list(this.data.networkType,'');
                this.data.type_name=this.navParams.get('dr_name');
                // this.get_distributor_list(this.data.type_name);
                console.log(this.data.type_name);
                // console.log(this.data.networkType);
            }

            if(this.navParams.get('for_order'))
            {
                this.checkinData = this.navParams.get('for_order')
                console.log(this.navParams.get('for_order'));
                this.data.networkType = this.checkinData.dr_type;
                this.get_network_listFromCheckin(this.data.networkType);
                this.get_distributor();
            }

            this.order_data = this.navParams.get("order_data");
            this.order_item = this.navParams.get("order_item");
            console.log(this.order_item);


            if(this.order_data && this.order_item){

                for(let i = 0 ;i<this.order_item.length;i++){
                    console.log("in for");
                    this.order_item[i].total_amount = this.order_item[i].amount
                    this.order_item[i].amount = this.order_item[i].sub_total
                }

                this.total_gst_amount = parseFloat(this.order_data.order_gst)
                this.new_grand_total = parseFloat(this.order_data.order_grand_total)
                this.total_gst_amount = this.total_gst_amount.toFixed()
                this.new_grand_total = this.new_grand_total.toFixed()
                console.log(typeof(this.total_gst_amount));
                console.log(typeof(this.new_grand_total));
                this.total_gst_amount = parseInt(this.total_gst_amount)
                this.new_grand_total = parseInt(this.new_grand_total)
                console.log(typeof(this.total_gst_amount));
                console.log(typeof(this.new_grand_total));

            }



            console.log(this.order_data);
            console.log(this.order_item);


            if(this.order_item && this.order_item.length > 0)
            {
                if(this.order_data && this.order_data.delivery_from!='')
                this.distributorSelected=true

                this.order_item.map((item)=>
                {
                    console.log(item);

                    item.subtotal_discounted = item.amount
                    item.discountedAmount = item.discounted_amount
                    item.subtotal_discount = parseFloat(item.sub_total)-parseFloat(item.subtotal_discounted)
                    this.netamount = parseFloat(this.netamount) +  parseFloat(item.discounted_amount);
                    this.order_discount = parseFloat(this.order_discount) +  parseFloat(item.discount_amount);
                    this.sub_total = parseFloat(this.sub_total) +  parseFloat(item.amount);
                    this.total_qty = parseInt(this.total_qty) +  parseInt(item.qty);

                    item.subTotal = item.sub_total
                    item.product_code = item.cat_no
                    item.rate = parseFloat(item.price)
                    this.product = item
                    this.type = this.order_data.DiscType
                    this.special_discount = this.order_data.special_discount_percentage
                    // this.cal_grand_total();

                })
                this.new_add_list = this.order_item;

                if(this.user_data.type == "3")
                {
                    this.data.distributor_id = {dr_id:this.order_data.distributor_id,company_name:this.order_data.distributor_name}
                }
                this.data.networkType=this.order_data.type
                this.get_network_listMoreItem(this.data.networkType)

            }
            else
            {

            }
            console.log(this.navParams);


            if(this.navParams.get("data"))
            {
                this.data = this.navParams.get("data");
                if(this.data.from_product == true)
                {
                    this.cart_array = this.navParams.get("cart_array");
                    console.log(this.data);
                    if(this.data.order_data)
                    {
                        this.order_data = this.data.order_data;
                    }

                    this.cart_array.map((item)=>
                    {
                        this.product = item
                        this.cal_grand_total();
                    })

                }

            }

            if(this.order_data && this.order_data.order_id)
            {

                this.user_data = this.order_data;
            }
            console.log(this.order_data);
            console.log(this.user_data);

            if(this.user_data.type == "3")
            {
                this.get_distributormoreItem();
            }

            // this.getCategory();
            console.log(this.events);
            this.events.subscribe(('AddOrderBackAction'),(data)=>
            {
                console.log(this.events);
                this.backAction()

            })

        }

        ionViewDidLoad()
        {
            console.log(this.navParams.get("cart_array"));

            this.storage.get('user_type').then((userType) => {
                console.log(userType);
                if(userType=='OFFICE')
                {
                    this.data.networkType=3;
                    this.get_network_list(this.data.networkType,'')
                    this.userType  = userType
                    //   this.get_network_list(1)
                }


                // this.getsizeData();
                this.get_category();
                //    this.get_product_Size()
                console.log(this.navParams);
                this.order_data2=this.navParams['data'].order_item;
                for (let index = 0; index < this.order_data2.length; index++) {
                    this.order_data2[index].amount=this.order_data2[index].total_amount
                    this.order_data2[index].description=this.order_data2[index].product_name

                }
                this.new_add_list=this.order_data2
            });
        }

        ionViewDidEnter()
        {
            console.log(this.navParams);

            // if(this.navParams.get("data"))
            // {
            //     this.data = this.navParams.get("data");
            //     if(this.data.from_product == true)
            //     {
            //         this.cart_array = this.navParams.get("cart_array");
            //         console.log(this.data);
            //         if(this.data.order_data)
            //         {
            //             this.order_data = this.data.order_data;
            //         }
            // this.sub_total=0;
            this.dis_amt=0;
            this.gst_amount=0;
            this.net_total=0;
            this.spcl_dis_amt=0
            this.grand_total=0;
            this.order_gst=0;
            this.cart_array.map((item)=>
            {
                this.product = item
                this.cal_grand_total();
            })
            //     }
            // }

            console.log('back button test called');
            this.navBar.backButtonClick = () => {
                console.log('back button test');

                this.backAction()

            };

            let nav = this.appCtrl.getActiveNav();
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
                // if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
                // {

                //     console.log(previuosView);
                //     this.navCtrl.popToRoot();
                // }
            }
        }
        search:any
        test66(event,network){
            console.log(event.text);
                  this.search=event.text
            console.log(this.search);
            this.get_network_list(network,this.search)
            
                }
        order_data2:any=[]
        backAction()
        {
            console.log(this.add_list.length);
            console.log(this.order_item);

            if(this.add_list.length > 0 )
            {
                let alert=this.alertCtrl.create({
                    title:'Are You Sure?',
                    subTitle: 'Your Order Data Will Be Discarded ',
                    cssClass:'action-close',

                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            this.service1.presentToast('Your Data Is Safe')
                        }
                    },
                    {
                        text:'Confirm',
                        cssClass: 'close-action-sheet',
                        handler:()=>
                        {
                            console.log('AddOrderBackAction');
                            this.navCtrl.pop();
                        }
                    }]
                });
                alert.present();
            }
            else
            {
                this.navCtrl.pop();
                console.log('Array Blank');
            }
        }

        MobileNumber(event: any)
        {
            const pattern = /[0-9]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }

        MobileNumber1(event: any)
        {
            console.log('Decimal Restrit');

            const charCode = (event.which) ? event.which : event.keyCode;
            console.log(charCode);

            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
        }

        get_product_data(val)
        {
            console.log(this.data.type_name.id);

            // this.service1.show_loading();

            this.form.cat_no = val.cat_no;
            this.form.product_name = val.product_name;
            this.form.product_id = val.id;
            this.form.user_state = this.user_data.state;
            this.form.user_district = this.user_data.district;
            this.form.user_id = this.data.type_name.id
            this.form.user_type = this.user_data.type

            this.service1.addData({"form":this.form},"dealerData/get_product_dataExecutive").then((result)=>{
                console.log(result);
                this.service1.dismiss();
                if(result['prod_price'])
                {
                    this.show_price = true;
                    this.product = result['prod_price'];
                    this.product.sub_category = this.form.sub_category;
                    this.product.cat_no=this.form.cat_no;
                    this.product.product_name=this.form.product_name;
                }

                this.brand_list = result['brand_list'];
                if(this.brand_list && this.brand_list.length == 1)
                {
                    this.product.brand = this.brand_list[0]['brand_name'];
                }

                this.color_list = result['color_list'];
                if(this.color_list && this.color_list.length == 1)
                {
                    this.product.color = this.color_list[0]['color_name'];
                }
                console.log(this.product)
            })
        }

        Lead_retailer_distributor:any=[];
        get_network_list(network_type,search)
        {
        // this.db.show_loading();

            this.data.type_name = '';
            this.service1.show_loading();
            console.log(network_type);

            this.service1.addData({'search':search,'type':network_type,'from':'order'},'DealerData/get_type_list').then((result)=>{
                console.log(result);
                this.distributor_network_list = result;
                if(!this.navParams['data'].checkin_id){

                for(let i = 0 ;i<this.distributor_network_list.length;i++){
                    if(this.distributor_network_list[i].name!=""||this.distributor_network_list[i].mobile!=""){
                      this.distributor_network_list[i].company_name=this.distributor_network_list[i].company_name+' '+'('+this.distributor_network_list[i].name+'  '+this.distributor_network_list[i].mobile+')'
                    }
                    if(this.distributor_network_list[i].name==""&&this.distributor_network_list[i].mobile==""){
                      this.distributor_network_list[i].company_name=this.distributor_network_list[i].company_name
                    }
                  }
                }
                console.log(this.navParams);
                console.log(this.navParams['data'].checkin_id);
                if(this.navParams['data'].checkin_id){
                    this.data.type_name= this.distributor_network_list.filter(row=>row.company_name == this.navParams['data'].dr_name);
                console.log(this.data.type_name);

                    this.data.type_name=this.data.type_name[0];
                    console.log(this.data.type_name);


                }
                console.log(this.data.type_name);

                this.service1.dismiss();
                // this.open();
            });


        }
        addtolist2()
        {
            this.new_add_list.push({
                qty:this.data.qty,
                amount:this.data.amount,

              description:this.data.description

        });
          
     
          console.log( this.total_qty);
          console.log( this.netamount);
          console.log( this.total_gst_amount);

        //   this.netamount = parseInt(this.netamount);
        //   this.total_gst_amount = parseInt(this.total_gst_amount);
        //   this.netamount = this.netamount.toFixed();
        //   this.total_gst_amount = this.total_gst_amount.toFixed();

          

             console.log(this.new_add_list);

         this.data.product={};
         this.data.qty='';
         this.data.amount='';

        //  this.data.category='';
        }


        distributor:any
        leadtype:any
        selectdistributor(type){
            console.log(type.type);
            if(type.type=='3'){
                this.get_distributor_list()
            }
            
        }
        get_distributor_list(){

            if(this.navParams.get('checkin_id')){
                this.leadtype={'type':3,'id':this.navParams.get('id')}
                console.log(this.leadtype);
                
                                }
            if(this.navParams.get('checkin_id')){
                this.data.type_name=this.leadtype
            }
            console.log(this.data.type_name);
            // this.distributorlist=[];
            console.log(name);


                this.service1.addData({'type':this.data.type_name},'Lead/distributor_lists').then((result)=>{
                    console.log(result);
                    this.distributor = result;
                    for(let i = 0 ;i<this.distributor.length;i++){
                        this.data.delivery_from=this.distributor[i]

                    }
                    // this.distributorSelectable.open();
                    // this.service1.dismiss();
                    // this.open();
                });


        }

        onKeyUp(x) { // appending the updated value to the variable
            console.log(x);
            if(x.key!=''){
                this.mode=1;
            }
        }

        get_network_listFromCheckin(network_type)
        {
            this.data.type_name = {};
            this.service1.addData({'type':network_type,'from':'order'},'DealerData/get_type_list').then((result)=>{
                console.log(result);
                this.distributor_network_list = result;
                var Index =  this.distributor_network_list.findIndex(row=>row.id==this.checkinData.dr_id)
                console.log(this.distributor_network_list[Index]);
                this.data.type_name = this.distributor_network_list[Index]

                // this.open();
            });
        }

        test(test){
            console.log(test);

        }
        get_network_listMoreItem(network_type)
        {
            this.data.type_name = {};
            // this.service.show_loading()
            this.service1.addData({'type':network_type,'from':'order'},'DealerData/get_type_list').then((result)=>{
                this.adddMoreItem = true
                console.log(result);
                this.distributor_network_list = result;
                console.log(this.order_data);

                var index = this.distributor_network_list.findIndex(row => row.id == this.order_data.id )
                console.log(index);

                this.data.type_name = this.distributor_network_list[index]
                console.log(this.data.type_name);

                // this.get_dr_marka();

            });
        }

        cal_grand_total()
        {
            console.log(this.sub_total,this.dis_amt,this.net_total,this.order_gst,this.spcl_dis_amt,this.grand_total);



            this.sub_total = parseFloat(this.sub_total) + parseFloat(this.product.subTotal);
            this.dis_amt = parseFloat(this.dis_amt) + (parseFloat(this.product.subtotal_discount));
            this.net_total = parseFloat(this.net_total) + parseFloat(this.product.amount);
            this.order_gst = parseFloat(this.order_gst) + parseFloat(this.product.gst_amount);
            // console.log(this.special_discount);

            this.spcl_dis_amt = (this.net_total * this.special_discount)/100;

            this.grand_total = this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);

        }

        deleteItemFromCartAlertMessage(index)
        {
            let alert=this.alertCtrl.create({
                title:'Are You Sure?',
                subTitle: 'You want to remove this item ??',
                cssClass:'action-close',

                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.service1.presentToast('Action Cancelled')
                    }
                },
                {
                    text:'Confirm',
                    cssClass: 'close-action-sheet',
                    handler:()=>
                    {
                        this.deleteItemFromCart(index)
                    }
                }]
            });
            alert.present();
        }

        deleteItemFromCart(index)
        {
            this.sub_total = parseFloat(this.sub_total) -  parseFloat(this.cart_array[index].subTotal) ;

            this.dis_amt = parseFloat(this.dis_amt) -  parseFloat(this.cart_array[index].subtotal_discount) ;

            // this.net_total = parseFloat(this.net_total) -  parseFloat(this.cart_array[index].subtotal_discounted) ;

            this.net_total = parseFloat(this.net_total) -  parseFloat(this.cart_array[index].amount) ;


            this.spcl_dis_amt = (this.net_total * this.special_discount)/100;

            this.order_gst = parseFloat(this.order_gst) - parseFloat(this.cart_array[index].gst_amount)

            this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);

            if(this.type=='Discount')
            {
                this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
            }else
            {
                this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
            }

            this.cart_array.splice(index,1);

            this.service1.presentToast('Item removed !!')
        }

        openCategory()
        {
            console.log(this.data.networkType);
            console.log(this.data);

            if(this.data.networkType!=3)
            {
                // this.categorySelectable.open();
                // this.subcatSelectable.open();
            }
            else
            {
                this.get_distributor();
            }
            this.user_data.private_marka = this.data.type_name.private_marka  ;
            this.user_data.transport_address = this.data.type_name.transport_address  ;
            this.user_data.transport_name = this.data.type_name.transport_name  ;
            this.user_data.transport_mobile = this.data.type_name.transport_mobile  ;
        }

        get_distributormoreItem()
        {
            // this.service.show_loading();
            this.service1.addData({'type':1,'from':'order'},'DealerData/get_type_list').then((result)=>{
                console.log(result);
                this.distributor_list = result;


                var index = this.distributor_list.findIndex(row => row.id == this.order_data.distributor_id )
                console.log(index);

                console.log(this.distributor_list[index]);
                this.data.distributor_id = this.distributor_list[index]
                // this.service.dismiss();
                // this.distributorSelectable.open();

            });
        }

        get_distributor()
        {
            // this.service1.show_loading();
            this.service1.addData({'type':1,'from':'order'},'DealerData/get_type_list').then((result)=>{
                console.log(result);
                this.distributor_list = result;

                // this.service1.dismiss();
                if(this.distributor_list.length==1)
                {
                    this.data.distributor_id = this.distributor_list[0]
                }
                else
                {
                    // this.distributorSelectable.open();
                }

            });
        }

        save_orderalert(type)
        {
             this.service1.show_loading();

            var str
            console.log(this.grand_total);

            if(this.grand_total > 20000000)
            {
                let alert=this.alertCtrl.create({
                    title:'Max order value reached',
                    subTitle: 'Maximum order value is 2 Cr. !',
                    cssClass:'action-close',

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
        if(type=='save')
        {
            str = 'You want to save this order as draft ?'
        }
        else
        {
            str = 'You want to submit order ?'
        }
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: str,
            cssClass:'action-close',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {

                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                    this.save_order(type)
                }
            }]
        });
        alert.present();
       this.service1.dismiss();

    }



    goToProductPage()
    {
        console.log(this.order_data);
        if(this.order_data)
        this.data.order_data = this.order_data

        this.navCtrl.push(ProductsPage,{"order":true,"order_data":this.data,"cart_array":this.cart_array});

        //   this.navCtrl.push(ProductsPage,{"order":true,"order_data":this.data,"cart_array":JSON.parse(JSON.stringify(this.cart_array))});

    }






    get_category()
    {
        this.db.addData({},"Lead/categoryList").then(resp=>{
            console.log(resp);
            this.category_list=resp;
        });
    }
combine:any;
    get_item_list()
    {
        // console.log(this.form.category);
        // let category = this.form.category.category;
        console.log(this.data.category);

        this.db.addData({'dr_id':this.data.type_name.id,'category':this.data.category.category},"Lead/itemList")
        .then(resp=>{
            console.log(resp);
            this.item_list = resp['data'];
            console.log(this.item_list);
            this.combine= this.item_list['product_name'] + this.item_list['product_code'];
            console.log( this.combine);

        },
        err=>
        {
        })
    }



    get_product_Size(product_id, dr_id)
    {
        console.log(this.data.productid);
        console.log(dr_id);

        console.log(this.data);

        this.db.addData({'dr_id':dr_id},"Lead/getProductSize/"+product_id)
        .then(resp=>{
            console.log(resp);
            this.product_list = resp['data'];
            this.itemGst = resp['gst'];
            console.log(this.product_list);
            if(this.product_list.length>0){
                for(let i=0;i<this.product_list.length;i++){
                    this.product_list[i].edit_true=false;
                }
                console.log(this.product_list);
            }
        },
        err=>

        {
        })
    }


    loadData(infiniteScroll)
    {
        console.log('loading');
        var dr_id
        if(this.data && this.data.type_name)
        dr_id = this.data.type_name.id
        else
        dr_id = this.userId

        this.filter.limit=this.cart_array.length;
        this.service.post_rqst({'filter' : this.filter,'order':this.order,'dr_id':dr_id,'userId':this.userId,'userType':this.userType},'Product/productList').subscribe( response =>
            {
                console.log(response);
                if( response.products == '')
                {
                    this.flag=1;
                }
                else
                {
                    setTimeout(()=>
                    {
                        this.cart_array=this.cart_array.concat(response.products);
                        console.log(this.cart_array.length +' '+ response.products.length)
                        if(this.order == true)
                        {
                            for (let i = 0; i < this.cart_array.length; i++)
                            {
                                this.cart_array[i].qty = 0;
                            }
                        }

                        infiniteScroll.complete();
                    },1000);
                }
            });
        }

        getsizeData()
        {
            //   this.service1.show_loading();

            this.no_rec=false;

            this.service.post_rqst({'userId':this.userId},'Product/sizeList').subscribe((response)=>
            {
                console.log(response);
                this.sizeList = response.sizeList;
                this.service1.dismiss();

                if(!this.sizeList.length)
                {
                    this.no_rec=true
                }

            },er=>
            {
                // this.service1.dismiss();
            });
        }
        amount:any;
        gst_amnt:any;
        total_amnt:any;
        // basic_discount:any={};
        // sr_discount:any={};
        // dd_discount:any={};
        // family_discount:any={};
        // ss_discount:any={};
        // cd_discount:any={};

        // basic_discount_amt={}


        addtolist1()
        {
            console.log(this.data);
            console.log(this.item_list);

            let existIndex = this.new_add_list.findIndex(row=>row.id == this.data.productid);
            let rowData = this.item_list.findIndex(row=>row.id == this.data.productid)
            if(existIndex==-1)
              {

                        let basic_discount = (parseFloat(this.item_list[rowData].basic_discount)).toFixed(2);
                        let sr_discount = (parseFloat(this.item_list[rowData].sr_discount)).toFixed(2);
                        let dd_discount = (parseFloat(this.item_list[rowData].dd_discount)).toFixed(2);
                        let family_discount = (parseFloat(this.item_list[rowData].family_discount)).toFixed(2);
                        let ss_discount = (parseFloat(this.item_list[rowData].ss_discount)).toFixed(2);
                        let cd_discount = (parseFloat(this.item_list[rowData].cd_discount)).toFixed(2);


                        console.log(basic_discount);
                        console.log(sr_discount);
                        console.log(dd_discount);
                        console.log(family_discount);
                        console.log(ss_discount);
                        console.log(cd_discount);




                        let basic_discount_amt;
                        let basic_discounted_amount;
                        let sr_discount_amt;
                        let sr_discounted_amount;

                        let dd_discount_amt;
                        let dd_discounted_amount;

                        let family_discount_amt;
                        let family_discounted_amount;

                        let ss_discount_amt;
                        let ss_discounted_amount;

                        let cd_discount_amt;
                        let cd_discounted_amount;






                        let discounted_amount

                        this.amount=this.data.qty*this.item_list[rowData].rate;


                        basic_discount_amt=((parseFloat( this.amount)*parseFloat(basic_discount))/100).toFixed(2)

                        basic_discounted_amount=(parseFloat( this.amount) - parseFloat(basic_discount_amt)).toFixed(2);

                        sr_discount_amt=((parseFloat(basic_discounted_amount)*parseFloat(sr_discount))/100).toFixed(2)

                        sr_discounted_amount=(parseFloat(basic_discounted_amount) - parseFloat(sr_discount_amt)).toFixed(2);

                        dd_discount_amt=((parseFloat(sr_discounted_amount)*parseFloat(dd_discount))/100).toFixed(2)

                        dd_discounted_amount=(parseFloat(sr_discounted_amount) - parseFloat(dd_discount_amt)).toFixed(2);

                        family_discount_amt=((parseFloat(dd_discounted_amount)*parseFloat(family_discount))/100).toFixed(2)

                        family_discounted_amount=(parseFloat(dd_discounted_amount) - parseFloat(family_discount_amt)).toFixed(2);

                        ss_discount_amt=((parseFloat(family_discounted_amount)*parseFloat(ss_discount))/100).toFixed(2)

                        ss_discounted_amount=(parseFloat(family_discounted_amount) - parseFloat(ss_discount_amt)).toFixed(2);

                        cd_discount_amt=((parseFloat(ss_discounted_amount)*parseFloat(cd_discount))/100).toFixed(2)

                        cd_discounted_amount=(parseFloat(ss_discounted_amount) - parseFloat(cd_discount_amt)).toFixed(2);
                        discounted_amount=cd_discounted_amount
                        this.gst_amnt=(parseFloat(discounted_amount)* parseFloat(this.item_list[rowData].gst))/100;
                        this.gst_amnt=this.gst_amnt.toFixed(2);
                        this.total_amnt=(parseFloat(this.gst_amnt) + parseFloat(discounted_amount)).toFixed(2);


                        this.new_add_list.push({
                            product_type:this.data.product_type,
                            product_name:this.item_list[rowData].product_name,
                            id: this.data.productid,
                            category:this.item_list[rowData].category,
                            gst:this.item_list[rowData].gst,
                            product_code:this.item_list[rowData].product_code,
                            qty:this.data.qty,
                            rate:this.item_list[rowData].rate,
                            amount:this.amount,
                            // discount_percent:discount_percent,
                            discount_amount:discounted_amount,
                            discounted_amount:discounted_amount,
                            gst_amount:this.gst_amnt,
                            total_amount:this.total_amnt,
                            gst_percent:this.item_list[rowData].gst,
                            basic_discount:this.item_list[rowData].basic_discount,
                            sr_discount:this.item_list[rowData].sr_discount,
                            dd_discount:this.item_list[rowData].dd_discount,
                            family_discount:this.item_list[rowData].family_discount,
                            ss_discount:this.item_list[rowData].ss_discount,
                            cd_discount:this.item_list[rowData].cd_discount,



                    });
        }
        else
        {
            this.new_add_list[existIndex].qty= parseInt(this.new_add_list[existIndex].qty) +  parseInt(this.data.qty);

            this.new_add_list[existIndex].amount=this.new_add_list[existIndex].qty*this.new_add_list[existIndex].rate;
            this.new_add_list[existIndex].discount_amount=((parseFloat(this.new_add_list[existIndex].amount)*parseFloat(this.new_add_list[existIndex].discount_percent))/100).toFixed(2)
            this.new_add_list[existIndex].discounted_amount=(parseFloat(this.new_add_list[existIndex].amount) - parseFloat(this.new_add_list[existIndex].discount_amount)).toFixed(2);
            this.new_add_list[existIndex].gst_amount=((this.new_add_list[existIndex].discounted_amount)*(this.new_add_list[existIndex].gst))/100;
            this.new_add_list[existIndex].total_amount=this.new_add_list[existIndex].discounted_amount+ this.new_add_list[existIndex].gst_amount;

        }

        this.total_qty = 0;
        this.sub_total = 0;
        this.netamount = 0;
        this.total_gst_amount = 0;
        this.order_discount =0;

        for(let i = 0; i < this.new_add_list.length; i++)
        {
            this.total_qty = (parseInt(this.total_qty) + parseInt(this.new_add_list[i].qty));
            this.sub_total = (parseFloat(this.sub_total) +  parseFloat(this.new_add_list[i].amount)).toFixed(2);
            this.netamount = (parseFloat(this.netamount) +  parseFloat(this.new_add_list[i].discounted_amount)).toFixed(2)
            this.order_discount = (parseFloat(this.order_discount) + parseFloat(this.new_add_list[i].discount_amount)).toFixed(2);
            this.total_gst_amount = (parseFloat(this.new_add_list[i].gst_amount) + parseFloat(this.total_gst_amount)).toFixed(2);
        }


          console.log( this.total_qty);
          console.log( this.netamount);
          console.log( this.total_gst_amount);

       ;

          this.new_grand_total=(parseFloat(this.netamount) + parseFloat(this.total_gst_amount)).toFixed(2);
          console.log(this.new_grand_total);

             console.log(this.new_add_list);

         this.data.product={};
         this.data.qty='';
        //  this.data.category='';
        }
        discount_percent:any={}
        discount_percent1:any={}
        discount_percent2:any={}
        discount_percent3:any={}
        discount_amount:any={}
        discounted_amount:any=0
        discounted_amount1:any=0
        discounted_amount2:any=0
        discounted_amount3:any=0



      




        listdelete(i)
        {
            this.new_add_list.splice(i, 1);

            // this.total_qty = 0;
            // this.netamount = 0;
            // this.total_gst_amount = 0;
            // console.log( this.new_add_list);


            // for(let i = 0; i < this.new_add_list.length; i++)
            // {
            //     this.total_qty = parseInt(this.total_qty + this.new_add_list[i]['qty']);
            //     this.netamount = parseFloat(this.netamount) +  parseInt(this.new_add_list[i]['qty']) * parseFloat(this.new_add_list[i]['rate']);
            //     this.total_gst_amount = parseFloat(this.new_add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
            // }

            this.total_qty = 0;
            this.sub_total = 0;
            this.netamount = 0;
            this.total_gst_amount = 0;
            this.order_discount =0;

            for(let i = 0; i < this.new_add_list.length; i++)
            {
                this.total_qty = (parseInt(this.total_qty) + parseInt(this.new_add_list[i].qty));
                this.sub_total = (parseFloat(this.sub_total) +  parseFloat(this.new_add_list[i].amount)).toFixed(2);
                this.netamount = (parseFloat(this.netamount) +  parseFloat(this.new_add_list[i].discounted_amount)).toFixed(2)
                this.order_discount = (parseFloat(this.order_discount) + parseFloat(this.new_add_list[i].discount_amount)).toFixed(2);
                this.total_gst_amount = (parseFloat(this.new_add_list[i].gst_amount) + parseFloat(this.total_gst_amount)).toFixed(2);
            }

              this.new_grand_total=(parseFloat(this.netamount) + parseFloat(this.total_gst_amount)).toFixed(2);

            // this.new_grand_total=parseInt(this.netamount) + parseInt(this.total_gst_amount);

        }


        save_order(type)
        {
            console.log(this.data);

            this.leave=1
            this.user_data.type = this.data.networkType;

            console.log(type);
            console.log(this.user_data);
            console.log(this.data);
            if(this.data['type_name'].type=="3"){
                this.data.delivery_from=this.data.delivery_from.id;
                console.log(this.data.delivery_from)

            }
            if(this.data['type_name']&& (this.data['type_name'].type=="3"&&this.data['type_name'].type=="5"||this.data['type_name'].type=="9"||this.data['type_name'].type=="11"||this.data['type_name'].type=="13"||this.data['type_name'].type=="14"||this.data['type_name'].type=="15"||this.data['type_name'].type=="16")){
                this.data.delivery_from=this.data.delivery_from.id;

            }


            console.log(this.data);



            if(this.user_data.type == "3"||this.user_data.type == "5" ||this.user_data.type == "9"||this.user_data.type == "11"||this.user_data.type == "13"||this.user_data.type == "14"||this.user_data.type == "15"||this.user_data.type == "16")
            {
                if(!this.data.delivery_from)
                {
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
            if(this.data.distributor_id && this.data.delivery_from)
            this.user_data.distributor_id = this.data.delivery_from

            var orderData = {'sub_total':this.sub_total,'dis_amt':this.order_discount,'grand_total':this.new_grand_total,'total_gst_amount':this.total_gst_amount,'total_qty':this.total_qty,'net_total':this.netamount,'special_discount':this.special_discount,'special_discount_amount':this.spcl_dis_amt}
            console.log(orderData);
            console.log(this.add_list);
            console.log(this.user_data);

            this.service1.addData({"cart_data":this.new_add_list,"user_data":this.user_data,'orderData':orderData,'checkin_id':this.checkin_id},"dealerData/save_orderExecutive").then(resp=>{
                console.log(resp);
                if(resp['msg'] == "success")
                {
                    var toastString=''
                    if(type=='save')
                    {
                        toastString='Order Saved To Draft Successfully !'
                    }
                    else
                    {
                        toastString='Order Placed Successfully !'
                    }

                    console.log(this.user_data.distributor_id);

                    if(this.navParams.get('dr_type') && this.navParams.get('dr_name') && this.navParams.get('order_type')){

                        this.navCtrl.pop();

                    }
                    else{
                        if(this.order_data) {

                            if(this.order_data.type == 1 || this.order_data.type == 7 ) {

                                this.navCtrl.push(OrderListPage,{'type':'Primary'})


                            } else {

                                this.navCtrl.push(OrderListPage,{'type':'Secondary'})

                            }


                        } else {


                            if(this.data.networkType == 1 ||  this.data.networkType == 7)
                            {

                                console.log('Primary');

                                this.navCtrl.push(OrderListPage,{'type':'Primary'})

                            }
                            else
                            {

                                console.log('Secondary');

                                this.navCtrl.push(OrderListPage,{'type':'Secondary'})
                            }
                        }
                    }

                    this.service1.presentToast(toastString)
                }
            })


        }







        editRate(id,index) {
            console.log(id);
            this.active[index] = Object.assign({'qty':"1"});
            console.log(this.active);
            this.showSave = true;
            this.idMode = id;
            // this.editProductID = id;
            // this.showError=true;
            this.product_list[index].edit_true = false;
        }


        updateRate(editedRate,index){

            console.log(editedRate);
            this.idMode = 0;
            this.active = {};
            this.product_list[index].edit_true = true;
        }
        item_id:any;
        get_product_id()
        {
            this.data.productid=this.data.product.id;
          console.log(this.data.productid);

        }
    }

