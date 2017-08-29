import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
declare var PeerManager: any;
import 'rxjs/add/operator/toPromise';
declare var $: any;
@Injectable()
export class LiveService {
  private fileheaders = new Headers({ 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarysd3pNkhHgm8eLc2k' });//{ 'Content-Type': 'multipart/form-data'}
  private rootUrl = '/api';
  client: any
  LiveStatus = {
    PLAN:"预报",
    LIVE:"直播中",
    OVER:"直播结束",
    CLOSE:"关闭"
  };
  ClassStatus = {
    PLAN:"预报",
    LIVE:"讲课中",
    OVER:"课堂结束",
    CLOSE:"关闭"
  };
  AdwardValues = [
    "1","2","3","4","5","10","2","4","6","8","10","20",
    "3","6","9","12","15","30"
  ];
  AdwardNames = [
    "草莓","樱桃","香蕉","密桃","苹果","菠萝","可口可乐","苏打水","果汁","红茶","牛奶","咖啡",
    "蛋挞","三明治","火腿","虾","鱼","火鸡"
  ];
  Adwardlist = [
    "strawberry","cherry","banana","peach","apple","pineapple","cacocl","soda","juice","tea",
    "milk","coffee","cupcake","sanwitch","ham","shrimp","fish","turkey"
  ];
  constructor(private http: Http) { 

  }
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
    return header;
  }

  getClient() {
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
// show 
  updateShowMainid(showid,mainid){
    const url = `${this.rootUrl}/web/show/update`;
    return this.http.post(url, JSON.stringify({"showid":showid,"mainid":mainid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  startShow(showid,mainid){
    const url = `${this.rootUrl}/web/show/start`;
    return this.http.post(url, JSON.stringify({"showid":showid,"mainid":mainid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  leaveShow(showid,memberid,type){
    const url = `${this.rootUrl}/web/show/leave`;
    return this.http.post(url, JSON.stringify({"showid":showid,"memberid":memberid,"type":type}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  joinShow(showid,memberid){
    const url = `${this.rootUrl}/web/show/join`;
    return this.http.post(url, JSON.stringify({"showid":showid,"memberid":memberid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }
// class
  updateClassMainid(classid,mainid){
    const url = `${this.rootUrl}/web/class/update`;
    return this.http.post(url, JSON.stringify({"classid":classid,"mainid":mainid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  startClass(classid,mainid){
    const url = `${this.rootUrl}/web/class/start`;
    return this.http.post(url, JSON.stringify({"classid":classid,"mainid":mainid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  leaveClass(classid,memberid,type){
    const url = `${this.rootUrl}/web/class/leave`;
    return this.http.post(url, JSON.stringify({"classid":classid,"memberid":memberid,"type":type}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  joinClass(classid,memberid){
    const url = `${this.rootUrl}/web/class/inclass`;
    return this.http.post(url, JSON.stringify({"classid":classid,"memberid":memberid}), { headers: this.constructHeader() })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
