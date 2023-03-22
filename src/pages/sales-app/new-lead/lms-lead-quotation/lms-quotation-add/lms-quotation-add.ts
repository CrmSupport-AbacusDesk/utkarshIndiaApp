import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
import {LmsQuotationListPage} from '../lms-quotation-list/lms-quotation-list';


@IonicPage()
@Component({
    selector: 'page-lms-quotation-add',
    templateUrl: 'lms-quotation-add.html',
})
export class LmsQuotationAddPage {
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    
    @ViewChild(Navbar) navBar: Navbar;
    form:any={};
    type:any;
    id:any;
    filter:any={};
    dr_id:any;
    type_list:any=[];
    checkin_id:any;
    trimurtiBillingAddress:any;
    productGst:any;
    add_list:any=[];
    total_qty = 0;
    sub_total = 0;
    total_gst_amount = 0;
    grand_total = 0
    totaldiscount_amount=0
    amount:any;
    gst_amnt:any;
    total_amnt:any;
    netamount:any=0;
    category_list:any=[];
    
        
        constructor(public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams,public service1:MyserviceProvider) {
        
    }
    

    ionViewWillEnter() 
    {
        console.log(this.navParams);
        
        
        this.type=this.navParams.get('type');
        this.form.lead_type = this.type;
        console.log(this.type);
        
        this.form.dr_id={id:this.navParams.get('id'),company_name:this.navParams.get('company_name')};
        console.log(this.form.dr_id);
        
        console.log('ionViewDidLoad LmsQuotationAddPage');
        this.get_assign_dr(this.type);
        // this.get_item_list();
        // this.get_product_list();
        this.get_category();
        
        
        if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
            this.checkin_id=this.navParams.get('checkin_id');
            this.form.lead_type=this.navParams.get('dr_type');
            this.get_assign_dr( this.form.lead_type);
            
        }

