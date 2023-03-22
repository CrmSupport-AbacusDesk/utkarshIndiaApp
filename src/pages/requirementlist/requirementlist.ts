import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { RequirementPage } from '../requirement/requirement';


/**
 * Generated class for the RequirementlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requirementlist',
  templateUrl: 'requirementlist.html',
})
export class RequirementlistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider,public alertCtrl:AlertController,
    public toastCtrl: ToastController) {
    
  }
requirement_list:any=[];
requirement_list1:any=[];

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequirementlistPage');
    this.get_requirement_list();
  }
get_requirement_list()
{
  this.db.addData({},"Lead/requirementList")
  .then(resp=>{
console.log(resp);
this.requirement_list=resp['requirement'];
console.log(this.requirement_list);



  });
}
delete_requirement(id,i)
{
  
    let alert = this.alertCtrl.create({
      title: 'Delete Requirement',        
      message: 'Do you want to delete reuirement?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'Yes',
          handler: () => 
          {
            this.db.addData({'id':id},'Lead/deleterequirement').then((result)=>
            {
this.requirement_list1=result['msg'];
console.log(this.requirement_list1);

              let toast = this.toastCtrl.create({
                message: 'Requirement Deleted!',
                duration: 3000
              });
              if(this.requirement_list1)
              {
                // this.requirement_list.splice(i,1);
                this.get_requirement_list();
              }
            });
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
    
}

// delete_requirement(id)
// {
//   this.db.addData({'id':id},"Lead/deleterequirement")
//   .then(resp=>{
// console.log(resp);
// this.requirement_list=resp['requirement'];
// console.log(this.requirement_list);



//   });
// }
gotorequirement()
{
    this.navCtrl.push(RequirementPage)
}
}
