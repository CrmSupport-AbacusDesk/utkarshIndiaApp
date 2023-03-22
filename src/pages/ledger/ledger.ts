import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,PopoverController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelPopOverPage } from '../travel-pop-over/travel-pop-over';
import { ConstantProvider } from '../../providers/constant/constant';

/**
 * Generated class for the LedgerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ledger',
  templateUrl: 'ledger.html',
})
export class LedgerPage {
  distributor_detail : any = {}
  id:any=''
  filter:any={}
  account_list:any= [];
  limit = 20
  start = 0
  dr_detail:any= {};
  DrType: any = ''
  drCode: any;
  flag: any;
  dr_id: any;
  LoginType:any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,public constant : ConstantProvider,
    public serve:MyserviceProvider,
     ) {
      this.LoginType = this.constant.UserLoggedInData.loggedInUserType
      this.DrType = this.navParams.get('dr_type')
      this.drCode = this.navParams.get('dr_code')
      this.dr_id = this.navParams.get('dr_id');
  }

  ionViewDidLoad() {
    this.get_ledger()
  }
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(TravelPopOverPage, { 'dr_id': this.dr_id, 'from': 'leads-details', 'dr_code': this.drCode ,'dr_type':this.DrType});

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {

    })

  }
  get_ledger()
    {
      if(this.constant.UserLoggedInData.loggedInUserType == "DrLogin"){
        this.dr_id =this.constant.UserLoggedInData.id
      }
      this.limit = 20
      this.start = 0
        this.serve.presentLoading()
        this.serve.addData({"dr_id":this.dr_id},"AppCustomerNetwork/accountStatementList").then(resp=>
        {
          if(resp['statusCode']==200){
            this.account_list = resp['dr_ledger_list']
            this.dr_detail = resp['dr_detail']
            this.serve.dismissLoading()
          }else{
            this.serve.dismissLoading()
            this.serve.errorToast(resp['statusMsg'])
          }
        }, error => {
          this.serve.Error_msg(error);
          this.serve.dismiss();
        })
    }
    loadData(infiniteScroll) {
      this.start = this.account_list.length
      this.serve.addData({"dr_id":this.dr_id,limit:this.limit,start:this.start}, "AppCustomerNetwork/accountStatementList").then(resp=> {
        if (resp['dr_ledger_list'] == '') {
          this.flag = 1;
        }
        else {
          setTimeout(() => {
            this.account_list = this.account_list.concat(resp['dr_ledger_list']);
            infiniteScroll.complete();
          }, 1000);
        }
      }, error => {
        this.serve.Error_msg(error);
        this.serve.dismiss();
      });
    }

}