        this.form.term_condition =  `<p>1.Total Amount will be paid by CHQ / RTGS /NEFT</p>
        <p>2.Taxes: GST 18% is including on net billed (as per actual).</p>
        <p>3.100 % amount needs to be paid in advance at the time of Poraise.</p>
        <p>4.Any discount or offers valid till 5 days post final quotation.</p>
        <p>5.Supply of order will depend on the quantity.</p>
        <p>6.TransportationCharges extra.</p>
        <p>7.After the material is ready, the client has to take his material within 30days.</p>
        <p>8.After 30 days Company will charge 2% storage penalty as per actual billed also company will not take any responsibility for any material damages</p>`
        
    }
    
    get_assign_dr(type_id)
    {
        this.filter.type_id = type_id;
        this.type_list = [];
        console.log(type_id);
        
        this.service1.addData({'dr_id':this.dr_id,"search":this.filter,},"Lead/getLeadList")
        .then(resp=>{
            console.log(resp);
            this.type_list = resp['dr_list'];
            console.log(this.type_list);
            
            if(this.navParams.get('dr_name')){
                this.form.dr_id= this.type_list.filter(row=>row.company_name == this.navParams.get('dr_name'));
                console.log(this.form.dr_id);
                this.form.dr_id=this.form.dr_id[0];
                console.log(this.form.dr_id);
                // this.test();
            }
            
        },
        err=>
        {
        })
    }
    
    item_list:any=[];
    get_category()
    {
        this.service1.addData({},"Lead/categoryList").then(resp=>{
            console.log(resp);
            this.category_list=resp;
        });
    }

    get_item_list()
    {
        console.log(this.form.category);
        let category = this.form.category.category;
        console.log(category);

        this.service1.addData({'category':category},"Lead/itemList").then(resp=>{
            console.log(resp);
            this.item_list = resp['data'];
            console.log(this.item_list);
        },
        err=>
        {
        })
    }
    
    product_list:any=[];
    
    get_product_Size(product_id)
    {
        console.log(product_id);
        
        this.service1.addData({},"Lead/getProductSize/"+product_id)
        .then(resp=>{
            console.log(resp);
            this.product_list = resp['data'];
            this.productGst = parseInt(resp['gst']); 
            
            for(let i = 0;i<this.product_list.length;i++){
                this.product_list[i].price = this.product_list[i].rate; 
            }
            console.log(this.product_list);
        },
        err=>
        {
        })
    }
  
    addtolist1()
    {
        console.log(this.form.item);
        console.log(this.form);
        
        let existIndex = this.add_list.findIndex(row=>row.id == this.form.item.id);  
        console.log(existIndex);
        
        let rowData = this.item_list.findIndex(row=>row.id == this.form.item.id)
        console.log(rowData);
        
        if(existIndex==-1)
        {

        let discount_percent = this.form.discount_percent?this.form.discount_percent:0;

            let other_discount_percent = this.form.other_discount_percent?this.form.other_discount_percent:0;
            let basic_discount_percent = this.form.basic_discount_percent?this.form.basic_discount_percent:0;
            let sd_discount_percent = this.form.sd_discount_percent?this.form.sd_discount_percent:0;
            let cd_discount_percent = this.form.cd_discount_percent?this.form.cd_discount_percent:0;

            let discount_amount ;
            let discount_amount0 ;

            let discount_amount1 ;

            let discount_amount2 ;

            let discount_amount3 ;

            let discounted_amount ;
            let discounted_amount1 ;
            let discounted_amount2 ;
            let discounted_amount3 ;


            this.amount=this.form.qty*this.item_list[rowData].rate;
            this.amount= parseFloat(this.amount.toFixed(2));
            discount_amount=((parseFloat(this.amount)*parseFloat(basic_discount_percent))/100).toFixed(2)  
            discounted_amount=(parseFloat(this.amount) - parseFloat(discount_amount)).toFixed(2);

            discount_amount0=((parseFloat(discounted_amount)*parseFloat(sd_discount_percent))/100).toFixed(2)  
            discounted_amount1=(parseFloat(discounted_amount) - parseFloat(discount_amount0)).toFixed(2);
            discount_amount2=((parseFloat(discounted_amount1)*parseFloat(cd_discount_percent))/100).toFixed(2)  
            discounted_amount2=(parseFloat(discounted_amount1) - parseFloat(discount_amount2)).toFixed(2);
            discount_amount3=((parseFloat(discounted_amount2)*parseFloat(other_discount_percent))/100).toFixed(2)  
            discounted_amount3=(parseFloat(discounted_amount2) - parseFloat(discount_amount3)).toFixed(2);

            discount_amount=parseFloat(discounted_amount3)

            this.gst_amnt=((discount_amount)*(this.item_list[rowData].gst))/100;
            this.gst_amnt= parseFloat(this.gst_amnt.toFixed(2));
            this.total_amnt=(parseFloat(this.gst_amnt)+parseFloat(discount_amount)).toFixed(2);

            this.add_list.push({
                product_name:this.item_list[rowData].product_name,
                id: this.item_list[rowData].id,
                product_code:this.item_list[rowData].product_code,
                product_type:this.form.product_type,
                qty:this.form.qty,
                price:this.item_list[rowData].rate,
                amount:this.amount,
                basic_discount_percent:this.form.basic_discount_percent,
                sd_discount_percent:this.form.sd_discount_percent,
               cd_discount_percent:this.form.cd_discount_percent,
                other_discount_percent:this.form.other_discount_percent,
                discount_percent:discount_percent,

                discount_amount:discount_amount,
                discounted_amount:discounted_amount3,
                gst_amount:this.gst_amnt,
                total_amount:this.total_amnt,
                gst:this.gst_amnt,
                gstPercentage:this.item_list[rowData].gst,
            });
        }
        else
        {
            let toast = this.toastCtrl.create({
                message: 'PRODUCT ALREADY ADDED PLEASE DELETE!',
                duration: 3000
            });
            toast.present();
            return;
            // this.add_list[existIndex].qty= parseInt(this.add_list[existIndex].qty) +  parseInt(this.form.qty);

            // this.add_list[existIndex].amount=this.add_list[existIndex].qty*this.add_list[existIndex].price;

            // this.add_list[existIndex].discount_amount=((parseFloat(this.add_list[existIndex].amount)*parseFloat(this.add_list[existIndex].discount_percent))/100).toFixed(2)
            // this.add_list[existIndex].discounted_amount=(parseFloat(this.add_list[existIndex].amount) - parseFloat(this.add_list[existIndex].discount_amount)).toFixed(2);
            // this.add_list[existIndex].gst_amount=((this.add_list[existIndex].discounted_amount)*(this.add_list[existIndex].gst))/100;
            // this.add_list[existIndex].total_amount=parseFloat(this.add_list[existIndex].discounted_amount+ this.add_list[existIndex].gst_amount).toFixed(2);
        }


        this.total_qty = 0;
        this.sub_total = 0;
        this.total_gst_amount = 0;
        this.totaldiscount_amount=0;
        this.grand_total=0;


        for(let i = 0; i < this.add_list.length; i++)
        {

            this.total_qty=parseFloat(this.add_list[i].qty) + this.total_qty;
            this.grand_total=parseFloat(this.add_list[i].total_amount) + this.grand_total;
            this.sub_total=parseFloat(this.add_list[i].amount) + this.sub_total;
            this.totaldiscount_amount=parseFloat(this.add_list[i].discount_amount) + this.totaldiscount_amount;
            this.total_gst_amount=parseFloat(this.add_list[i].gst) + this.total_gst_amount;

        }

        
        this.grand_total = parseFloat(this.grand_total.toFixed(2));
        this.total_gst_amount = parseFloat(this.total_gst_amount.toFixed(2));
        this.totaldiscount_amount = parseFloat(this.totaldiscount_amount.toFixed(2));
        this.sub_total = parseFloat(this.sub_total.toFixed(2));

        // console.log(this.grand_total);
             
        this.form.item='';
        this.form.qty='';
        // this.form.category='';
        this.form.discount_percent='';
    }
    
    
    addToList()
    {
        
        
        console.log(this.item_list);
        
        for(let i=0 ;i<this.add_list.length ;i++){
            
            for(let j=0 ;j<this.item_list.length ;j++){
                
                if((this.item_list[j].product_name == this.add_list[i].product_name)){
                    
                    this.add_list[i].qty=parseFloat(this.add_list[i].qty)+parseFloat(this.form.qty);
                    this.add_list[i].price=parseFloat(this.product_list[j].price);
                    this.add_list[i].amount=parseFloat(this.add_list[i].price)*parseFloat(this.add_list[i].qty);
                    this.add_list[i].gst=(parseFloat(this.add_list[i].amount)*parseFloat(this.add_list[i].gstPercentage))/100;
                    this.add_list[i].total_amount=parseFloat(this.add_list[i].gst)+parseFloat(this.add_list[i].amount);
                    this.total_qty = (this.total_qty + this.item_list[i]['qty']);
                    this.sub_total = (this.sub_total + this.product_list[i]['amount']);
                    this.total_gst_amount = (this.total_gst_amount + this.product_list[i]['gst']);
                    console.log(this.total_qty);
                    console.log(this.sub_total);
                    console.log(this.total_gst_amount);
                    this.item_list.splice(j, 1);
                    console.log(this.item_list);
                    
                }
               
            }
        }
        
        console.log(this.item_list.length);
        

        if(this.product_list.length>0){
            console.log("if flag is zero");
            
            for (let i = 0; i < this.product_list.length; i++) 
            {
                console.log(this.product_list[i]['qty']);
                console.log(this.product_list[i]['price']);
                
                if(this.product_list[i]['qty'] && this.product_list[i]['price'])
                {
                    this.product_list[i]['amount'] = (this.product_list[i]['qty']) * (this.product_list[i]['price']);
                    console.log(this.product_list[i]['amount']);
                    
                    this.add_list.push(this.product_list[i]);
                    
                    this.total_qty = this.total_qty + parseFloat(this.product_list[i]['qty']);
                    this.sub_total = this.sub_total + parseFloat(this.product_list[i]['amount']);
                    this.total_gst_amount = this.total_gst_amount + parseFloat(this.product_list[i]['gst']);
                    console.log(this.total_qty);
                    console.log(this.sub_total);
                    console.log(this.total_gst_amount);
                }
                
                console.log(this.add_list);
            }
            
        }
        this.product_list= [];
        this.form.item='';   
        this.grand_total=this.sub_total + this.total_gst_amount;
        console.log(this.grand_total);
        this.grand_total = parseInt(this.grand_total.toFixed());
        console.log(this.grand_total);

    }
    
    submit()
    {
        console.log("check");
        console.log(this.form);
        this.form.item = this.add_list;
        this.form.drId = this.form.dr_id.id;
        this.form.dr_name = this.form.dr_id.company_name;
        
        if(this.form.lead_type==1)
        {
            this.form.type = 'Distributor'
        }
        if(this.form.lead_type==3)
        {
            this.form.type = 'Dealer'
        }
        if(this.form.lead_type==5)
        {
            this.form.type = 'End user'
        }
        if(this.form.lead_type==9)
        {
            this.form.type = 'Project'
        }
        if(this.form.lead_type==7)
        {
            this.form.type = 'Direct Dealer'
        }
        if(this.form.lead_type==6)
        {
            this.form.type = 'Others'
        }
        
        this.form.total_qty = this.total_qty
        this.form.total_amount = this.sub_total
        this.form.grand_total = this.grand_total
        this.form.total_discount = this.totaldiscount_amount
        this.form.gst_amount = this.total_gst_amount
        
        this.form.checkin_id=this.checkin_id;
        this.service1.show_loading();
        this.service1.addData({"data":this.form,},"Lead/quotationAdd")
        
        .then(resp=>{
            
            console.log(resp);    
            // this.addToList();
            // this.db.dismiss()
            
            if(resp['status'] == 'Success')
            {
                console.log('success');
                this.service1.dismiss();
                this.service1.presentToast("Successfully Added");
                this.navCtrl.pop();
                if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
                    
                }
                else{
                    this.navCtrl.push(LmsQuotationListPage);
                }
            }
        },
        err=>{
            this.service1.dismiss();
        });
    }
    
    listdelete(i)
    {
        this.add_list.splice(i, 1);
        
        // this.total_qty = 0;
        // this.sub_total = 0;
        // this.total_gst_amount = 0;
        // this.grand_total = 0
        
        
        // for (let i = 0; i < this.add_list.length; i++) 
        // {    
        //     this.total_qty = this.total_qty + this.add_list[i]['qty'];
        //     this.sub_total = this.sub_total + this.add_list[i]['amount'];
        //     this.total_gst_amount = this.total_gst_amount + this.add_list[i]['gst'];
        // }
        // this.grand_total=this.sub_total + this.total_gst_amount;
        // console.log(this.grand_total);

        this.total_qty = 0;
        this.sub_total = 0;
        this.total_gst_amount = 0;
        this.totaldiscount_amount=0;
        this.grand_total=0;


        for(let i = 0; i < this.add_list.length; i++)
        {
            this.total_qty=parseFloat(this.add_list[i].qty) + this.total_qty;
            this.grand_total=parseFloat(this.add_list[i].total_amount) + this.grand_total;
            this.sub_total=parseFloat(this.add_list[i].amount) + this.sub_total;
            this.totaldiscount_amount=parseFloat(this.add_list[i].discount_amount) + this.totaldiscount_amount;
            this.total_gst_amount=parseFloat(this.add_list[i].gst) + this.total_gst_amount;
        }
        
        this.grand_total = parseFloat(this.grand_total.toFixed(2));
        this.total_gst_amount = parseFloat(this.total_gst_amount.toFixed(2));
        this.totaldiscount_amount = parseFloat(this.totaldiscount_amount.toFixed(2));
        this.sub_total = parseFloat(this.sub_total.toFixed(2));
    }
    
    MobileNumber(event: any) 
    {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) 
        {event.preventDefault(); }
    }
    
    getTrimurtiBillingAddress(){
        console.log("getTrimurtiBillingAddress function call");
        this.service1.addData({ }, "Lead/company_address").then((result) => {
            console.log(result);
            this.trimurtiBillingAddress = result['data'];
            // if (this.trimurtiBillingAddress.length == 0) {
            //     this.noTrimurtiBillingAddress=true;
            // }
            // else {
            //     this.noTrimurtiBillingAddress=false;
            // }
        })
    }
    
    triggerMethod(value){
        if(value == 'billingAddress'){
            console.log(this.form.billing);
            this.form.selectedTrimurtiBillingAddressDetail=this.form.billing['address'];
        }
        else if(value == 'checkGST'){
            console.log(this.product_list);
            
        }
        
    }
    
    conInt(val)
    {
        return parseInt(val)
    }
    
    
    
    
    
    
    
}
