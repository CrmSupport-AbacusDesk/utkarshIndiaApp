import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import {FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file'; 
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
/**
 * Generated class for the UploadFilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-file',
  templateUrl: 'upload-file.html',
})
export class UploadFilePage {

  selectedFile = [];
  urls = new Array<string>();
  formData = new FormData();
  private fileTransfer: FileTransferObject; 
  NavType : any

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewcontrol: ViewController, public serve: MyserviceProvider, private transfer: FileTransfer, private file: File) {
    this.NavType=this.navParams.get('type');
    console.log(this.NavType)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadFilePage');
  }

  close() {

    this.viewcontrol.dismiss();
  }

  fileChange(event: any) {

    console.log(event.target.files);
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile.push(event.target.files[i]);

      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.urls.push(e.target.result);
        console.log(this.urls);

        for (let index = 0; index < this.selectedFile.length; index++) {

          for (let urlIndex = 0; urlIndex < this.urls.length; urlIndex++) {

            if (index == urlIndex) {
              this.selectedFile[index]['path'] = this.urls[urlIndex];
            }
          }
        }

        console.log(this.selectedFile);

      }

      reader.readAsDataURL(event.target.files[i]);

    }
    this.uploadExcel();
  }

  uploadExcel() {

    this.formData.append("file", this.selectedFile[0], this.selectedFile[0].name);

    if (this.selectedFile && this.selectedFile.length > 0) {
      this.serve.upload_file(this.formData, "TravelPlan_new/import_travel_excel").then((resp) => {
        console.log(resp);
        this.serve.presentToast("File Upload successfully.");
        this.close();
        // this.getMonthlyData()

      });
    }

  }

  downloadFile(){

    console.log("Function Call");
    
    let fileName = "Sample_file.csv";
    let filePath = "https://apps.abacusdesk.com/prayag/sample_travel.csv";
    let url = encodeURI(filePath);

    console.log(url);
    
    //here initializing object.  
    this.fileTransfer = this.transfer.create();  

    this.fileTransfer.download(url, this.file.externalRootDirectory + fileName, true).then((entry) => {
      //here logging our success downloaded file path in mobile.  
      console.log('download completed: ' + entry.toURL());
    }, (error) => {

      console.log(error);
      
      //here logging our error its easier to find out what type of error occured.  
      console.log('download failed: ' + error);
    }); 

    // console.log("https://apps.abacusdesk.com/kei/sample_travel.csv");
    // // this.iab.create('https://apps.abacusdesk.com/kei/sample_travel.csv', '_system');
    // window.open("https://apps.abacusdesk.com/kei/sample_travel.csv", '_system', 'location=no');
  }


}
