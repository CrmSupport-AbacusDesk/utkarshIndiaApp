import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, Platform,Nav } from 'ionic-angular';
import {ContractorMeetListPage} from '../contractor-meet-list/contractor-meet-list'

/**
 * Generated class for the ContractorModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contractor-modal',
  templateUrl: 'contractor-modal.html',
})
export class ContractorModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public platform: Platform) {
  }

  private imgs:any;
  imgtype:any;
  // private name:string;
  private current: number = 0;

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractorModalPage');
    this.imgs=(this.navParams.get("img"));
console.log(this.imgs);

    // for (let index = 0; index < this.imgs.length; index++) {
    //   const element = this.imgs.meetingImages[index].img_path;

    //  if(element.search(/.mp4/i)!=-1){
    //     this.imgs[index].type='video';
    //  }else{
    //    this.imgs[index].type='image';
    //  }
    // }
   
      const element = this.imgs;

     if(element.search(/.mp4/i)!=-1){
        this.imgtype='video';
     }else{
       this.imgtype='image';
     }
    
  console.log(this.imgs);
  console.log(this.imgtype);
  
  
    }
 closeModal(){
    this.viewCtrl.dismiss();
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
}

goOnCancelationPolicy(){
  this.navCtrl.push(ContractorMeetListPage)
}

next() {
  this.current = (this.current + 1) % this.imgs.length;
}
prev() {
  this.current = (this.current + this.imgs.length - 1) % this.imgs.length;
}


}
