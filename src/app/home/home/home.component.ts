import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import {ForumsComponent} from './forums/forums.component';
import {ContantService} from '../../contant.service';
import {HttpService} from '../../http.service';
import { md5 } from '../../md5';
declare var BootstrapDialog: any;
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ContantService,HttpService]
})
export class HomeComponent implements OnInit {
  key:string;
  avatorName: string;
  isAnymouse: boolean;
  menuKey : string="";
  avatorPath:string = "";
  percent : string = "";
  username :string="";
  lvlpercent :string="";
  curlvl :string="";
  tolvl:string="";
  newsNumber:string = "";
  // 登录信息
  loginavatorName:string;
  loginusername: string;
  password: string;
  isErr: boolean;
  showAlert:boolean;
  messages: string[];
  message: string;
  checked:boolean;
  isSuccuess:boolean;
  constructor(
    private ref: ChangeDetectorRef,
    private route :ActivatedRoute,
    private router:Router,
    private httpService:HttpService,
    private contantService:ContantService
  ) {
    this.avatorName = window.localStorage.getItem("avator");
    this.isErr = false;
    this.isAnymouse = false;
    if (window.localStorage.getItem("x-access-token")) {
      this.isAnymouse = true;
    }

  }

  ngOnInit() {
    this.contantService.homeComponent = this;
    if(window.localStorage.getItem("avatorPath")){
      this.avatorPath = window.localStorage.getItem("avatorPath");
    }
    this.curlvl = window.localStorage.getItem("lvl");
    if(this.curlvl==""|| this.curlvl==undefined){
      this.curlvl="普通会员";
    }
    if(this.curlvl=="普通会员"){
      this.tolvl = "银会员";
    }else if (this.curlvl == "银会员"){
      this.tolvl = "金会员";
    }else if(this.curlvl == "金会员"){
      this.tolvl = "钻石会员";
    }
    this.lvlpercent = window.localStorage.getItem("lvlpercent");
    if(this.lvlpercent==""|| this.lvlpercent==undefined){
      this.lvlpercent="5";
    }
    this.percent = window.localStorage.getItem("percent");
    this.username = window.localStorage.getItem("username");

    this.httpService.getNewsNumber().then(resp=>{
        if(resp.success){
          this.newsNumber = resp.count+"";
        }
    });
  }

  keypress(event){
    if(event.keyCode == "13"){
     this.search();         
    }
  }

  search(){
    this.router.navigate(['/home/home/search/'+this.key]);
  }

  logout() {
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要退出登录吗?',
      type: BootstrapDialog.TYPE_INFO, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '确定', // <-- Default value is 'OK',
      btnOKClass: 'btn-info', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          window.localStorage.clear();
          self.isAnymouse = false;
          self.avatorName = "";
        }
      }
    });
  }


  login() {
    this.isErr = false;
    this.messages = new Array();
    if (this.loginusername == "" || this.loginusername == undefined) {
      this.isErr = true;
      this.messages.push("请输入手机号码");
      return;
    }
    if (this.password == "" || this.password == undefined) {
      this.isErr = true;
      this.messages.push("请输入密码");
      return;
    }
    var formdata = { "username": this.loginusername, "password": md5(this.password) };
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
          if(userObj["lvl"]){
            window.localStorage.setItem("lvl", userObj["lvl"]);
            if(userObj["lvl"]=="钻石会员"){
              window.localStorage.setItem("lvlpercent", "100");
            }else if(userObj["lvl"]=="普通会员") {
              window.localStorage.setItem("lvlpercent", (Number(userObj["issueCount"])/50).toFixed(0));
            }else if(userObj["lvl"]=="银会员"){
              window.localStorage.setItem("lvlpercent", (Number(userObj["issueCount"])/100).toFixed(0));
            }else if(userObj["lvl"]=="金会员"){
              window.localStorage.setItem("lvlpercent", ((Number(userObj["issueCount"])-100)/100).toFixed(0));
            }
          }else{
            window.localStorage.setItem("lvl", "普通会员");
          }
        }
        // this.router.navigate(['/home']);
        $('#loginModel').modal('hide');
        this.isAnymouse = true;
      } else {
        this.isErr = true;
        this.messages.push(resp["message"]);
      }
    });
  }
  signup(){
    this.messages = Array<string>();
    this.showAlert = false;

    if(this.loginavatorName =="" || this.loginavatorName == undefined){
      this.showAlert = true;
      this.messages.push("请输入昵称");
      return
    }else{
       this.showAlert = false;
    }

    if(this.loginusername =="" || this.loginusername == undefined){
      this.showAlert = true;
      this.messages.push("请输入手机号码");
      return
    }else{
       this.showAlert = false;
    }
    if(this.password =="" || this.password == undefined){
      this.showAlert = true;
      this.messages.push("请输入密码");
      return
    }else{
       this.showAlert = false;
    }

    if(this.checked == undefined){
      this.showAlert = true;
      this.messages.push("请选择同意网站规则");
      return
    }else{
      this.showAlert = false;
    }

    var formdata = { "username": this.loginusername, "avator": this.loginavatorName,"password":md5(this.password) };
    this.httpService.register(formdata).then(resp => {
      console.log(resp);
      if (resp["token"]) {
        window.localStorage.setItem("x-access-token", resp["token"]);
      }
      if (resp["data"]) {
        var userObj = resp["data"];
        window.localStorage.setItem("username", userObj["username"]);
        window.localStorage.setItem("avator", userObj["avator"]);
        window.localStorage.setItem("avatorPath", userObj["avatorPath"]);
        window.localStorage.setItem("admin", userObj["admin"]);
        window.localStorage.setItem("phone", userObj["phone"]);
        window.localStorage.setItem("email", userObj["email"]);
      }
      // this.router.navigate(['home']);
      $('#registerModel').modal('hide');
      this.isAnymouse = true;
    });
  }
  send(){
    this.isErr = false;
    this.isSuccuess = false;
    console.log(this.loginusername);
    if(this.loginusername==undefined || this.loginusername==""){
      this.isErr = true;
      this.message = "请输入手机号码";
      return
    }
    this.httpService.forget({"username":this.loginusername}).then(resp=>{
        if(resp["success"]){
          this.isSuccuess = true;
          this.message = resp["message"];
        }else{
          this.isErr = true;
          this.message = resp["message"];
        }
    });
  }
  register(){
    $('#registerModel').appendTo("body").modal('show');
  }
  openlogin(){
    $('#loginModel').appendTo("body").modal('show');
  }
  reLogin(){
    $('#loginModel').appendTo("body").modal('show');
  }
  forget(){
    $('#forgetModel').appendTo("body").modal('show');
  }
}
