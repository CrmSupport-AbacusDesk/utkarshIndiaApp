import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private app:App,public service:DbserviceProvider) {
    if(this.service.connection=='offline')
    {
      this.service.showOfflineAlert()
      this.navCtrl.setRoot(HomePage)
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }
  go_to_map()
  {
    console.log('map');
    let destination = 28.7973288 + ',' + 77.0758851;
    
    
      let label = encodeURI('kridha Opp. Hariyali Petrol Pump, Faridpur Bareilly, 243201');

      window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
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
}
