import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { ConstantProvider } from '../constant/constant';
import { Events, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../myservice/myservice';
import * as jwt_decode from 'jwt-decode';


@Injectable()
export class LoginserviceProvider {
    token_info:any='';

    constructor(public http: Http, private constant: ConstantProvider, public service :MyserviceProvider,  public storage: Storage, public events: Events,
        public platform: Platform) {
        }
        
        
        getDecodedAccessToken(token: string): any 
        {
            try{
                return jwt_decode(token);
            }
            catch(Error){
                return null;
            }
        }
    
        public login_submit(form) {
            return new Promise((resolve, reject) => {
                let header = new Headers();
                header.append('Content-Type', 'application/json');
                this.http.post(this.constant.rootUrlSfa+'login/login',JSON.stringify(form),{headers: header}).map(res=>res.json())
                .subscribe(res=>{
                    if(res.loggedInUserType=='Employee')
                    {
                        if(res.token)
                        {
                            this.storage.set('token', res.token);
                            this.storage.set('role', res.role);
                            this.storage.set('displayName', res.displayName);
                            this.storage.set('role_id',res.role_id);
                            this.storage.set('user_type',res.user_type);
                            this.storage.set('token_value',res.token_value);
                            this.storage.set('userId',res.id);
                            this.storage.set('loginType','SFA');
                            this.storage.set('loggedInUserType',res['loggedInUserType']);
                            this.token_info = this.getDecodedAccessToken(res.token);
                            
                            if(this.token_info.state_name)
                            {
                                this.storage.set('token_info',this.token_info.state_name);
                            }
                            
                            if(this.token_info.state)
                            {
                                this.storage.set('token_info',this.token_info.state);
                            }
                            
                            this.events.publish('token_val', true);
                            this.events.publish('userLoggedRole', res['role']);
                            this.events.publish('userLoggedDisplayName', res['displayName']);
                            this.events.publish('userRoleId',res['role_id']);
                            this.events.publish('userType',res['user_type']);
                            this.events.publish('userToken',res['token_value']);
                            this.events.publish('loggedInUserType',res['loggedInUserType']);
                            this.constant.UserLoggedInData.loggedInUserType = 'Employee';
                        }
                    }
                    else  if(res.loggedInUserType=='DrLogin')
                    {
                        if(res.token)
                        {
                            this.storage.set('token', res.token);
                            this.storage.set('token_value',res.token_value);
                            this.storage.set('loginType','SFA');
                            this.storage.set('loginData',res);
                            this.storage.set('loggedInUserType',res['loggedInUserType']);
                            this.token_info = this.getDecodedAccessToken(res.token);
                            if(this.token_info.state)
                            {
                                this.storage.set('token_info',this.token_info.state);
                            }
                            this.events.publish('loggedInUserType',res['loggedInUserType']);
                            this.events.publish('token_val_dr', true);
                            this.events.publish('userLoggedDisplayName', res['displayName']);
                            this.events.publish('userRoleId',res['role_id']);
                            this.events.publish('userType',res['user_type']);
                            this.events.publish('userToken',res['token_value']);
                            
                        }
                        this.constant.UserLoggedInData.loggedInUserType = 'DrLogin';

                    }
                    else  if(res.loggedInUserType=='Other')
                    {
                        if(res.token)
                        {
                            this.storage.set('token', res.token);
                            this.storage.set('token_value',res.token_value);
                            this.storage.set('loginData',res);
                            this.storage.set('loggedInUserType',res['loggedInUserType']);
                            this.token_info = this.getDecodedAccessToken(res.token);
                            if(this.token_info.state)
                            {
                                this.storage.set('token_info',this.token_info.state);
                            }
                            this.events.publish('loggedInUserType',res['loggedInUserType']);
                            this.events.publish('token_val_dr', true);
                            this.events.publish('userLoggedDisplayName', res['displayName']);
                            
                        }
                        this.constant.UserLoggedInData.loggedInUserType = 'Other';
                    }
                    else{
                        this.service.comanAlert(res.statusMsg);
                    }
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            });
        }
        
        
        public otp_send(form) {
            return new Promise((resolve, reject) => {
                let header = new Headers();
                header.append('Content-Type', 'application/json');
                this.http.post(this.constant.rootUrlSfa+'login/login_submit',JSON.stringify(form),{headers: header}).map(res=>res.json())
                .subscribe(res=>{
                    resolve(res);
                    // if(res.token)
                    // {
                    //     this.storage.set('token', res.token);
                    //     this.storage.set('role', res.role);
                    //     this.storage.set('displayName', res.displayName);
                    
                    //     this.events.publish('token_val', true);
                    //     this.events.publish('userLoggedRole', res['role']);
                    //     this.events.publish('userLoggedDisplayName', res['displayName']);
                    // }
                }, (err) => {
                    reject(err);
                });
            });
        }
        
        
        
        public product_cataloue_app(form) {
            return new Promise((resolve, reject) => {
                let header = new Headers();
                header.append('Content-Type', 'application/json');
                this.http.post(this.constant.rootUrlSfa+'login/login_for_product_catalogue',JSON.stringify(form),{headers: header}).map(res=>res.json())
                .subscribe(res=>{
                    if(res.token)
                    {
                        this.storage.set('token', res.token);
                        this.storage.set('name', res.name);
                        this.storage.set('type',res.type);
                        this.events.publish('token_val', true);
                        this.events.publish('userName', res['name']);
                    }
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            });
        }
        
        
    }
    