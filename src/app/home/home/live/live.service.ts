import { Injectable } from '@angular/core';
declare var PeerManager: any;
@Injectable()
export class LiveService {
  client: any
  constructor() { }
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
}
