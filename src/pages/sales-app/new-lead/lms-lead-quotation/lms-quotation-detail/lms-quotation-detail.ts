import { Component,ViewChild } from '@angular/core';
import { IonicPage,Navbar, NavController, NavParams,ActionSheetController,AlertController, ToastController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';
import { DbserviceProvider } from '../../../../../providers/dbservice/dbservice';
import { ConstantProvider } from '../../../../../providers/constant/constant';
import {LmsQuotationListPage} from '../lms-quotation-list/lms-quotation-list';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
// declare var DocumentViewer: any;
// declare var DocumentViewer: any;
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-lms-quotation-detail',
  templateUrl: 'lms-quotation-detail.html',
})
export class LmsQuotationDetailPage {
  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
  @ViewChild(Navbar) navBar: Navbar;
  pdfUrl:any;
  
  form:any={};
  type:any;
  id:any;
  status:any;
  filter:any={};
  dr_id:any;
  type_list:any=[];
  add_list:any=[];
  add_list1:any=[];
  add_list2:any=[];
  item_list:any=[];
  data:any={};
  product_list:any=[];
  mode=1;
  quotationID:any;
  drMailId:any;
  total_qty = 0;
  sub_total = 0;
  total_gst_amount = 0;
  grand_total = 0
  productGST=-1;
  netamount = 0;
  totaldiscount_amount = 0
  category_list:any=[];
  amount:any;
  gst_amnt:any;
  total_amnt:any;
  
  Quotation_list:any=[];

  constructor(private transfer: FileTransfer,private fileOpener: FileOpener,public file:File,public alertCtrl: AlertController,public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public modalCtrl: ModalController,public service1: MyserviceProvider, public service:DbserviceProvider,public serve:DbserviceProvider,private constant:ConstantProvider, public toastCtrl: ToastController,private document: DocumentViewer) 
  {
    this.pdfUrl = this.constant.upload_url1 +'QuotationPdf/';
        console.log(constant);
    console.log(this.navParams);
    this.id=this.navParams['data']['id'];
    this.status=this.navParams['data']['status'];
    console.log(this.id);
    this.quotationdetail();
    this.get_category();

    // this.get_item_list();
    
  }
  
  quotationdetail()
  {
    this.service1.FileData2(this.id,"Lead/getQuotationDetail/").subscribe(resp=>{
      console.log(resp);
      this.Quotation_list = resp['data'];
      this.quotationID=resp['data']['id'];
      this.drMailId = resp['email']['email'];
      console.log(this.drMailId);
      console.log(this.quotationID);
      console.log(this.Quotation_list);
      this.form.dr_id=this.Quotation_list.dr_id;
      this.form.lead_type=this.Quotation_list.type;
      this.form.term_condition=this.Quotation_list.term_condition;
      this.add_list1=[];
      this.product_list=this.Quotation_list.quotation_item;
      for (let i = 0; i < this.product_list.length; i++) 
      {
        this.product_list[i]['price']=this.product_list[i]['rate'];
        console.log(this.product_list[i]['qty']);
        console.log(this.product_list[i]['price']);
      }
      this.addToList1();
      
    },
    err=>
    {
    })
  }
  
  quotationtermcondition(terms)
  {
    console.log(terms);
    console.log(this.Quotation_list.id);
    
    this.Quotation_list.id=parseInt(this.Quotation_list.id);
    this.service1.addData({'quotation_id':this.Quotation_list.id,'term_condition':terms},"Lead/quotation_termsUpdate")
    .then(resp=>{
      console.log(resp);
      if(resp['status'] == 'Success')
      {  
        this.service1.presentToast("Successfully added"); 
      }
      
    },
    err=>
    {
    })
  }

  get_category()
  {
      this.service1.addData({},"Lead/categoryList").then(resp=>{
          console.log(resp);
          this.category_list=resp;
      });
  }
  
  get_item_list()
  { 
    let category ='';
    if(this.form.category)
    category = this.form.category.category;

    this.service1.addData({'category':category},"Lead/itemList")
    .then(resp=>{
      console.log(resp);
      this.item_list = resp['data'];
      console.log(this.item_list);
    },
    err=>
    {
    })
  }
  
  
  get_product_Size(product_id)
  {
    console.log(product_id);
    
    this.service1.addData({},"Lead/getProductSize/"+product_id).then(resp=>{
      console.log(resp);
      this.product_list = resp['data'];
      this.productGST=parseInt(resp['gst']);
      console.log(this.productGST);
      console.log(this.product_list);
      if(this.product_list.length > 0)
      {
        for(let i = 0 ; i< this.product_list.length ; i++){
          this.product_list[i].price = this.product_list[i].rate 
          this.product_list[i].gst_percent = this.productGST

        }
      }
      console.log(this.product_list);
    },
    err=>
    {
    })
  }


