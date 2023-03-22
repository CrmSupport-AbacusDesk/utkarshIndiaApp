import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';

import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ExpenseStatusModalPage } from '../expense-status-modal/expense-status-modal';


@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  filter:any={};
  date:any;

  requestSend:any = false;

  report_count_data: any;
  attendence_count: any = 0;
  checkin_count: any = 0;
  event_count: any = 0;
  expense_count: any = 0;
  leave_count: any = 0;
  travel_count : any = 0;
  secondary_count : any = 0;

  primary_count : any = 0;



  constructor(public navCtrl: NavController,private fileOpener: FileOpener,public file:File,private transfer: FileTransfer, public navParams: NavParams,private app:App , public service: MyserviceProvider,public modalCtrl: ModalController,) {

    this.getReportData('','','');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
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

   getReportData(dateto,datefrom,id)
    {
      this.service.show_loading();

      this.requestSend=false
      // this.show_loading();
      this.service.addData({"date_from":datefrom,"date_to":dateto,"asm_id":id},'Checkin/count_for_report').then((result)=>
      {

        console.log(result);
        this.service.dismiss();

        this.report_count_data = result;

        console.log("report data : ",this.report_count_data['travel_count']);

        this.attendence_count= this.report_count_data['attendence_count'];
        this.checkin_count = this.report_count_data['checkin_count'];
        this.event_count = this.report_count_data['event_count'];
        this.expense_count = this.report_count_data['expense_count'];
        this.leave_count = this.report_count_data['leave_count'];
        this.travel_count = this.report_count_data['travel_count'];
        this.secondary_count = this.report_count_data['secondary_order_count'];

        this.primary_count = this.report_count_data['primary_order_count'];



       

      },err=>
      {


      })
      this.service.dismiss();

    }
    url:any

    downloadleaveReport(report_type:any){
      console.log(this.date_from);

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/leave_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'leave' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Leave.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadtravelReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/travel_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'travelplan' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Travelplan.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadcheckinReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/checkin_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Checkin' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Checkin.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadeventReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/event_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Event' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Event.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadprimaryorderReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/primary_order_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Primary_order' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Primary_order.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadattendenceReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/attendence_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Attendence' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Attendance.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadsecondaryorderReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/secondary_order_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Secondary_order' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Secondary_order.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    downloadexpenseReport(report_type:any){

      console.log("Download Report Method Called: ",report_type);
      this.service.addData({"date_from":this.date_from,"date_to":this.date_to,"asm_id":this.date_id},'Checkin/expense_report_for_reporting_manager').then((result)=>
      {

        console.log(result);
        if(result){
   var file = 'Expense' +'.csv';

      const fileTransfer: FileTransferObject = this.transfer.create();

      this.url = "http://phpstack-83335-1970078.cloudwaysapps.com/api/uploads/Expense.csv";

     console.log(this.url ,"url");

     console.log("hiiiii")
     fileTransfer.download(this.url, this.file.externalApplicationStorageDirectory  + '/Download/' + file).
     then((entry) => {


        console.log('download complete: ' + entry.toURL());
        var url=entry.toURL()
        console.log("hiiiii2")
        this.fileOpener.open(url, 'text/csv')

        console.log(this.file ,"dfsgdfsgdfs");


     });
        }


       

      },err=>
      {


      })
    //   this.service1.show_loading()

   


    }
    date_from:any
    date_to:any
    date_id:any
    statusModal(type) 
    {
      console.log(type);
      
      let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'from':'team'});
      
      modal.onDidDismiss(data =>
        {
          this.date_from=data.date_from
          this.date_to=data.date_to
          this.date_id=data.team_id
          this.getReportData(this.date_to,this.date_from,this.date_id)
        });
        
        modal.present();
      }
    // statusModal(type) 
    // {
    //   console.log("hlooo");
      
    //   let modal = this.modalCtrl.create(ExpenseStatusModalPage,{'type':type,'from':'team'});
      
    //   modal.onDidDismiss(data =>
    //     {
    //       // this.getExpenseDetail();

    //       console.log(data)
        



    //     });
        
    //     modal.present();
    //   }
    
}
