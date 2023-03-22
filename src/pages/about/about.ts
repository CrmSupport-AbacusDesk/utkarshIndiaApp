import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController,public service:DbserviceProvider) 
  {
    console.log(this.service);

  }

  


}
