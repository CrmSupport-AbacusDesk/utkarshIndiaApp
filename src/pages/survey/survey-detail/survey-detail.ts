import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,} from 'ionic-angular';
import { SurveyListPage } from '../../survey/survey-list/survey-list';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-survey-detail',
  templateUrl: 'survey-detail.html',
})
export class SurveyDetailPage {
  spinnerLoader:boolean=false;
  surveyDetail:any={}
  answer_status:any=''
  surveyId:any='';
  detail:any=[];
  surveyAnswer:any='';
  questionCheckCount:any=''
  submit_disable:boolean=true
  submitData:any=''
  selected_answer:any='';
  userId:any='';
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serve:MyserviceProvider,
    public alertCtrl:AlertController,
    public storage: Storage,) {
      this.storage.get('userId').then((id) => {
        this.userId = id;
      });
    }
    
    ionViewDidLoad() {
      this.surveyId=this.navParams.get('id');
      this.surveyDetail.title=this.navParams.get('title');
      this.getSurveyDetail(this.surveyId);
    }
    
    
    getSurveyDetail(surveyId){
      this.serve.presentLoading();
      this.serve.addData({"id":String(surveyId)},'AppSurvey/surveyQuestionList').then(result=>{
        if(result['statusCode'] == 200){
          this.detail=result['data']
          this.answer_status = result['answer_status']
          this.serve.dismissLoading();
        }
        else{
          this.serve.errorToast(result['statusMsg']);
          this.serve.dismissLoading();
        }
      })
    }
    
    checkcount(value){
      this.questionCheckCount = 0;
      for (let i = 0; i < this.detail.length; i++) 
      {
        this.detail[i].ques_id = this.detail[i].id
        if (this.detail[i]['selected_answer']) 
        {
          this.detail[i].answers_id = this.detail[i].selected_answer 
          this.questionCheckCount++; 
        }
        if(this.detail.length == this.questionCheckCount && this.answer_status == 'No'){
          this.submit_disable = false
        }
      }
    }
    
    surveySubmit(){
      this.spinnerLoader=true;
      this.submit_disable = true
      if(this.questionCheckCount != this.detail.length){
        let alert = this.alertCtrl.create({
          title: 'Alert!',
          message: 'All questions are compulsory.',
          buttons: [
            {
              text: 'ok',
              handler: () => {
              }
            },
          ]
          
        })
        alert.present();
        return;
      }
      
      this.serve.addData( {"question" :  this.detail,'survey_id':this.surveyId},'AppSurvey/saveSurveyAnswer').then(response=>{
        if(response['statusCode'] == 200){
          this.spinnerLoader=false;
          this.submit_disable = true
          this.serve.successToast(response['statusMsg']);
        }else{
          this.spinnerLoader=false;
          this.serve.errorToast(response['statusMsg']);
        }
      }, err => {
        this.spinnerLoader=false;
        this.serve.dismiss();
        this.serve.Error_msg(err);
      })
    } 
  }
  