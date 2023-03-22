import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../../providers/myservice/myservice';
import { VisitingCardAddPage } from '../visiting-card-add/visiting-card-add';
import { VisitingCardModalPage } from '../visiting-card-modal/visiting-card-modal';
import { AttendenceserviceProvider } from '../../../providers/attendenceservice/attendenceservice';


/**
* Generated class for the VisitingCardListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-visiting-card-list',
  templateUrl: 'visiting-card-list.html',
})
export class VisitingCardListPage {
  data: any=[];
  load_data:any = "0";
  limit=0;
  flag:any='';
  search:any;
  allcount: any=[];
  user_data:any={};
  tabActiveType:any={};
  activetab:any= 'pending';
  constructor(public navCtrl: NavController,public  toastCtrl: ToastController,
    public navParams: NavParams, public modalCtrl: ModalController,public service1: MyserviceProvider, public service:DbserviceProvider,public attendence_serv: AttendenceserviceProvider) {
      console.log(this.navParams);
      if(this.navParams.get('dr_name')){
        this.form1.masterSearch=this.navParams.get('dr_name')
      }
    }


   

    
    tabActive(tab:any)
    {
      this.tabActiveType = {};
      this.tabActiveType[tab] = true;
      this.activetab =  tab;
      this.getVisitingCardDetail();
      console.log(this.activetab);
    }
    
    visitingCardadd()
    {
      this.navCtrl.push(VisitingCardAddPage);
    }
    
    changeStatus(form)
    {
      //  console.log(this.data);
      console.log(form);
      
      
      const modal = this.modalCtrl.create(VisitingCardModalPage,{data:form} )
      modal.present();
      
    }
    
    listdelete(id){
      
      console.log(id);
      
      this.service.post_rqst({'id':id},'distributor/delete_visiting_card').subscribe((response)=>
      {
        console.log(response);
        this.getVisitingCardDetail(); 
      });
    }
    
  
    form1:any={};
    getVisitingCardDetail()
    {
      this.service1.show_loading();
      // {'created_by':this.user_data.id},
      // this.service.get_request( 'distributors/add_visiting_cards?status='+this.activetab).subscribe((response)=>
      this.form1.status =this.activetab;
      this.form1.created_by= this.user_data.id;
      console.log(this.form1);
      
      // this.service.post_request(this.form1,'distributors/add_visiting_cards').subscribe((response)=>
      this.service.get_request1('distributor/add_visiting_cards',this.form1).subscribe((response)=>
      {
        console.log('response');
        // this.service1.dismiss();
        console.log(response);
        this.data= response;
        
      },er=>
      {
        console.log('err');
      });  
      
      this.service1.dismiss();
    }
    
    doRefresh (refresher)
    { 
      if(this.search)  
      this.search={}
      
      this.limit=0
      
      this.getVisitingCardDetail() 
      setTimeout(() => {
        refresher.complete();
      }, 1000);
    }
  }
  