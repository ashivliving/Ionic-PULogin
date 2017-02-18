import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import { Http } from '@angular/http';


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loading: Loading;
  public dataPresent;
  public alert;
	public user;
	public password;
  public loginFlag;
  public logoutFlag;
  public database;
  public activeId;
  public people: Array<Object>;
  constructor(public navCtrl: NavController,public toastCtrl: ToastController, private platform: Platform, public navParams: NavParams, private http: Http,private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.loginFlag = false;
    this.logoutFlag = false;
    this.dataPresent = false;
    this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({name: "data.db", location: "default"}).then(() => {
                this.refresh();
            }, (error) => {
                console.log("ERROR: ", error);
            });
        });
  }


  public loginUser() {
    setTimeout(() => {
                 if(!this.loginFlag){
                   //this.loading.dismiss();
                   console.log("Internal Server Error!");
                   this.showError('Server Error','Please Try again'); 
                 }
                 return 0;
               },2000);
    //this.showLoading();
  	this.http.get('https://securelogin.pu.ac.in/cgi-bin/login?user='+this.user+'&password='+this.password+'&cmd=authenticate&Login=Log+In')
  	.subscribe(data => {
             
           //this.loading.dismiss();
           this.showToast("Login Successful");
           this.loginFlag = true;
           console.log("Login Successful");
          },error => {
                 //this.loading.dismiss();
                 this.showError("Opss!","Already Logged In Or Incorrect Credentials");
                 console.log("ALready Logged In!");   
          });
  }

  public logoutUser() {
   // this.showLoading();
    setTimeout(() => {
                 if(!this.logoutFlag){
                   //this.loading.dismiss();
                   console.log("Internal Server Error!");
                   this.showError('Server Error','Please Try again'); 
                   this.logoutFlag = false;
                 }
                 return 0;
               },2000);
    this.http.get('https://securelogin.pu.ac.in/cgi-bin/login?cmd=logout')
    .subscribe(data => {
           //this.loading.dismiss();
           this.showToast("Logout Successful");
           this.logoutFlag = true;
           console.log("Logout Successful");
          });
   
  }

  public showError(title,text) {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    this.alert.present(prompt);
  }

  public showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  public userAdd() {
    let prompt = this.alertCtrl.create({
      title: 'Add User',
      message: "Enter credentials",
      inputs: [
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username'
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          class: 'primary',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            if((data.username != "")&&(data.password != "")){
              this.database.executeSql("INSERT INTO people (username, password) VALUES ('"+data.username+"', '"+data.password+"')", []).then((datax) => {
              this.user = data.username;
              this.password = data.password;
              this.refresh();
              this.showToast("User Added Successfully");
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
            }
          }
        }
      ]
    });
    prompt.present();

  }

  public update(id,username,password) {
    let prompt = this.alertCtrl.create({
      title: 'Update User',
      message: "Enter credentials",
      inputs: [
        {
          name: 'username_u',
          type: 'text',
          value: username,
          placeholder: 'Username'
        },
        {
          name: 'password_u',
          type: 'password',
          value: password,
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Delete',
          handler: data => {
            this.database.executeSql("DELETE FROM people WHERE id="+id+"", []).then((datax) => {
              this.user = null;
              this.password = null;
              this.refresh();
              this.showToast("Deleted");
              console.log("Deleted!")
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {
            if((data.username_u!= "")&&(data.password_u != "")){

              this.database.executeSql("DELETE FROM people WHERE id="+id+"", []).then((datax) => {
                this.database.executeSql("INSERT INTO people (username, password) VALUES ('"+data.username_u+"', '"+data.password_u+"')", []).then((datax) => {
                  this.user = data.username_u;
                  this.password = data.password_u;
                  this.refresh();
                  this.showToast("Data Updated successfully!");
                  console.log("Updated!");
                }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
              });
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.err));
            });

           }
          }
        }

      ]
    });
    prompt.present();
  }

   public refresh() {
        this.database.executeSql("SELECT * FROM people ORDER BY id DESC", []).then((data) => {
            this.people = [];
            if(data.rows.length > 0) {
              this.dataPresent = true;
                for(var i = 0; i < data.rows.length; i++) {
                    this.people.push({id: data.rows.item(i).id,username: data.rows.item(i).username, password: data.rows.item(i).password});
                }
            }
            
            console.log("All User - ",this.people);
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

    public select(id,username,password) {
      this.user = username;
      this.password = password;
      this.activeId = id;
      console.log("Username - ",id);
    }

    showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });

    toast.present(toast);
  }

    public dummy() {
      console.log("Dummy!");
    }
  

}
