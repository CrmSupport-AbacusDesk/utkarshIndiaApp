import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController} from 'ionic-angular';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { ConstantProvider } from '../../../providers/constant/constant';
import {ContractorModalPage} from '../../Contractor-Meet/contractor-modal/contractor-modal';
import { ModalController } from 'ionic-angular';
// import { FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';




@IonicPage()
@Component({
  selector: 'page-announcement-detail',
  templateUrl: 'announcement-detail.html',
})
export class AnnouncementDetailPage 
{
  noticeId:any='';
  announcementDetail:any={}
  image_url:any=''
  
 

  constructor(
             public navCtrl: NavController, 
             public navParams: NavParams,
             public db:MyserviceProvider,
             public constant:ConstantProvider,
             public modalCtrl: ModalController,
             public file:File,
             private fileOpener: FileOpener,
             private transfer: FileTransfer,
             public toastCtrl: ToastController
             ) 
  {

    this.noticeId=this.navParams.get("id");
    console.log(this.constant);
    
    this.image_url = this.constant.upload_url1 + 'notices/'
    this.getAnnouncementDetail();
  }

  ionViewDidLoad() 
  {
    console.log('ionViewDidLoad AnnouncementDetailPage');
  }

  getAnnouncementDetail()
  {
        this.db.presentLoading();
        this.db.addData({'noticeId':this.noticeId},"AppAnnouncement/announcementDetail").then(resp=>
        {
      if(resp['statusCode']==200){
            this.db.dismissLoading();
            this.announcementDetail= resp['result'];
      }else{
        this.db.dismissLoading();
        this.db.errorToast(resp['statusMsg'])
      }
        },err=>
        {
          this.db.dismissLoading();
          this.db.errorToast('Something went wrong')
        })
  }
  openDocument(imageSource,type,doc_name)
    { 
      if(type=='pdf' || type=='docx' )
        {
          const fileTransfer: FileTransferObject = this.transfer.create();
        //  console.log(this.url ,"url");
         console.log(this.file);      
         console.log("hiiiii")
         fileTransfer.download(imageSource, this.file.externalApplicationStorageDirectory  + '/Download/' + doc_name).
         then((entry) => {
             console.log('download complete: ' + entry.toURL());
             var url=entry.toURL()
         console.log("hiiiii2")
      this.fileOpener.open(url, 'application/pdf')
      
         console.log(this.file ,"dfsgdfsgdfs");
        
      
         });
        
      
                      // console.log('in if block');
                      
                      // const fileTransfer: FileTransferObject = this.transfer.create();
                      // console.log('type',type);
                      // console.log('doc_name',doc_name);
                      // console.log('imageSource',imageSource);
                      // console.log( this.file.externalRootDirectory);
                      // console.log(this.file.externalRootDirectory + '/Download/' + doc_name);
                      
                      // fileTransfer.download(imageSource, this.file.externalRootDirectory + '/Download/' + doc_name).then((entry) => {
                      //     console.log('download complete: ' + entry.toURL());
                      //     var url=entry.toURL()
                      //     console.log("hiiiii2")
                      //  this.fileOpener.open(url, 'application/pdf')
                      //     this.presentToast2();
                      // });
        }
        else
        {
          console.log('in else block');
          console.log(imageSource);
      this.modalCtrl.create(ContractorModalPage, {"img": imageSource}).present();
        }
      }
      presentToast2() 
      {
          let toast = this.toastCtrl.create({
              message: 'PDF Download Successfully, Check in your downloads',
              duration: 3000,
              position: 'bottom'
          });
          
          toast.present();
      }
  // openDocument(imageSource){
  //   console.log(imageSource);
  //   this.modalCtrl.create(ContractorModalPage, {"img": imageSource}).present();
  //   //I was able to find out only opening another page in the other sources like
  //   // this.modalCtrl.create(LoginPage, {}, { enableBackdropDismiss: false }).present();
  
  //   //How can i display the image on modal on click over the view image..
  // }

}
// openDocument(imageSource,type,doc_name)
//   { 
//     if(type=='pdf')
//       {
                    
//                     const fileTransfer: FileTransferObject = this.transfer.create();
                    
//                     fileTransfer.download(imageSource, this.file.externalRootDirectory + '/Download/' + doc_name).then((entry) => {
//                         console.log('download complete: ' + entry.toURL());
//                     });
//       }
//       else
//       {
//     console.log(imageSource);
//     this.modalCtrl.create(ContractorModalPage, {"img": imageSource}).present();
//       }