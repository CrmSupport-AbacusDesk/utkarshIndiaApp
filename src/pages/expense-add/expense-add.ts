import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { MyserviceProvider } from '../../providers/myservice/myservice';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ExpenseListPage } from '../expense-list/expense-list';
import { AttendenceserviceProvider } from '../../providers/attendenceservice/attendenceservice';
import { ConstantProvider } from '../../providers/constant/constant';
import { NgForm } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-expense-add',
  templateUrl: 'expense-add.html',
})
export class ExpenseAddPage {
  expense: any = {};

  travelForm: any = {};
  travelInfo: any = [];
  hotelForm: any = {};
  hotelInfo: any = [];
  foodForm: any = {};
  foodInfo: any = [];
  localConvForm: any = {};
  localConvForm1: any = {};
  localConvForm1Data: any = {};
  Submit_button: boolean = false
  spinnerLoader: boolean = false
  localConvInfo: any = [];
  miscExpForm: any = {};
  miscExpInfo: any = [];
  allowanceData: any = {};
  allowancecar: any = [];
  allowancebike: any = [];
  show_amount_input: any = true
  roleId: any = ''
  expand_local: any = false;
  expand_travel: any = false;
  expand_food: any = false;
  expand_hotel: any = false;
  expand_misc: any = false;
  today_date = new Date().toISOString().slice(0, 10);
  form: any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public attendence_serv: AttendenceserviceProvider,

