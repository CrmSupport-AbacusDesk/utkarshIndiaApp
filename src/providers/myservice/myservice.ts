import { Http, Headers } from '@angular/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, ToastController, LoadingController, ModalController, Events, Loading } from 'ionic-angular';
import { LoadingCntrlPage } from '../../pages/loading-cntrl/loading-cntrl';
import 'rxjs/add/operator/timeout';
import { VisitingCardAddPage } from '../../pages/visiting-card/visiting-card-add/visiting-card-add';

/*
Generated class for the MyserviceProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class MyserviceProvider {
  
    userData: any = {};
    userlogin: any;
    navigationEvent = new EventEmitter();
    isInternetConnection = true;
    loading: Loading;

    constructor(public http: Http, public http1: HttpClient, public toastCtrl: ToastController, public modalCtrl: ModalController, public events: Events, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private constant: ConstantProvider, public storage: Storage) {

        console.log(this.isInternetConnection, 'isInternetConnection');

    }
    public FileData(request_data: any, fn: any) {
        let header = new HttpHeaders();
        header.append('Content-Type', undefined);
        return this.http1.post(this.constant.server_url + fn, request_data, { headers: header });
    }

    public FileData2(request_data: any, fn: any) {
        let header = new HttpHeaders();
        header.append('Content-Type', undefined);
        return this.http1.post(this.constant.rootUrlSfa + fn + request_data, { headers: header });
    }
    public get_data() {

        return new Promise((resolve, reject) => {
            this.storage.get('token').then((value) => {
                let header = new Headers();
                header.append('Authorization', 'Bearer ' + value);
                header.append('Content-Type', 'application/json');
                this.http.get(this.constant.server_url + 'Distributor/lead_list', { headers: header }).map(res => res.json())
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            });
        });
    }



    public addData(value, url) {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {
                let headers = new HttpHeaders().set('Content-Type', 'application/json');
                headers = headers.set('Authorization', 'Bearer ' + token);
                this.http1.post(this.constant.rootUrl + url, JSON.stringify(value), { headers: headers }).timeout(30000).subscribe(res => {
                    resolve(res)
                }
                    , (err) => {
                        reject(err);
                    });
            });
        })

    }


    public Error_msg(error) {

        let alertMsg = '';
        console.log(this.isInternetConnection, 'isInternetConnection');
        if (this.isInternetConnection == true) {
            if (error.status == 500) {
                alertMsg = "Internal Sever Error";
            }
            else if (error.status == 200 && error.error.text && error.error.text.match("Maximum execution time")) {
                alertMsg = "Server Timeout Error, Please Try Again.";
            }
            else if (error.name == 'TimeoutError') {
                alertMsg = "Internet Speed Timeout Error, Please Try Again.";
            }
            else {
                alertMsg = "404 Bad Request";
            }
        }
        else {
            alertMsg = "No connection, Please check your internet connectivity and try again";
        }

        let alert = this.alertCtrl.create({
            title: 'Alert!',
            cssClass: 'alert-modal',
            subTitle: alertMsg,
            buttons: ['OK']
        });
        alert.present();
    }


    public upload_file(value, url) {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {

                let header = new Headers();
                header.append('Authorization', 'Bearer ' + token);
                this.http.post(this.constant.rootUrl + url, value, { headers: header }).map((res) => res.json())
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            });
        })

    }
    public addData3(value, url) {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {

                let header = new Headers();
                header.append('Authorization', 'Bearer ' + token);
                header.append('Content-Type', 'application/json');
                this.http.post(this.constant.rootUrl3 + url, JSON.stringify(value), { headers: header }).map((res) => res.json())
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            });
        })

    }


    public addData2(value, url) {
        return new Promise((resolve, reject) => {
            this.storage.get('token').then((token) => {

                let header = new Headers();
                header.append('Authorization', 'Bearer ' + token);
                header.append('Content-Type', 'application/json');
                this.http.post(this.constant.rootUrl + url, JSON.stringify(value), { headers: header }).map((res) => res.json())
                    .subscribe(res => {
                        resolve(res);
                    }, (err) => {
                        reject(err);
                    });
            });
        })

    }




    public set(value) {
        this.userlogin = value;
    }
    public get() {
        return this.userlogin;
    }

    public show_loading() {
        let profileModal = this.modalCtrl.create(VisitingCardAddPage, { state: 'Start' });

        profileModal.present();
    }
    public presentLoading() {
        this.loading = this.loadingCtrl.create({
            spinner: 'dots',
            content: 'Please Wait...',
            cssClass: 'loaderBackground'
        });

        this.loading.present();
    }
    public dismissLoading() {
        // setTimeout(() => {
        this.loading.dismiss();
        // }, 700);  
    }

    public dismiss() {
        // this.events.publish('state', 'stop');
        this.loading.dismiss();
    }
    public presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }
    public errToasr() {
        let toast = this.toastCtrl.create({
            message: 'Error Occured ,Please try Again!!',
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }
    public errorToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 4000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
            cssClass: 'toast_error',
        });
        toast.onDidDismiss(() => {
        });
        toast.present();
    }
    public successToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
            closeButtonText: 'Ok',
            cssClass: 'toast_success',
        });
        toast.present();
    }
    showOfflineAlert() {
        var text = 'Offline ! Please Connect To An Active Internet Connection'
        let alert = this.alertCtrl.create({
            title: 'Alert!',
            cssClass: 'alert-model',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    comanAlert(msg) {
        var text = msg;
        let alert = this.alertCtrl.create({
            title: 'Alert!',
            cssClass: 'alert-model',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
}