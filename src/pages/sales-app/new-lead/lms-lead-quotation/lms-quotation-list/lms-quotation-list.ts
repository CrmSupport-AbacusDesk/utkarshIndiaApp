import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController} from 'ionic-angular';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';
import { LmsQuotationAddPage } from '../lms-quotation-add/lms-quotation-add';
import {LmsQuotationDetailPage} from '../lms-quotation-detail/lms-quotation-detail';


@IonicPage()
@Component({
    selector: 'page-lms-quotation-list',
    templateUrl: 'lms-quotation-list.html',
})
export class LmsQuotationListPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public db:MyserviceProvider,public alertCtrl: AlertController,public toastCtrl: ToastController) {
    }
    
    type:any;
    id:any;
    company_name:any;
    
    ionViewWillEnter() {
        this.type=this.navParams.get('type');
        this.id=this.navParams.get('id');
        this.company_name=this.navParams.get('company_name');
        console.log(this.type);
        console.log(this.id);
        console.log(this.company_name);
        this.get_Quotation_list();
        console.log('ionViewDidLoad LmsQuotationListPage');
    }
    
    
    Quotation_list:any = [];
    get_Quotation_list()
    {
      this.db.show_loading(); 
        var value = {'dr_id':this.id};
        this.db.addData({'data':value},"Lead/quotationList")
        .then(resp=>{
            console.log(resp);
        this.db.dismiss();

            this.Quotation_list = resp['data'];
            console.log(this.Quotation_list);
        },
        err=>
        {
        })
        this.db.dismiss();
    }
    

    delete_quotation(id){
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
                  this.db.addData({'id':id},"Lead/delete_quotation")
          .then(resp=>{
            console.log(resp);
            
                    let toast = this.toastCtrl.create({
                      message: 'item Deleted!',
                      duration: 3000
                    });
                    if(resp['msg']=="Deleted"){
                        this.get_Quotation_list(); 
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
    
    quotationdetail(id,status){
        this.navCtrl.push(LmsQuotationDetailPage,{'id':id,'status':status})

    }
    
    addQuotation(type,id,company_name)
    {
        console.log(this.type);
        console.log(this.id);
        this.navCtrl.push(LmsQuotationAddPage,{'type':type,'id':id,'company_name':company_name})
    } 
    
    doRefresh (refresher)
    {   
        this.get_Quotation_list() 
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}
