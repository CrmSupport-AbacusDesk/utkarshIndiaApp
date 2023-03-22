import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams } from 'ionic-angular';
import { ConstantProvider } from '../constant/constant';
import { Storage } from '@ionic/storage';
import {MyApp} from '../../app/app.component';
/*
  Generated class for the FollowupserviceProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AttendenceserviceProvider {

  constructor(public http: Http, public constant: ConstantProvider, public storage: Storage ) {
  }

  public start_attend(data){
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token) => {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Bearer '+token);

        this.http.post(this.constant.rootUrlSfa+'AppAttendence/startAttendence',JSON.stringify(data),{headers: header}).map((res)=>res.json()).subscribe(res=>{
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }
  



  public stop_attend(data){
    return new Promise((resolve, reject) => {
      this.storage.get('token').then((token) => {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Bearer '+token);
        this.http.post(this.constant.rootUrlSfa+'AppAttendence/stopAttendence',JSON.stringify(data),{headers: header }).map(res=>res.json())
        .subscribe(res=>{
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }





  public get_attendance(userId){
    return new Promise((resolve, reject) => {
      
      this.storage.get('token').then((token) => {

        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Bearer '+token);

        this.http.post(this.constant.rootUrlSfa+'Attendence/get_attendence',JSON.stringify(userId),{headers: header }).map(res=>res.json())
        .subscribe(res=>{
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  public getWorkingType(){
    return new Promise((resolve, reject) => {
      
      this.storage.get('token').then((token) => {

        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'Bearer '+token);

        this.http.get(this.constant.rootUrlSfa+'attendence/get_working_type',{headers: header }).map(res=>res.json())
        .subscribe(res=>{
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

}
