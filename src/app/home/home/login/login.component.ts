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
        if (resp["data"]) {
          console.log(resp["data"]);
          var userObj = resp["data"];
          window.localStorage.setItem("username", userObj["username"]);
          window.localStorage.setItem("avator", userObj["avator"]);
          window.localStorage.setItem("admin", userObj["admin"]);
          window.localStorage.setItem("phone", userObj["phone"]);
          window.localStorage.setItem("email", userObj["email"]);
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