  addToList()
  {
        console.log(this.form.item);
        
        let existIndex = this.add_list.findIndex(row=>row.product_code == this.form.item.product_code);  
        let rowData = this.item_list.findIndex(row=>row.id == this.form.item.id)
        
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
          {
              let toast = this.toastCtrl.create({
                  message: 'PRODUCT ALREADY ADDED PLEASE DELETE!',
                  duration: 3000
              });
              toast.present();
              return;
          }
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

        this.sub_total = parseFloat(this.sub_total.toFixed());
        this.total_gst_amount = parseFloat(this.total_gst_amount.toFixed());
      
        this.data.total_qty=this.total_qty;
        this.data.total_qty=this.total_qty;
        this.data.total_amount=this.sub_total;
        this.data.total_gst_amount=this.total_gst_amount;
      
        this.grand_total = parseFloat(this.grand_total.toFixed());
             
        this.form.item='';
        this.form.qty='';
        this.form.price='';
        this.form.category='';


    }
  
  
  
  addToList1()
  {
  
    for(let i=0 ;i<this.add_list.length ;i++)
    {
      
      for(let j=0 ;j<this.product_list.length ;j++){

        if((this.product_list[j].product_name == this.add_list[i].product_name) && (this.product_list[j].product_code == this.add_list[i].product_code))
        {
          
          this.add_list[i].qty=parseFloat(this.add_list[i].qty)+parseFloat(this.product_list[j].qty);
          this.add_list[i].price=parseFloat(this.product_list[j].price);
          this.add_list[i].amount=(parseFloat(this.add_list[i].price)*parseFloat(this.add_list[i].qty)).toFixed(2);

          this.add_list[i].discount_amount=((parseFloat(this.add_list[i].amount)*parseFloat(this.add_list[i].discount_percent))/100).toFixed(2)
          this.add_list[i].discounted_amount=(parseFloat(this.add_list[i].amount) - parseFloat(this.add_list[i].discount_amount)).toFixed(2);
         
          this.add_list[i].gst_amount=((parseFloat(this.add_list[i].discounted_amount)*(this.productGST))/100).toFixed(2);
          this.product_list[i].gstPercentage=(this.productGST);
          this.add_list[i].gst_percent=(this.productGST);
          this.add_list[i].total_amount=(parseFloat(this.add_list[i].gst_amount)+parseFloat(this.add_list[i].discounted_amount)).toFixed(2);
          this.product_list.splice(j, 1);
          console.log(this.product_list);
        }
        
      }
    }
    
    
    if(this.product_list.length>0)
    {
      for (let i = 0; i < this.product_list.length; i++) 
      {
        console.log(this.product_list[i]['qty']);
        console.log(this.product_list[i]['price']);
          this.productGST=this.product_list[i]['gst_percent'];
        
        if(this.product_list[i]['qty'] && this.product_list[i]['price'])
        {
          this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['price']);
          this.product_list[i].discount_amount=((parseFloat(this.product_list[i].amount)*parseFloat(this.product_list[i].discount_percent))/100).toFixed(2)
          this.product_list[i].discounted_amount=(parseFloat(this.product_list[i].amount) - parseFloat(this.product_list[i].discount_amount)).toFixed(2);
          this.product_list[i].gst_amount=((parseFloat(this.product_list[i].discounted_amount)*(this.productGST))/100).toFixed(2);
          this.product_list[i].total_amount=(parseFloat(this.product_list[i].gst_amount)+parseFloat(this.product_list[i].discounted_amount)).toFixed(2);
          this.product_list[i].gstPercentage=(this.productGST);
          this.product_list[i].gst_percent=(this.productGST);
          this.add_list.push(this.product_list[i]);
        }
      }
    }

