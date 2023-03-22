import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Refresher } from 'ionic-angular';
import { MyserviceProvider } from '../../../../providers/myservice/myservice';
import { LmsLeadAddPage } from '../lms-lead-add/lms-lead-add';
import { LmsLeadDetailPage } from '../lms-lead-detail/lms-lead-detail';
import { PopoverController } from 'ionic-angular';
import { TravelPopOverPage } from '../../../travel-pop-over/travel-pop-over';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-lms-lead-list',
    templateUrl: 'lms-lead-list.html',
})
export class LmsLeadListPage {
    load_data: any
    LeadType: any = 'My'
    activeTab: string = "Qualified";
    start: any = 0;
    teamCount: any = 0;
    filter: any = {};
    enquiryList: any = {};
    dr_list: any = [];
    count: any = [];
    drid: any;
    networkType: any = []
    constructor(public navCtrl: NavController, public navParams: NavParams, public serve: MyserviceProvider, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public storage: Storage) {

    }


    ionViewWillEnter() {
        this.get_assign_dr();
        this.storage.get('team_count').then((team_count) => {
            this.teamCount = team_count;
        });
    }
    getNetworkType() {
        this.serve.addData3('', "Dashboard/distributionNetworkModule").then(result => {
            this.networkType = result['modules'];
        }, err => {
            this.serve.Error_msg(err);
            this.serve.dismiss();
        })
    }



    get_assign_dr() {
        this.load_data = 0;
        this.filter.type = this.activeTab;
        this.filter.Mode = this.LeadType;

        this.serve.presentLoading();
        this.filter.limit = 20;
        this.filter.start = 0;

        this.serve.addData({ "search": this.filter }, "AppEnquiry/getEnquiryList")
            .then(resp => {
                if (resp['statusCode'] == 200) {
                    this.enquiryList = resp
                    this.dr_list = resp['dr_list'];
                    this.serve.dismissLoading();
                    if (!this.dr_list.length) {
                        this.load_data = 1
                    }
                    else {
                        this.serve.successToast(resp['statusMsg'])
                    }
                }
            }, error => {
                this.serve.Error_msg(error);
                this.serve.dismiss();
            })
        }
    flag: any = '';
    loadData(infiniteScroll) {
        this.filter.start = this.dr_list.length;
        this.filter.type = this.activeTab;
        this.filter.Mode = this.LeadType;
        this.serve.addData({ "search": this.filter }, "AppEnquiry/getEnquiryList")
            .then((r) => {
                if (r['dr_list'] == '') {
                    this.flag = 1;
                }
                else {
                    setTimeout(() => {
                        this.dr_list = this.dr_list.concat(r['dr_list']);
                        infiniteScroll.complete();
                    }, 1000);
                }
            }, error => {
                this.serve.Error_msg(error);
                this.serve.dismiss();
            });
    }

    lead_detail(id) {
        this.navCtrl.push(LmsLeadDetailPage, { 'id': id, 'type': 'Lead', 'actionType': this.LeadType })
    }

    addLead() {
        this.navCtrl.push(LmsLeadAddPage)
    }



    doRefresh(refresher) {
        this.filter.master = null
        this.filter = {}
        this.start = 0
        this.get_assign_dr()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(TravelPopOverPage, { 'from': 'Enquiry' });
        popover.present({
            ev: myEvent
        });

        popover.onDidDismiss(resultData => {
            this.LeadType = resultData.TabStatus;
            this.get_assign_dr();
        })
    }

}