    public serve: MyserviceProvider,
    public events: Events,
    public storage: Storage,
    private camera: Camera,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    public alertCtrl: AlertController,
    public constant: ConstantProvider) {
    this.expense.totalAmt = 0;
    this.expense.travelEntitlementAmt = 0;
    this.expense.hotelAmt = 0;
    this.expense.foodAmt = 0;
    this.expense.localConvAmt = 0;
    this.expense.miscExpAmt = 0;

    this.storage.get('role_id').then((roleId) => {
      if (typeof (roleId) !== 'undefined' && roleId) {
        this.roleId = roleId;
      }
    });

    this.storage.get('displayName').then((displayName) => {

      if (typeof (displayName) !== 'undefined' && displayName) {
        this.expense.userName = displayName;

      }
    });

    setTimeout(() => {
      this.getallowanceData();
    }, 500);
    if (this.navParams.get('data')) {
      // this.travelForm=this.navParams.get('data');
      this.expense = this.navParams.get('data');
      this.expense.expType = this.expense.expenseType;
      if (this.expense.expType == 'Local Conveyance') {
        this.image_data = []
        if (this.expense.localConv.length > 0) {
          this.localConvInfo = this.expense.localConv;
          this.expense.localConvAmt = parseInt(this.expense.localConveyanceAmt);

        }
      }
      if (this.expense.expType == 'Outstation Travel') {
        this.image_data = []
        if (this.expense.hotelAmt != 0) {
          if (this.expense.hotel.length > 0) {
            this.hotelInfo = this.expense.hotel;
            this.expense.hotelAmt = parseInt(this.expense.hotelAmt);

          }
        }
        if (this.expense.foodAmt != 0) {
          if (this.expense.food.length > 0) {
            this.foodInfo = this.expense.food;
            this.expense.foodAmt = parseInt(this.expense.foodAmt);

          }
        }
        if (this.expense.miscExpenseAmt != 0) {
          if (this.expense.miscExp.length > 0) {
            this.miscExpInfo = this.expense.miscExp;
            this.expense.miscExpAmt = parseInt(this.expense.miscExpenseAmt);

          }
        }
        if (this.expense.travel.length > 0) {

          this.travelInfo = this.expense.travel;
          this.expense.travelEntitlementAmt = parseInt(this.expense.travelEntitlementAmt);

          for (let i = 0; i < this.travelInfo.length; i++) {
            this.travelInfo[i].travelMode = this.travelInfo[i].modeOfTravel;
          }


        }
      }
    }

  }


  getallowanceData() {
    this.expense.expType = 'Local Conveyance'
    this.serve.addData({ 'roleId': this.roleId }, 'AppExpense/travelMode').then((result) => {
      if (result['statusCode'] == 200) {
        this.serve.dismissLoading();
        this.allowanceData = result['expense'];
        this.localConvForm.modeOfTravel = 'Public Vehicle'
      } else {
        this.serve.dismissLoading();
        this.serve.errorToast(result['statusMsg'])
      }
    }, error => {
      this.serve.Error_msg(error);
      this.serve.dismiss();
    })
  }


  blankValue() {
    this.localConvForm1.travelClass = '';
    this.localConvForm1.date = '';
    this.localConvForm1.distance = '';
    this.localConvForm1.amount = '';

    this.localConvForm.travelClass = '';
    this.localConvForm.date = '';
    this.localConvForm.distance = '';
    this.localConvForm.amount = '';
  }
  blankClassValue() {
    this.localConvForm1.distance = '';
    this.localConvForm1.amount = '';
    // this.localConvForm.distance = '';
    this.localConvForm.amount = '';
  }


  addTravel(form: NgForm) {
    if (this.travelForm.arrivalDate) this.travelForm.arrivalDate = moment(this.travelForm.arrivalDate).format('YYYY-MM-DD');
    if (this.travelForm.arrivalTime) this.travelForm.arrivalTime = moment(this.travelForm.arrivalTime, 'h mm A').format('h:mm A');
    if (this.travelForm.depatureDate) this.travelForm.depatureDate = moment(this.travelForm.depatureDate).format('YYYY-MM-DD');
    if (this.travelForm.depatureTime) this.travelForm.depatureTime = moment(this.travelForm.depatureTime, 'h mm A').format('h:mm A');
    this.travelInfo.push(this.travelForm);
    console.log(this.travelInfo);
    // this.expense.travelEntitlementAmt += parseInt(this.travelForm.arrivalAmount) + parseInt(this.travelForm.depatureAmount);
    this.expense.travelEntitlementAmt += parseInt(this.travelForm.depatureAmount);
    // this.expense.totalAmt += parseInt(this.travelForm.arrivalAmount) + parseInt(this.travelForm.depatureAmount);
    this.expense.totalAmt += parseInt(this.travelForm.depatureAmount);
    this.travelForm = {};


    // setTimeout(() => {
    //   this.travelForm.depatureDate = '';
    //   this.travelForm.depatureTime = '';
    //   this.travelForm.depatureStation = '';
    //   this.travelForm.arrivalDate = '';
    //   this.travelForm.arrivalTime = '';
    //   this.travelForm.arrivalStation = '';
    //   this.travelForm.travelMode = '';
    //   this.travelForm.travelClass = '';
    //   this.travelForm.depatureTicket = '';
    //   this.travelForm.depatureAmount = '';
    //   this.travelForm.depatureDistance = '';
    //   this.travelForm.arrivalTicket = '';
    //   this.travelForm.arrivalAmount = '';
    //   this.travelForm.arrivalDistance = '';
    // }, 500);
    // form.resetForm();
    form.reset();
    form.controls['travelMode'].setErrors(null);
    form.controls['depatureDate'].setErrors(null);
    form.controls['depatureStation'].setErrors(null);
    if (this.travelForm.travelMode == 'Car') {
      form.controls['depatureDistance'].setErrors(null);
      form.controls['arrivalDistance'].setErrors(null);
    }
    form.controls['depatureAmount'].setErrors(null);
    form.controls['arrivalDate'].setErrors(null);
    form.controls['arrivalStation'].setErrors(null);

  }


  hotelamount: any = [];
  allowancehotelamount: any = [];
  addHotel() {
    this.hotelamount = parseInt(this.hotelForm.amount);
    this.allowancehotelamount = parseInt(this.allowanceData.hotel);
    if (this.hotelamount > this.allowancehotelamount) {

      this.serve.errorToast("Enter amount can't greater than" + ' ' + 'Rs.' + this.allowancehotelamount)


      return;
    }


    if (this.hotelForm.checkInDate) this.hotelForm.checkInDate = moment(this.hotelForm.checkInDate).format('YYYY-MM-DD');
    if (this.hotelForm.checkOutDate) this.hotelForm.checkOutDate = moment(this.hotelForm.checkOutDate).format('YYYY-MM-DD');

    this.hotelInfo.push(this.hotelForm);
    this.expense.hotelAmt += parseInt(this.hotelForm.amount);
    this.expense.totalAmt += parseInt(this.hotelForm.amount);

    this.hotelForm = {};


    setTimeout(() => {
      this.hotelForm.checkOutDate = '';
      this.hotelForm.checkInDate = '';
      this.hotelForm.remark = '';
      this.hotelForm.city = '';
      this.hotelForm.hotelName = '';
      this.hotelForm.amount = '';
    }, 500);
  }
  foodamount: any = [];
  allowancefoodamount: any = [];
  addFood(form3: NgForm) {
    this.foodamount = parseInt(this.foodForm.amount);
    this.allowancefoodamount = parseInt(this.allowanceData.food);
    if (this.foodamount > this.allowancefoodamount) {
      this.serve.errorToast("Entered amount can't greater than" + ' ' + 'Rs.' + this.allowancefoodamount)
      return;
    }
    if (this.foodForm.date) this.foodForm.date = moment(this.foodForm.date).format('YYYY-MM-DD');
    this.foodInfo.push(this.foodForm);
    this.expense.foodAmt += parseInt(this.foodForm.amount);
    this.expense.totalAmt += parseInt(this.foodForm.amount);
    this.foodForm = {};

    form3.reset();
    form3.controls['date'].setErrors(null);
    form3.controls['amount'].setErrors(null);
    // setTimeout(() => {
    //   this.foodForm.city = '';
    //   this.foodForm.date = '';
    //   this.foodForm.amount = '';
    //   this.foodForm.remark = '';
    // }, 500);
  }
  localamount: any = [];
  localamount1: any = [];
  allowanceta: any = [];
  user_data: any;

  km: any = [];




  calculateTravelAmount2() {
    if (this.localConvForm1.travelClass == 'Car') {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localamount = parseInt(this.localConvForm1.amount);
      this.localConvForm1.caramount = this.allowanceData.car
      this.localConvForm1.bikeamount = this.allowanceData.bike
      this.localConvForm1.amount = parseInt(this.localConvForm1.distance) * parseFloat(this.allowanceData.car);
    } else if (this.localConvForm1.travelClass == 'Bike') {
      this.show_amount_input = true
      this.allowancebike = parseInt(this.allowanceData.bike);
      this.localConvForm1.amount = parseInt(this.localConvForm1.distance) * parseFloat(this.allowanceData.bike);
      this.localamount1 = parseInt(this.localConvForm1.amount);
    }
    else if (this.localConvForm.travelClass == 'Car') {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseFloat(this.allowanceData.car);
    } else if (this.localConvForm.travelClass == 'Bike') {
      this.show_amount_input = true
      this.allowancebike = parseInt(this.allowanceData.bike);
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseFloat(this.allowanceData.bike);
    } else if (this.travelForm.travelMode == 'Car' && this.travelForm.arrivalDistance) {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm1.caramount = this.allowanceData.car
      this.travelForm.arrivalAmount = parseInt(this.travelForm.arrivalDistance) * parseFloat(this.allowanceData.car);
    } else if (this.travelForm.travelMode == 'Car' && this.travelForm.depatureDistance) {
      this.show_amount_input = true
      this.allowancecar = parseInt(this.allowanceData.car);
      this.localConvForm1.caramount = this.allowanceData.car
      this.travelForm.depatureAmount = parseInt(this.travelForm.depatureDistance) * parseFloat(this.allowanceData.car);

    }
    else {
      this.show_amount_input = false
      this.allowanceta = parseInt(this.allowanceData.ta);
      this.local = parseInt(this.localConvForm1.amount);
    }
  }
  local: any = [];
  addLocalConv(form2: NgForm) {
    this.localConvForm.bikeamount = parseFloat(this.allowanceData.bike);
    this.localConvForm.caramount = parseFloat(this.allowanceData.car);
    // else{
    if (this.localConvForm.date) this.localConvForm.date = moment(this.localConvForm.date).format('YYYY-MM-DD');

    this.localConvInfo.push(this.localConvForm);
    this.expense.localConvAmt += parseInt(this.localConvForm.amount);
    this.expense.totalAmt += parseInt(this.localConvForm.amount);

    this.localConvForm = {};
    form2.reset();
    form2.controls['modeOfTravel'].setErrors(null);
    form2.controls['travelClass'].setErrors(null);
    form2.controls['date'].setErrors(null);
    form2.controls['distance'].setErrors(null);
    form2.controls['amount'].setErrors(null);
    // setTimeout(() => {
    //   this.localConvForm.modeOfTravel = '';
    //   this.localConvForm.travelClass = '';
    //   this.localConvForm.date = '';
    //   this.localConvForm.distance = '';
    //   this.localConvForm.amount = '';
    //   this.localConvForm.remark = '';
    // }, 500);
    // }
  }
  addMiscExp(form4: NgForm) {
    if (this.miscExpForm.date) this.miscExpForm.date = moment(this.miscExpForm.date).format('YYYY-MM-DD');
    this.miscExpInfo.push(this.miscExpForm);
    this.expense.miscExpAmt += parseInt(this.miscExpForm.amount);
    this.expense.totalAmt += parseInt(this.miscExpForm.amount);
    this.miscExpForm = {};

    form4.reset();
    form4.controls['expName'].setErrors(null);
    form4.controls['date'].setErrors(null);
    form4.controls['amount'].setErrors(null);
    // setTimeout(() => {
    //   this.miscExpForm.expName = '';
    //   this.miscExpForm.date = '';
    //   this.miscExpForm.expPlace = '';
    //   this.miscExpForm.amount = '';
    //   this.miscExpForm.remark = '';
    // }, 500);
  }

  rmMiscExp(index, amt) {
    this.miscExpInfo.splice(index, 1);
    this.expense.miscExpAmt -= parseInt(amt);
    this.expense.totalAmt -= parseInt(amt);
  }

  rmLocalConvExp(index, amt) {
    this.localConvInfo.splice(index, 1);
    this.expense.localConvAmt -= parseInt(amt);
    this.expense.totalAmt -= parseInt(amt);
  }

  rmFoodExp(index, amt) {
    this.foodInfo.splice(index, 1);
    this.expense.foodAmt -= parseInt(amt);
    this.expense.totalAmt -= parseInt(amt);
  }

  rmHotelExp(index, amt) {
    this.hotelInfo.splice(index, 1);
    this.expense.hotelAmt -= parseInt(amt);
    this.expense.totalAmt -= parseInt(amt);
  }

  rmTravelExp(index, deptAmt, arrAmt) {


    this.travelInfo.splice(index, 1);
    this.expense.travelEntitlementAmt -= parseInt(deptAmt) + parseInt(arrAmt);
    this.expense.totalAmt -= parseInt(deptAmt) + parseInt(arrAmt);
  }
  videoId: any;
  flag_upload = true;
  flag_play = true;
  image: any = '';
  image_data: any = [];


  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',

      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {


          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {

          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    actionsheet.present();
  }

  takePhoto() {

    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection: 1,
      correctOrientation: true
    }


    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;

      if (this.image) {
        this.fileChange(this.image);
      }
    },
      (err) => {
      });
  }

  getImage() {
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      cameraDirection: 1,
      correctOrientation: true
    }


    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;


      if (this.image) {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }

  fileChange(img) {
    // this.image_data=[];
    this.image_data.push(img);

    this.image = '';
  }

  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }
  showLimit() {
    console.log('Image Data', this.image_data)
    let alert = this.alertCtrl.create({
      title: 'Alert',
      subTitle: "You can upload only 15 bill images",
      cssClass: 'alert-modal',

      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {

        }
      }
      ]
    });
    alert.present();
  }
  submitExpense() {
    let alert = this.alertCtrl.create({
      title: 'Save Expense',
      message: 'Do you want to Save this Expense?',
      cssClass: 'alert-modal',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {


          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.localConvForm1.food_expense_amount >= 301) {
              this.serve.presentToast('Food Expense Cannot be Greater Than 300');
              return;
            }
            if (this.expense.expType == 'Local Conveyance') {
              this.spinnerLoader = true
              this.Submit_button = true
              this.expense.billImage = this.image_data;
              this.expense.localConv1 = this.localConvForm1;
              this.expense.date_from = this.localConvForm1.date;
              this.expense.date_to = this.localConvForm1.date_to;
              this.expense.localConvAmt1 = this.localConvForm1.amount;
              this.expense.localConvfoodAmt1 = this.localConvForm1.food_expense_amount || 0;
              console.log(this.expense.localConvfoodAmt1)
              this.expense.totalAmt = Number(this.localConvForm1.amount) + Number(this.expense.localConvfoodAmt1);
              console.log(this.expense.totalAmt);
            } else if (this.expense.expType == 'Outstation Travel') {
              this.spinnerLoader = true
              this.Submit_button = true
              this.expense.billImage = this.image_data;
              this.expense.travel = this.travelInfo;
              this.expense.hotel = this.hotelInfo;
              this.expense.food = this.foodInfo;
              this.expense.localConv = this.localConvInfo;
              this.expense.miscExp = this.miscExpInfo;
            }
            this.serve.addData({ 'expenseData': this.expense }, 'AppExpense/submitExpense').then((result) => {
              if (result['statusCode'] == 200) {
                this.spinnerLoader = false
                this.Submit_button = false
                this.serve.successToast(result['statusMsg'])
                this.navCtrl.popTo(ExpenseListPage);
              } else {
                this.spinnerLoader = false
                this.Submit_button = false
                this.serve.errorToast(result['statusMsg'])
              }
            }, error => {
              this.Submit_button = false
              this.spinnerLoader = false
              this.serve.Error_msg(error);
              this.serve.dismiss();
            });

          }
        }

      ]
    });
    alert.present();

  }

  getYesterday() {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - 1);
    return newDate.toISOString().slice(0, 10);

    // shortcut
    //  var yesterday = new Date(Date.now() - 864e5); // 864e5 == 86400000 == 24*60*60*1000
    //  console.log(yesterday);

  }




}