    console.log(this.add_list);
    this.product_list= [];
    this.form.item='';   
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
            this.total_gst_amount=parseFloat(this.add_list[i].gst_amount) + this.total_gst_amount;
        }

        this.sub_total = parseFloat(this.sub_total.toFixed());
        this.total_gst_amount = parseFloat(this.total_gst_amount.toFixed());
      
        this.data.total_qty=this.total_qty;
        this.data.total_amount=this.sub_total;
        this.data.total_gst_amount=this.total_gst_amount;
      
        this.grand_total = parseFloat(this.grand_total.toFixed());
    
  }
  
  
  callit()
  {
    console.log(this.product_list);
    console.log(this.productGST);

    this.addToList();
    this.submit();
  }
  
  submit()
  {
            for (let index = 0; index < this.add_list.length; index++) 
            {
              this.add_list[index].id=parseInt(this.add_list[index].id);
              this.add_list[index].product_id=this.add_list[index].id;
            } 

            this.form.item = []; 
            this.form.quotation_id=parseInt(this.Quotation_list.id);  
            this.form.item = this.add_list;
            this.form.drId = this.form.dr_id.id;
            this.form.dr_name = this.form.dr_id.company_name;
            
            this.form.total_qty = this.total_qty
            this.form.total_amount = this.data.total_amount
            this.form.gst_amount = this.data.total_gst_amount
            this.form.total_discount = this.totaldiscount_amount
            this.form.grand_total = this.grand_total
            
            
            console.log(this.form);

            this.service1.addData({"data":this.form},"Lead/quotation_item_update")
            .then(resp=>{
              console.log(resp);
              let toast = this.toastCtrl.create({
                message: 'item added!',
                duration: 3000
              });
              if(resp['status'] == 'Success')
              {
            
                this.service1.presentToast("Successfully added");
            
                console.log(this.data);
                this.data={};
                // this.navCtrl.pop();
                // this.navCtrl.push(LmsQuotationListPage);
              }
            });

          // }
        // },
        // {
        //   text: 'No',
        //   role: 'cancel',
        //   handler: () => {
            
        //     // this.addToList();
        //   }
        // }
    //   ]
    // });
    // alert.present();
    
    // this.service1.addData({"data":this.form,},"Lead/quotation_item_update")
    // .then(resp=>{
    
    //     console.log(resp);
    // this.addToList();
    // this.db.dismiss()
    
    // if(resp['status'] == 'Success')
    // {
    //     this.service1.presentToast("Successfully Added");
    // this.navCtrl.pop();
    // this.navCtrl.push(LmsQuotationListPage);
    //     }
    // },
    // err=>{
    // });
  }
  
  
  listdelete(i,id,quotation_id)
  {
    
    let alert = this.alertCtrl.create({
      title: 'Delete item',        
      message: 'Do you want to delete item?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Yes',
          handler: () => 
          {  this.add_list.splice(i, 1);
            this.product_list=this.add_list;
            this.add_list=[];
            this.total_qty=0;
            this.sub_total = 0;
            this.total_gst_amount=0;
            this.netamount=0; 
            this.addToList1();
            console.log(i);
            console.log(this.data);
            this.data.grand_total = this.grand_total
            console.log(id);
            console.log(quotation_id);
            this.service1.addData({"id":id,"quotation_id":quotation_id,"data":this.data},"Lead/delete_quotation_item")
            .then(resp=>{
              console.log(resp);
              
              let toast = this.toastCtrl.create({
                message: 'item Deleted!',
                duration: 3000
              });
              if(resp['status'] == 'Success')
              {
                
                this.service1.presentToast("Successfully deleted");
                
                console.log(this.data);
                this.data={};
                
              }
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
  
  MobileNumber(event: any) 
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
  url:any
  sendEmail(){
    console.log(this.quotationID);
    this.service1.show_loading()
    this.service1.addData({'quotation_id': this.quotationID},"Cron/quotationemail")
    .then(resp=>{
      console.log(resp);
      if(resp == 'success')
            {
                console.log(this.pdfUrl,"url78");

                var pdfName = this.quotationID +'.pdf';

                const fileTransfer: FileTransferObject = this.transfer.create();
                
                 this.url = this.pdfUrl + this.quotationID +'.pdf';
                
                console.log(this.url ,"url");
                console.log(this.file);

                console.log("hiiiii")
                fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + pdfName).
                then((entry) => {
                  

                    console.log('download complete: ' + entry.toURL());
                    var url=entry.toURL()
                console.log("hiiiii2")
            // this.fileOpener.open(url, 'application/pdf')

            //     console.log(this.file ,"dfsgdfsgdfs");
               

                });
                
            }
      this.service1.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Mail Send Successfully!',
        duration: 3000
      });
      
      
      if(resp == 'success')
      { 
        toast.present();
      }
    },
    err=>
    {
      this.service1.dismiss();
      this.service1.errToasr();
    })
  
  }

  downloadViewImage(){
    this.service1.show_loading()

    var pdfName = this.quotationID +'.pdf';

    const fileTransfer: FileTransferObject = this.transfer.create();
                
    this.url = this.pdfUrl + this.quotationID +'.pdf';
   
   console.log(this.url ,"url");
   console.log(this.file);

   console.log("hiiiii")
   fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + pdfName).
   then((entry) => {
     

       console.log('download complete: ' + entry.toURL());
       var url=entry.toURL()
   console.log("hiiiii2")
this.fileOpener.open(url, 'application/pdf')

   console.log(this.file ,"dfsgdfsgdfs");
   this.service1.dismiss();
  

   });
  

 }


  conInt(val)
  {
      return parseInt(val)
  }
  
  
}
