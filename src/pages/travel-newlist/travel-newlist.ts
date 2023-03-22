import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { TravelListNewPage } from '../travel-list-new/travel-list-new';

/**
 * Generated class for the TravelNewlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-travel-newlist',
  templateUrl: 'travel-newlist.html',
})
export class TravelNewlistPage {
  travel_data:any=[]
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelNewlistPage');
  }
  ionViewWillEnter() {
    this.travel_list()
  }


  travel_list(){
    console.log();
    this.service.addData({},'Attendence/pendingTravelData').then((result) => {
      console.log(result);
  
    this.travel_data=result['travel_list'].filter(row=>row.total>0)

      
     
    console.log(this.travel_data);
      
    })
      }
      gototravel(id,month,year) {
        console.log(month);
        console.log(year);
        
        
        this.navCtrl.push(TravelListNewPage, { from:'pendingtravel','asm_id':id,'month_name':month,'year':year});
    }

}
