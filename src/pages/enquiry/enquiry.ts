import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { MyserviceProvider } from '../../providers/myservice/myservice';



@IonicPage()
@Component({
  selector: 'page-enquiry',
  templateUrl: 'enquiry.html',
})
export class EnquiryPage {
  enquiry_type: any;
  data:any={};
  states: any=[];
  district: any=[];
  dealer: any=[];
type:any=3;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service:DbserviceProvider,public service1: MyserviceProvider) {

this.get_stateList();
// this.get_district();
this.get_dealers();
  }



  
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad EnquiryPage');
  // }
  enquiryBtn(){
    console.log('Enquiry Submit');
  }

  MobileNumber(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }



  streetcheck(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
   
  companycheck(event: any) 
  {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
   
  contactPersonCheck(event: any) 
  {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
     
  city(event: any) 
  {
    const pattern = /[A-Z\+\-\a-z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) 
    {event.preventDefault(); }
  }
  enquiryformSubmit()
  {
    console.log( this.data);
  }



  get_stateList()
  {
    // this.service1.show_loading();

    this.service1.addData({'data':this.data.state},'Enquery/state_list').then((response)=>
    {
      console.log(response);

      this.states= response['state_name'];
      // console.log(states);
      
      this.service1.dismiss();

    },er=>
    {
      this.service1.dismiss();
    });  
  }

  get_district()
  {
    // this.service1.show_loading();

    this.service1.addData({'state_name':this.data.state},'enquery/district_list').then((response)=>
    {
      console.log(response);

      this.district= response;
      this.service1.dismiss();

    },er=>
    {
      this.service1.dismiss();
    });  
  }
  get_dealers()
  {
    this.service1.show_loading();

    this.service1.addData({'type':this.type},'Distributor/distributor_lists').then((response)=>
    {
      console.log(response);
          this.dealer= response;

      
      this.service1.dismiss();

    },er=>
    {
      this.service1.dismiss();
    });  
  }

}
