import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ExpenseAddPage } from '../expense-add/expense-add';
import { ExpenseDetailPage } from '../expense-detail/expense-detail';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ExpensePopoverPage } from '../expense-popover/expense-popover';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-expense-list',
  templateUrl: 'expense-list.html',
})
export class ExpenseListPage {
  flag: any;
  expenseStatus: any = 'Pending';
  expenseList: any = [];
  sendRequest: any = false
  expenseType: any = "My";
  name: any = []
  expense: any = []
  updateStatus: any = ''
  expenseListCount: any = {};
  search: any;
  teamCount: any;
  userId: any;
  filter: any = {}
  selectData: any = {};
  user_list: any = []
  data: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serve: MyserviceProvider,
    public storage: Storage,
    public popoverCtrl: PopoverController) {
    this.storage.get('displayName').then((displayName) => {
      if (typeof (displayName) !== 'undefined' && displayName) {
        this.expense.userName = displayName;
      }
    });

    if (this.navParams.get('view_type') == 'Team') {
      this.expenseType = "Team";
      this.getUserList();
    }
  }



  ionViewWillEnter() {
    this.storage.get('team_count').then((team_count) => {
      this.teamCount = team_count;
    });
    if (this.navParams.get('view_type')) {
      this.expenseType = this.navParams.get('view_type');
    }
    if (this.expenseType == 'Team') {
      this.expenseType = 'Team';
    }
    else {
      this.expenseType = 'My';
    }
    this.getExpenseList();

  }

  addPage() {
    this.navCtrl.push(ExpenseAddPage);
  }

  doRefresh(refresher) {
    this.filter.start = 0;
    this.getExpenseList();
    refresher.complete();
  }

  deatilPage(e: any, id) {
    this.filter.start = 0;
    this.navCtrl.push(ExpenseDetailPage, { 'id': id });
    e.stopPropagation();
  }

  testingfunction(e: any) {
    e.stopPropagation();
  }

  getUserList() {
    this.storage.get('userId').then((id) => {
      this.userId = id;
      this.serve.addData({ 'user_id': this.userId }, 'AppExpense/allASM').then((result) => {
        if (result['statusCode'] == 200) {
          this.serve.dismiss();
          this.user_list = result['asm_id'];
        } else {
          this.serve.dismiss();
          this.serve.errorToast(result['statusMsg'])
        }
      }, err => {
        this.serve.Error_msg(err);
        this.serve.dismiss();
      });
    });
  }

  updateStatusMode(status, id = '') {
    this.serve.addData({ 'id': id, 'type': 'seniorStatus', 'status': status, 'reason': '' }, "AppExpense/updateStatus").then(resp => {
      if (resp['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.serve.successToast(resp['statusMsg'])
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(resp['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
  }
  UserId: any = ''
  getExpenseList() {
    this.sendRequest = false
    this.filter.limit = 20;
    this.filter.start = 0;
    if (this.selectData.team && this.expenseType == 'Team') {
      this.UserId=this.selectData.team.id
      this.filter.team_id = this.selectData.team.id;
      this.filter.team = this.selectData.team.name;
    }
   
    this.serve.presentLoading();
    this.serve.addData({ 'Status': this.expenseStatus, 'Mode': this.expenseType, 'User_id': this.UserId, 'filter': this.filter }, "AppExpense/expenseList").then(resp => {
      if (resp['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.expenseList = resp['result'];
        this.expenseListCount = resp['count'];
        this.filter.start = this.expenseList.length;

        for (let i = 0; i < this.expenseList.length; i++) {
          this.name = this.expenseList[0].createdByName
        }
        this.sendRequest = true
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(resp['statusMsg'])
      }


    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismissLoading();
    })
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExpensePopoverPage, { 'from': 'Expense' });

    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(resultData => {
      if (resultData.TabStatus == 'MY') {
        this.selectData = {};
        this.filter = {};
      } else {
        this.getUserList();
      }
      this.expenseType = resultData.TabStatus;

      this.data = ''
      this.getExpenseList();
    })


  }

  loadData(infiniteScroll, id = '') {
    this.filter.start = this.expenseList.length;
    this.serve.addData({ 'Status': this.expenseStatus, 'Mode': this.expenseType, 'User_id': this.UserId, 'limit': this.filter.limit, 'start': this.filter.start }, "AppExpense/expenseList").then(resp => {
      if (resp['result'] == '') {
        this.flag = 1;
      }
      else {
        setTimeout(() => {
          this.expenseList = this.expenseList.concat(resp['result']);
          infiniteScroll.complete();
        }, 1000);
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    });
  }

}
