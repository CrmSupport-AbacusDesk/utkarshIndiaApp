import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { SupportDetailPage } from '../support-detail/support-detail';
import { SupportPage } from '../support/support';
import { TaskAddPage } from '../task-add/task-add';
import { TaskDetailPage } from '../task-detail/task-detail';
import moment from 'moment'

/**
* Generated class for the SupportListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-task-list',
  templateUrl: 'task-list.html',
})
export class TaskListPage {
  TaskData:any =[];
  sendRequest:any=false
  activeTab: string = "my_task"
  filter:any={}
  date:any= new Date()
  tabCount:any={}
  my_task_count:any=''
  team_exist:boolean;
  assign_task_count:any=''
  task_status:any='promise_done'
  constructor(public navCtrl: NavController, public navParams: NavParams, private serve: MyserviceProvider) {
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.serve.presentLoading();
  }
  

  
  
  ionViewDidEnter(){
    this.get_Task_list()

  }
  get_Task_list() {
    this.sendRequest = false
    this.filter.task_type = this.activeTab
    this.filter.task_status = this.task_status
    this.serve.addData({'filter':this.filter}, 'AppTask/getTaskList').then((result) => {
      if(result['statusCode'] == 200){
        this.TaskData = result['data'];
        this.tabCount = result['tabCount'];
        this.my_task_count = result['my_task_count'];
        this.team_exist =Boolean(result['team_exist']);
        this.assign_task_count = result['assign_task_count'];
        this.sendRequest=true
        this.serve.dismissLoading();
      }
      else{
        this.serve.errorToast(result['statusMsg']);
        this.serve.dismissLoading();
      }
    },
    error => {
      this.serve.Error_msg(error)
     this.serve.dismiss();
    });
  }
  
  doRefresh(refresher) {
    this.get_Task_list()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
  
  
  goToSupportAdd(){
    this.navCtrl.push(TaskAddPage)
  }
  support_detail(id, created_by){
    this.navCtrl.push(TaskDetailPage,{'id':id, 'created_by':created_by, 'task_type':this.filter.task_type})
  }
}
