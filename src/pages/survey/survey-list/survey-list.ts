import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,Loading} from 'ionic-angular';
import { SurveyDetailPage } from '../survey-detail/survey-detail';
import { MyserviceProvider } from '../../../providers/myservice/myservice';


@IonicPage()
@Component({
  selector: 'page-survey-list',
  templateUrl: 'survey-list.html',
})
export class SurveyListPage {
  
  surveyList:any=[];
  loading:Loading;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service:MyserviceProvider,
    public loadingCtrl:LoadingController,
    ) {
      this.getSurveyList();
    }
    
    ionViewDidLoad() {
    }
    
    goToDetails(id,title){
      this.navCtrl.push(SurveyDetailPage,{id:id,title:title})
    }
    
    
    
    getSurveyList()
    {
      this.service.presentLoading();
      this.service.addData({},'AppSurvey/surveyList').then(result =>
        {
          if(result['statusCode'] == 200){
            this.surveyList = result['data']
            this.service.dismissLoading();
          }
          else{
            this.service.errorToast(result['statusMsg']);
            this.service.dismissLoading();
          }
        }, error => {
          this.service.Error_msg(error);
          this.service.dismiss();
        });
      }
      
      doRefresh(refresher) {
        this.getSurveyList()
        setTimeout(() => {
          refresher.complete();
        }, 1000);
      }
      
    }
    