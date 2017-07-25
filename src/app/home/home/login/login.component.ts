import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../http.service';
import { md5 } from '../../../md5';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [HttpService]
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  isErr: boolean;
  messages: string[];
  constructor(private httpService: HttpService, private router: Router) {
    this.isErr = false;
  }

  ngOnInit() {

  }

  login() {
    this.isErr = false;
    this.messages = new Array();
    if (this.username == "" || this.username == undefined) {
      this.isErr = true;
      this.messages.push("请输入用户名（邮箱地址或手机号码）");
      return;
    }
    if (this.password == "" || this.password == undefined) {
      this.isErr = true;
      this.messages.push("请输入密码");
      return;
    }
    var formdata = { "username": this.username, "password": md5(this.password) };
    this.httpService.login(formdata).then(resp => {
      console.log(resp);
      if (resp["success"]) {
        if (resp["token"]) {
          window.localStorage.setItem("x-access-token", resp["token"]);
        }
        var i = 0;
        if (resp["data"]) {
          var userObj = resp["data"];
          window.localStorage.setItem("username", userObj["username"]);
          window.localStorage.setItem("avator", userObj["avator"]);
          if(userObj["admin"]){
            window.localStorage.setItem("admin", userObj["admin"]);
          }
          if(userObj["phone"]){
            window.localStorage.setItem("phone", userObj["phone"]);
            i = i+1;
          }
          if(userObj["email"]){
            window.localStorage.setItem("email", userObj["email"]);
            i = i+1;
          }
          if(userObj["avatorPath"]){
            window.localStorage.setItem("avatorPath", userObj["avatorPath"]);
            i = i+1;
          }
          if(userObj["backgroundPath"]){
            window.localStorage.setItem("backgroundPath", userObj["backgroundPath"]);
            i = i+1;
          }
          if(userObj["birthday"]){
            window.localStorage.setItem("birthday", userObj["birthday"]);
            i = i+1;
          }
          if(userObj["province"]){
            window.localStorage.setItem("province", userObj["province"]);
            i = i+1;
          }
          if(userObj["city"]){
            window.localStorage.setItem("city", userObj["city"]);
            i = i+1;
          }
          if(userObj["district"]){
            window.localStorage.setItem("district", userObj["district"]);
            i = i+1;
          }
          if(userObj["address"]){
            window.localStorage.setItem("address", userObj["address"]);
            i = i+1;
          }
          if(userObj["sex"]){
            window.localStorage.setItem("sex", userObj["sex"]);
            i = i+1;
          }
          if(userObj["focus"]){
            window.localStorage.setItem("focus", userObj["focus"]);
            i = i+1;
          }
          if(userObj["skills"]){
            window.localStorage.setItem("skills", userObj["skills"]);
            i = i+1;
          }
          if(i>10){
            window.localStorage.setItem("percent", "100%");
          }else if (i>0){
            window.localStorage.setItem("percent",  (i*10)+"%");
          }else{
            window.localStorage.setItem("percent",  "10%");
          }
    //       phone:String,
    // email:String,
    // registerTime:Date,
    // avator:String,
    // avatorPath:String,
    // backgroundPath:String,
    // birthday:Date,
    // province:String,
    // city:String,
    // district:String,
    // address:String,
    // sex:String,
    // focus:Array,
    // skills:Array

        }
        this.router.navigate(['/home']);
      } else {
        this.isErr = true;
        this.messages.push(resp["message"]);
      }
    });
  }
  forget(){
    this.router.navigate(['/forget']);
  }
}
