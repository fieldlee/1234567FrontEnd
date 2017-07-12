import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../http.service';
import { md5 } from '../../../md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[HttpService]
})
export class RegisterComponent implements OnInit {
  username:string;
  avatorName:string;
  password:string;
  checked:string;
  showAlert:boolean;
  erravator:boolean;

  messages:string[];

 
  constructor(private httpService:HttpService,private route: ActivatedRoute,
    private router: Router) { 
    this.showAlert = false;
    this.erravator = false;
  }

  ngOnInit() {
  }

  signup(){
    this.messages = Array<string>();
    console.log(this.checked);

    if(this.avatorName =="" || this.avatorName == undefined){
      this.showAlert = true;
      this.erravator = true;
      this.messages.push("请输入昵称");
      return
    }else{
       this.showAlert = false;
    }

    if(this.username =="" || this.username == undefined){
      this.showAlert = true;
      this.messages.push("请输入用户名（邮件地址或手机号码）");
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

    var formdata = { "username": this.username, "avator": this.avatorName,"password":md5(this.password) };
    this.httpService.register(formdata).then(resp => {
      console.log(resp);
      if (resp["token"]) {
        window.localStorage.setItem("x-access-token", resp["token"]);
      }
      if (resp["data"]) {
        var userObj = resp["data"];
        window.localStorage.setItem("username", userObj["username"]);
        window.localStorage.setItem("avator", userObj["avator"]);
        window.localStorage.setItem("admin", userObj["admin"]);
        window.localStorage.setItem("phone", userObj["phone"]);
        window.localStorage.setItem("email", userObj["email"]);
      }
      this.router.navigate(['home']);
    });
  }

}
