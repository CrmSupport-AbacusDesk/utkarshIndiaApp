import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, NavParams, ToastController } from 'ionic-angular';
import { MyserviceProvider } from '../../../../../providers/myservice/myservice';
import { IonicSelectableComponent } from 'ionic-selectable';

@IonicPage()
@Component({
    selector: 'page-lms-activity-add',
    templateUrl: 'lms-activity-add.html',
})
export class LmsActivityAddPage {
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    
    @ViewChild(Navbar) navBar: Navbar;
    type_list:any=[];
    type_id1:any;
    
    constructor(public navCtrl: NavController, public navParams: NavParams,public db:MyserviceProvider, public toastCtrl: ToastController) {
    this.getNetworkType()
        
    }
    
    form:any={};
    today_date:any='';

    
    ionViewWillEnter() {
        this.type=this.navParams.get('type');
        this.id=this.navParams.get('id');
        this.company_name=this.navParams.get('name');
        // this.type=this.navParams.get('type');
        // this.form.lead_type = this.type;
        // console.log(this.type);
        
        // this.form.dr_id={id:this.navParams.get('id'),company_name:this.navParams.get('company_name')};
        // console.log(this.form.dr_id);
        
        // this.form.dr_id=this.navParams.get('id');
        // console.log(this.form.dr_id);
        
        // console.log('ionViewDidLoad LmsActivityAddPage');
        // this.get_assign_dr(this.type);
        
        this.today_date = new Date().toISOString().slice(0,10);
        console.log(this.today_date);
        
    }
    
    filter:any={};
    type:any;
    id:any;
    company_name:any;
    dr_id:any;
    
    get_assign_dr(type_id)
    {
        this.filter.type_id = type_id;
        this.type_list = [];
        console.log(type_id);
        
        this.db.addData({'dr_id':this.dr_id,"search":this.filter,},"Lead/getLeadList")
        .then(resp=>{
            console.log(resp);
            this.type_list = resp['dr_list'];
            console.log(this.type_list);
        },
        err=>
        {
        })
    }
    networkType:any=[]
    getNetworkType(){
        this.db.addData('', "lead/leadNetworkModule").then((result => {
          console.log(result);
          this.networkType = result['modules'];
        }))
      }
    test(id)
    {
        console.log('test');
        
        console.log(id);
        
    }
    submit()
    {
        console.log(this.form);
        
        // this.form.drid = this.form.dr_id.id;
        // this.form.companyname = this.form.dr_id.company_name;
        
        this.db.show_loading()
        
        this.db.addData({"dr_id":this.id, "dr_name":this.company_name, "dr_type":this.type, "activity_type":this.form.activity_type, 'remarks':this.form.remarks},"followup_new/add_activity")
        .then(result=>{
            
            console.log(result);
            this.db.dismiss()
            
            if(result['status'] == true){
                let toast = this.toastCtrl.create({
                  message: 'Activity Saved Successfully!',
                  duration: 3000
                });
                
                if(result['msg'] == 'Success')
                { 
                  toast.present();
                  console.log('data inserted successully')
                                 
                  this.navCtrl.pop();
                  // this.navCtrl.push(FollowupListPage, {'user_id':this.userId})
                }
              }
                else{
                 let toast = this.toastCtrl.create({
                    message: result['msg'],
                    duration: 3000
                  });
                  toast.present();
                }
        },
        err=>{
        });
    }
}