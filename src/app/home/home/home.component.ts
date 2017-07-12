import { Component, OnInit } from '@angular/core';
declare var BootstrapDialog: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  avatorName: string;
  isAnymouse: boolean;
  constructor() {
    this.avatorName = window.localStorage.getItem("avator");
    this.isAnymouse = false;
    if (window.localStorage.getItem("x-access-token")) {
      this.isAnymouse = true;
    }
  }

  ngOnInit() {
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
}
