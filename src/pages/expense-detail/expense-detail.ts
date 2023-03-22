import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ConstantProvider } from '../../providers/constant/constant';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';
import { Storage } from '@ionic/storage';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { File } from '@ionic-native/file';
import { ViewProfilePage } from '../view-profile/view-profile';

@IonicPage()
@Component({
  selector: 'page-expense-detail',
  templateUrl: 'expense-detail.html',
})
export class ExpenseDetailPage {

  expenseId:any='';
  userId:any='';
  expenseDetail:any={}
  expand_local:any =false;
  expand_travel:any =false;
  expand_food:any =false;
  expand_hotel:any =false;
  expand_misc:any =false;

  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public serve:MyserviceProvider,
              public modalCtrl: ModalController,
              public constant:ConstantProvider,
              public storage: Storage,  private transfer: FileTransfer,public file:File,private fileOpener: FileOpener
             ) 
             
  {
    this.expenseId=this.navParams.get("id");

    this.storage.get('userId').then((resp)=>
    {
        this.userId = resp
    });

    
    this.getExpenseDetail();
 
  }


  getExpenseDetail()
  {
        this.serve.presentLoading();
        this.serve.addData({'expenseId':this.expenseId},"AppExpense/expenseDetail").then(resp=>
        {
         
            this.expenseDetail= resp['expense'];
            this.serve.dismissLoading();
            
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismiss();
        })
  }

  statusModal1(type) 
  {
    

    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'expenseId':this.expenseId,'expensetype':this.expenseDetail.expenseType,'from':'expenseedit'});

    modal.onDidDismiss(data =>
    {
        this.getExpenseDetail();
    });
    
    modal.present();
  }
  goOnExpenseAdd()
  {
      this.navCtrl.push(ExpenseAddPage,{'data':this.expenseDetail});

  }
  statusModal(type) 
  {
    let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'expenseId':this.expenseId,'from':'expense'});

    modal.onDidDismiss(data =>
    {
        this.getExpenseDetail();
    });
    
    modal.present();
  }
url:any
openimage(path){
  this.serve.presentLoading()

  var pdfName = '0.8mm.pdf';
  
  const fileTransfer: FileTransferObject = this.transfer.create();
  
  this.url = path;
  

  fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + pdfName).
  then((entry) => {
      
      
      var url=entry.toURL()

      this.fileOpener.open(url, 'image/jpeg')
   this.serve.dismissLoading()
      
      
  });
}

imageModal(src) {
  this.modalCtrl.create(ViewProfilePage, { "Image": src }).present();
}

}
