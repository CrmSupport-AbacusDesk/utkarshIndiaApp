import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
 import { MyserviceProvider } from '../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';
 import {LmsQuotationListPage} from '../../pages/sales-app/new-lead/lms-lead-quotation/lms-quotation-list/lms-quotation-list';
 


/**
 * Generated class for the RequirementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requirement',
  templateUrl: 'requirement.html',
})
export class RequirementPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    
  @ViewChild(Navbar) navBar: Navbar;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider,public alertCtrl: AlertController,public toastCtrl: ToastController) {
      
  }
  
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
  
  ionViewWillEnter() {
      console.log(this.navParams);
      
      
      this.type=this.navParams.get('type');
      this.form.lead_type = this.type;
      console.log(this.type);
      
      this.form.dr_id={id:this.navParams.get('id'),company_name:this.navParams.get('company_name')};
      console.log(this.form.dr_id);
      
      console.log('ionViewDidLoad LmsQuotationAddPage');
      this.get_assign_dr(this.type);
    //   this.get_item_list();
      // this.get_product_list();
      this. get_category();
      
      
      if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
          this.checkin_id=this.navParams.get('checkin_id');
          this.form.lead_type=this.navParams.get('dr_type');
          this.get_assign_dr( this.form.lead_type);
          
      }
      
  }
  
  get_assign_dr(type_id)
  {
      this.filter.type_id = type_id;
      this.type_list = [];
      console.log(type_id);
      
      this.db.addData({'dr_id':this.dr_id,"search":this.filter,},"Lead/getLeadList")
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
  
  get_item_list()
  {
    let category = this.form.category.category;

      this.db.addData({'category':category},"Lead/itemList").then(resp=>{
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
      
      this.db.addData({},"Lead/getProductSize/"+product_id)
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

  get_category()
  {
    this.db.addData({},"Lead/categoryList")
    .then(resp=>{
        console.log(resp);
        this.category_list=resp;
    });
  }
  category_list:any=[];
  addToList1(){
    let  item=[];
    item.push({'id':this.form.item.id,'qty':this.form.qty})
    
    this.db.addData({item,'dr_id':this.form.dr_id.id},"Lead/requirementAdd")
    .then(resp=>{
    })
  }
  requirement_list:any=[];
  addtolist2()
  {
    console.log(this.form.item);
    console.log(this.form.product_name);
    console.log(this.form.item.id);
    console.log(this.requirement_list.findIndex(row=>row.id));

    let existIndex = this.requirement_list.findIndex(row=>row.id == this.form.item.id);    
    
    console.log(existIndex);
    if(existIndex==-1)
    {
      let rowData = this.item_list.findIndex(row=>row.id == this.form.item.id)
      console.log(rowData);
      
      this.requirement_list.push({
        // category_name: this.requiredata.category,
        id:this.form.item.id,
        product_name:this.item_list[rowData].product_name,
        qty: this.form.qty,
        }); 
    }
    else
    {
      this.requirement_list[existIndex].qty= parseInt(this.requirement_list[existIndex].qty) +  parseInt(this.form.qty);
      console.log(this.requirement_list[existIndex].qty);
      console.log(this.form.qty);  
    }
    
    this.form.category={};
    this.form.item={};
    this.form.qty='';
   
   
   
    console.log(this.requirement_list);
    

  }
  delete_requirement(id){
    console.log(id);
   

    let alert = this.alertCtrl.create({
        title: 'Delete item',        
        message: 'Do you want to delete item?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => 
            { 
              this.db.addData({'id':id},"Lead/deleteRequirement")
      .then(resp=>{
        console.log(resp);
        
                let toast = this.toastCtrl.create({
                  message: 'item Deleted!',
                  duration: 3000
                });
                if(resp['msg']=="Deleted"){
                    // this.get_Quotation_list(); 
                }
              },
              err=>
              {
              });
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
            
                // this.addToList();
            }
          }
        ]
      });
      alert.present();
}
  

  add_requirement()
  {
 
    this.db.addData({'item':this.requirement_list,'dr_id':this.form.dr_id.id},"Lead/requirementAdd").then(resp=>{
        if(resp['status'] == 'Success')
          {
              console.log('success');
              this.db.presentToast("Successfully Added");
              this.navCtrl.pop();
              console.log(this.form.dr_id.id);
              
            //   if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
                  
            //   }
            //   else{
            //       this.navCtrl.push(LmsQuotationListPage);
            //   }
          }
    });

  }

//   addToList()
//   {
//       console.log('in addtolist');
//       console.log(this.add_list);
      
      
//       console.log(this.product_list);
      
//       for(let i=0 ;i<this.add_list.length ;i++){
          
//           for(let j=0 ;j<this.product_list.length ;j++){
              
//               if((this.product_list[j].product_name == this.add_list[i].product_name) && (this.product_list[j].product_size == this.add_list[i].product_size)){
                  
//                   this.add_list[i].qty=parseFloat(this.add_list[i].qty)+parseFloat(this.product_list[j].qty);
//                   this.add_list[i].price=parseFloat(this.product_list[j].price);
//                   this.add_list[i].amount=parseFloat(this.add_list[i].price)*parseFloat(this.add_list[i].qty);
//                   this.add_list[i].gst=(parseFloat(this.add_list[i].amount)*parseFloat(this.add_list[i].gstPercentage))/100;
//                   this.add_list[i].total_amount=parseFloat(this.add_list[i].gst)+parseFloat(this.add_list[i].amount);
//                   this.total_qty = (this.total_qty + this.product_list[i]['qty']);
//                   console.log(this.total_qty);
//                   this.sub_total = (this.sub_total + this.product_list[i]['amount']);
//                   this.total_gst_amount = (this.total_gst_amount + this.product_list[i]['gst']);
//                   console.log(this.total_qty);
//                   console.log(this.sub_total);
//                   console.log(this.total_gst_amount);
//                   this.product_list.splice(j, 1);
//                   console.log(this.product_list);
                  
//               }
             
//           }
//       }
      
//       console.log(this.product_list.length);
      

//       if(this.product_list.length>0){
//           console.log("if flag is zero");
          
//           for (let i = 0; i < this.product_list.length; i++) 
//           {
//               console.log(this.product_list[i]['qty']);
//               console.log(this.product_list[i]['price']);
              
//               if(this.product_list[i]['qty'] && this.product_list[i]['price'])
//               {
//                   this.product_list[i]['amount'] = (this.product_list[i]['qty']) * (this.product_list[i]['price']);
//                   console.log(this.product_list[i]['amount']);
                  
//                   this.add_list.push(this.product_list[i]);
                  
//                   this.total_qty = this.total_qty + parseFloat(this.product_list[i]['qty']);
//                   this.sub_total = this.sub_total + parseFloat(this.product_list[i]['amount']);
//                   this.total_gst_amount = this.total_gst_amount + parseFloat(this.product_list[i]['gst']);
//                   console.log(this.total_qty);
//                   console.log(this.sub_total);
//                   console.log(this.total_gst_amount);
//               }
              
//               console.log(this.add_list);
//           }
          
//       }
//       this.product_list= [];
//       this.form.item='';   
//       this.grand_total=this.sub_total + this.total_gst_amount;
//       console.log(this.grand_total);
//       this.grand_total = parseInt(this.grand_total.toFixed());
//       console.log(this.grand_total);

//   }
  
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
      if(this.form.lead_type==10)
      {
          this.form.type = 'Contractor'
      }
      if(this.form.lead_type==11)
      {
          this.form.type = 'Architect'
      }
      if(this.form.lead_type==15)
      {
          this.form.type = 'Customer'
      }
      if(this.form.lead_type==13)
      {
          this.form.type = 'Builder'
      }
      if(this.form.lead_type==14)
      {
          this.form.type = 'Cement Dealer'
      }
      this.form.total_qty = this.total_qty
      this.form.total_amount = this.sub_total
      this.form.grand_total = this.grand_total
      this.form.gst_amount = this.total_gst_amount
      
      this.form.checkin_id=this.checkin_id;
      this.db.show_loading();
      console.log(this.form);
      
      this.db.addData({"data":this.form},"Lead/quotationAdd")
      
      .then(resp=>{
          
          console.log(resp);    
          // this.addToList();
          // this.db.dismiss()
          
          if(resp['status'] == 'Success')
          {
              console.log('success');
              this.db.dismiss();
              this.db.presentToast("Successfully Added");
              this.navCtrl.pop();
              if(this.navParams.get('dr_type') && this.navParams.get('dr_name')){
                  
              }
              else{
                  this.navCtrl.push(LmsQuotationListPage);
              }
          }
      },
      err=>{
          this.db.dismiss();
      });
  }
  
  listdelete(i)
  {
      this.requirement_list.splice(i, 1);
      
    //   this.total_qty = 0;
    //   this.sub_total = 0;
    //   this.total_gst_amount = 0;
    //   this.grand_total = 0
      
      
    //   for (let i = 0; i < this.add_list.length; i++) 
    //   {    
    //       this.total_qty = this.total_qty + this.add_list[i]['qty'];
    //       this.sub_total = this.sub_total + this.add_list[i]['amount'];
    //       this.total_gst_amount = this.total_gst_amount + this.add_list[i]['gst'];
    //       console.log(this.total_qty);
    //       console.log(this.sub_total);
    //       console.log(this.total_gst_amount);
          
    //   }
    //   this.grand_total=this.sub_total + this.total_gst_amount;
    //   console.log(this.grand_total);
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
      this.db.addData({ }, "Lead/company_address").then((result) => {
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
