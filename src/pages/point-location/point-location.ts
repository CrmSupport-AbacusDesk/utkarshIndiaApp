import { Component, ViewChild ,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController, Navbar, Platform } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { LeadsDetailPage } from '../leads-detail/leads-detail';

/**
 * Generated class for the PointLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;
@IonicPage()
@Component({
  selector: 'page-point-location',
  templateUrl: 'point-location.html',
})
export class PointLocationPage {

  data:any = {};
  checkExist=false;
  options : GeolocationOptions;
  currentPos : Geoposition;
  type:any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
    constructor(public navCtrl: NavController, public navParams: NavParams,public service: MyserviceProvider,public loadingCtrl: LoadingController,private alertCtrl: AlertController,public toastCtrl: ToastController,public storage:Storage,public locationAccuracy: LocationAccuracy,public geolocation: Geolocation ) {

      console.log(this.navParams);
      
      this.data.lng=this.navParams['data'].lng;
      this.data.lat=this.navParams['data'].lat;
      this.data.id=this.navParams['data'].id;
      this.type=this.navParams['data'].type;

      console.log(this.data);
      
      this.getUserPosition();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PointLocationPage');
  }

     
       presentToast() {
        let toast = this.toastCtrl.create({
          message: 'Location Updated Successfully',
          duration: 3000,
          position: 'bottom'
        });
        
        
        
        toast.present();
      }
      

        pointlocation()
        {
          console.log(this.data);

          if(this.checkExist==true)
          {
            this.service.presentToast('Point Location Exists !!');
            return
          }
          this.service.show_loading()          
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
              this.geolocation.getCurrentPosition(options).then((resp) => {
                
                this.data.lat = resp.coords.latitude
                this.data.lng = resp.coords.longitude
                
                // this.data.type = 'Retailer';
                console.log(this.data);
                
                this.service.addData(this.data,'Lead/update_location').then((result)=>{
                  console.log(result);
                  if(result['msg'] == 'success')
                  {
                    this.navCtrl.pop();
                    this.service.dismiss();
                    this.presentToast();
                    if(this.type == 'Lead'){
                      // this.navCtrl.pop();
                    }
                    else{
                      this.navCtrl.push(LeadsDetailPage,{'dr_id':this.data.id,'type':'Dr'})
                    }

                  }
                },err=>
                {
                  this.service.dismiss();
                  this.service.errToasr();
                });
                
              }).catch((error) => {
                console.log('Error getting location', error);
                console.log('Error requesting location permissions', error);
                this.service.dismiss();          
                let toast = this.toastCtrl.create({
                  message: 'Allow Location Permissions',
                  duration: 3000,
                  position: 'bottom'
                });
                
                
                
                toast.present();
              });
            },
            error => {
              console.log('Error requesting location permissions', error);
              this.service.dismiss();          
              let toast = this.toastCtrl.create({
                message: 'Allow Location Permissions',
                duration: 3000,
                position: 'bottom'
              });
              
              
              
              toast.present();
            });
          }

          getUserPosition(){
            this.options = {
                enableHighAccuracy : true
            };
        
            console.log(this.data);
            
            this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {
        
                this.currentPos = pos;      
                console.log(pos);
                this.addMap(pos.coords.latitude,pos.coords.longitude);
            },(err : PositionError)=>{
                console.log("error : " + err.message);
            });
        }

        addMap(lat,long){

          let latLng = new google.maps.LatLng(lat, long);
          console.log(this.data);
      
          let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
          }
      
          this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          this.addMarker();
      
      }

      addMarker(){
        console.log(this.data);

        let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
        });
    console.log(this.map);
    
        let content = "<p>This is your current position !</p>";          
        let infoWindow = new google.maps.InfoWindow({
        content: content
        });
    
        google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
        });
    
    }

    
}
