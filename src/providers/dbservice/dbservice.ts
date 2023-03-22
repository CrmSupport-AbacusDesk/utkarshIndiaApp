import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantProvider } from '../constant/constant';
import * as jwt_decode from "jwt-decode";
import { Storage } from '@ionic/storage';
import { LoadingController, Loading, AlertController ,ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DbserviceProvider {
  token_value:any = "";
  tokenInfo:any;
  user_id:any;
  karigar_id:any='';
  karigar_status:any='';
  karigar_info:any={};
  connection:any=''
  userlogin:any;
  url:any='';
  protected token_data : any;
  constructor(public http: HttpClient, private toastCtrl: ToastController  ,public alertCtrl:AlertController, private constant:ConstantProvider,public loadingCtrl:LoadingController,public http1:HttpClient, public storage: Storage, private sqlite: SQLite)
  {
    this.token();
    this.url=this.constant.rootUrl;
    
    storage.get('karigar_info').then((val) => {
      this.karigar_info = val
    });
  }
  set_token_value(value)
  {
    this.token_data=value;
  }
  get_token_data()
  {
    return this.token_data
  }
  loading:Loading
  dismiss()
  {
    this.loading.dismiss();
  }



  async presentToast(message) {
            
    const toast = await this.toastCtrl.create({
        message: message,
        duration: 2000
    });
    
    toast.present();
}




  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
  token()
  {
    this.storage.get('token').then((val) => {
      this.token_value = val;
      this.tokenInfo = this.getDecodedAccessToken(this.token_value);
      if( this.tokenInfo)
      {
        this.karigar_id=this.tokenInfo.sub;
      }
    });
  }
  
  
  
  get_rqst(fn:any):any {
    
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Token', 'Bearer ' + this.token_value );
    return this.http.get(this.constant.rootUrl + fn, {headers: headers});
    
  }
  

get_request(fn: any): any{
   
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  // headers = headers.set('Token', 'Bearer ' + this.token_value );
  return this.http.get(this.constant.rootUrl2 + fn, {headers: headers});
}



get_requests(fn: any, params: any): any{
   
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = headers.set('Token', 'Bearer ' + this.token_value );
  return this.http.get(this.constant.rootUrl2 + fn, {headers: headers, params});
}

get_request1(fn: any, params: any): any{
   
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = headers.set('Token', 'Bearer ' + this.token_value );
  return this.http.get(this.constant.rootUrl + fn, {headers: headers, params});
}


post_request(request_data: any, fn: any):any 
{
  this.token_value = this.get_token_data();
  this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
  if(this.tokenInfo)
  {
    this.karigar_id=this.tokenInfo.sub;
  }
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = headers.set('Token', 'Bearer ' + this.token_value);
  return this.http.post(this.constant.rootUrl2 + fn, JSON.stringify(request_data), {headers: headers});
  
}

post_request2(request_data: any, fn: any):any 
{
  this.token_value = this.get_token_data();
  this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
  if(this.tokenInfo)
  {
    this.karigar_id=this.tokenInfo.sub;
  }
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = headers.set('Token', 'Bearer ' + this.token_value);
  return this.http.post(this.constant.rootUrl3 + fn, JSON.stringify(request_data), {headers: headers});
  
}



postrequest(request_data: any, fn: any):any 
{
  this.token_value = this.get_token_data();
  this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
  if(this.tokenInfo)
  {
    this.karigar_id=this.tokenInfo.sub;
  }
  let headers = new HttpHeaders().set('Content-Type', 'application/json');
  headers = headers.set('Token', 'Bearer ' + this.token_value);
  return this.http.post(this.constant.rootUrl + fn, JSON.stringify(request_data), {headers: headers});
  
}


  post_rqst(request_data: any, fn: any):any 
  {
    this.token_value = this.get_token_data();
    this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
    if(this.tokenInfo)
    {
      this.karigar_id=this.tokenInfo.sub;
    }
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('Token', 'Bearer ' + this.token_value);
    return this.http.post(this.constant.rootUrl + fn, JSON.stringify(request_data), {headers: headers});
    
  }
  
  headers = new HttpHeaders();
  fileData(request_data:any,fn:any):any{
    this.headers.append('Content-Type', undefined);
    return this.http.post(this.constant.rootUrl + fn, request_data , {headers: this.headers})
  }
  
  
  getDecodedAccessToken(token: string): any {
    try{
      return jwt_decode(token);
    }
    catch(Error){
      return null;
    }
  }
  
  public set(value)
  {
    this.userlogin=value;
  }
  
  showOfflineAlert()
  {
    var text = 'Offline ! Please Connect To An Active Internet Connection'
    let alert = this.alertCtrl.create({
      title:'Alert!',
      cssClass:'action-close',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
  
  
}
