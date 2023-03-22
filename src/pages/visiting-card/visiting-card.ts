import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddVisitingCardPage } from '../add-visiting-card/add-visiting-card';

/**
 * Generated class for the VisitingCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-visiting-card',
  templateUrl: 'visiting-card.html',
})
export class VisitingCardPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  add_visitingCard()
  {
      this.navCtrl.push(AddVisitingCardPage);
  }

}
