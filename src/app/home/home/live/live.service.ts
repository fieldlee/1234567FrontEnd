import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
declare var PeerManager: any;
import 'rxjs/add/operator/toPromise';
declare var $: any;
@Injectable()
export class LiveService {
  client: any
  private fileheaders = new Headers({ 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarysd3pNkhHgm8eLc2k' });//{ 'Content-Type': 'multipart/form-data'}
  private rootUrl = '/api';
  constructor(private http: Http) { }
  constructHeader() {
    var header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Access-Control-Allow-Origin', '*');
    if (window.localStorage.getItem("x-access-token")) {
      header.append('x-access-token', window.localStorage.getItem("x-access-token"));
    }
    if (window.localStorage.getItem("username")) {
      header.append('x-access-username', window.localStorage.getItem("username"));
    }
    if (window.localStorage.getItem("avator")) {
      header.append('x-access-avator', window.localStorage.getItem("avator"));
    }
    return header;
  }

  getClient() {
    console.log(this.client);
    if (this.client == undefined) {
      this.client = new PeerManager();
      return this.client;
    } else {
      return this.client;
    }
  }
  preTime(date) {
    var oldDate = (new Date(date)).getTime();
    var now = (new Date()).getTime();
    var seconds = (now - oldDate) / 1000;
    //计算相差多少天
    var day = Number((seconds / 86400).toFixed(0));//获得天数
    var hour = Number((seconds / 3600 - day * 24).toFixed(0));//获得小时数
    var minute = Number((seconds / 60 - (hour * 60 + day * 1440)).toFixed(0));//获得分钟数
    if (day > 30) {
      return date.yyyymmdd();
    } else if (day > 1 && day <= 30) {
      return day + "天前";
    } else if (hour > 1 && hour <= 24) {
      return hour + "小时前";
    } else {
      return minute + "分钟前";
    }
  }

  formatDate(date: Date) {
    const o = {
      "M+": date.getMonth() + 1,                 //月份   
      "d+": date.getDate(),                    //日   
      "h+": date.getHours(),                   //小时   
      "m+": date.getMinutes(),                 //分   
      "s+": date.getSeconds(),                 //秒   
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
      "S": date.getMilliseconds()             //毫秒   
    };
    var fmt = "yyyy-MM-dd";
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }




  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
