import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../http.service';
import { ContantService } from '../../../contant.service';
import { LoadJQService } from '../../../load-jq.service';
import { md5 } from '../../../md5';
declare var $: any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [HttpService, LoadJQService]
})
export class ProfileComponent implements OnInit {
  curUsername: string;
  oldpassword: string = "";
  newpassword: string = "";
  newpassword2: string = "";
  messages: string[] = [];
  successmessages: string[] = [];

  follows: any[] = [];
  followMy: any[] = [];
  issueForums: any[] = [];
  collections:any[] = [];

  headerBackgroudPath: string;
  havLoaction: boolean;
  avatorPath: string;
  user: any;
  currentTab: any;
  isSelf: boolean;

  phone: string;
  email: string;

  avator: string;

  backgroundPath: string;
  birthday: Date;
  birthdayString: string;
  province: string;
  city: string;
  district: string;
  address: string;
  sex: string;
  focus: string[];
  skills: string[];
  // 省份
  provinces: string[];
  citys: string[];
  districts: string[];
  allSubTypes: string[];

  urlbackground: string;
  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private contantService: ContantService,
    private loadJqService: LoadJQService) {
    this.havLoaction = false;
    this.isSelf = false;
    this.currentTab = 0;
    this.avatorPath = "./public/img/girl1.png";
    this.backgroundPath = "./public/img/background1.png";
    this.urlbackground = "url(" + this.backgroundPath + ") center center";
  }
  yyyymmdd(t: Date) {
    if (typeof t == "string") {
      t = new Date(t);
    }
    var mm = t.getMonth() + 1; // getMonth() is zero-based
    var dd = t.getDate();

    return [t.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
  }
  ngOnInit() {


    this.route.params.subscribe(params => {
      this.curUsername = params["username"];
      if (this.curUsername == undefined) {
        if (window.localStorage.getItem("username")) {
          this.curUsername = window.localStorage.getItem("username");
        }
        else {
          return;
        }
      }
      // 获得个人信息
      this.httpService.getUser(this.curUsername).then(resp => {
        if (resp.success) {
          this.user = resp.data;
          if (this.user.username == window.localStorage.getItem("username")) {
            this.isSelf = true;
          }
          if (this.user.avatorPath) {
            this.avatorPath = this.user.avatorPath;
          } else {
            this.avatorPath = "./public/img/boy1.png"
          }
          if (this.user.province) {
            this.havLoaction = true;
          }
          this.avator = this.user.avator;
          this.phone = this.user.phone;
          this.email = this.user.email;
          // this.avatorPath = this.user.avatorPath;
          if (this.user.backgroundPath) {
            this.backgroundPath = this.user.backgroundPath;
            this.urlbackground = "url(" + this.backgroundPath + ") center center";
          }
          this.birthday = this.user.birthday;
          this.province = this.user.province;
          this.city = this.user.city;
          this.district = this.user.district;
          this.address = this.user.address;
          this.sex = this.user.sex;
          this.focus = this.user.focus;
          this.skills = this.user.skills;
          if (this.birthday) {
            console.log(this.birthday);
            this.birthdayString = this.yyyymmdd(this.birthday);
            // $('input[name=birthday]').data('daterangepicker').setStartDate(this.birthday);
          }
        }
      });
      // 获得follow info

      this.httpService.getFollow().then(resp => {
        if (resp.success) {
          this.follows = resp.myfollows;
          this.followMy = resp.followmys;
        }
      });

      this.httpService.getForumsByUsername(this.curUsername).then(resp => {
        console.log(resp);
        if (resp.success) {
          this.issueForums = resp.results;
        }
      });
      // 获得收藏
      this.httpService.getCollections(this.curUsername).then(resp=>{
        if (resp.success) {
          this.collections = resp.results;
        }
      });


    }); // 读取个人信息和follow信 结束

    this.httpService.getProvinces().then(resp => {
      console.log(resp.results);
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });


    // focus:Array,
    // skills:Array
    this.httpService.getAllSubType().then(resp => {
      console.log(resp.results);
      this.allSubTypes = new Array();
      resp.results.forEach(element => {
        this.allSubTypes.push(element.subType);
      });
      console.log(this.allSubTypes);
    })
  }
  changeListener($event): void {
    const _this = this;
    $('#uploadForm').ajaxSubmit({
      error: function (xhr) {
        console.log(xhr)
      },
      success: function (response) {
        console.log(response);
        var respJson;
        if (typeof respJson == "string") {
          respJson = JSON.parse(response);
        } else {
          respJson = response;
        }
        _this.user.avatorPath = "http://localhost:3000" + respJson["path"];
        _this.avatorPath = "http://localhost:3000" + respJson["path"];
      }
    });
  }
  changeListener2($event): void {
    const _this = this;
    $('#uploadForm2').ajaxSubmit({
      error: function (xhr) {
        console.log(xhr)
      },
      success: function (response) {
        console.log(response);
        var respJson;
        if (typeof respJson == "string") {
          respJson = JSON.parse(response);
        } else {
          respJson = response;
        }
        _this.user.backgroundPath = "http://localhost:3000" + respJson["path"];
        _this.backgroundPath = "http://localhost:3000" + respJson["path"];
        _this.urlbackground = "url(" + _this.backgroundPath + ") center center";
      }
    });
  }
  provinceListener(): void {
    this.httpService.getCitys(this.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city);
      });
    });
  }
  cityListener(): void {
    this.httpService.getDistricts(this.province, this.city).then(resp => {
      console.log(resp);
      this.districts = new Array();
      resp.results.forEach(element => {
        this.districts.push(element.district);
      });
    });
  }
  ngAfterViewChecked() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;
    this.loadJqService.reloadJQ(function (start, end) {
      self.birthday = start;
    });

  }

  addAttention() {
    const flowData = { "username": window.localStorage.getItem("username"), "followusername": this.user.username };
    this.httpService.createFollow(flowData).then(resp => {
      var type = "success";
      if (resp.success) {
        type = "success";
      } else {
        type = "warning";
      }
      $.notify(resp.message, {
        type: type,
        placement: {
          from: 'bottom',
          align: 'center'
        }
      }, {
          animate: {
            enter: 'animated lightSpeedIn',
            exit: 'animated lightSpeedOut'
          }
        });
      return;
    });
  }

  changeTab(item: any) {
    this.currentTab = item;
    this.messages = [];
    this.successmessages = [];

    if (item == 2) {
      setTimeout(this.loadJqService.reloadJQ(null), 2000);
    }
  }
  submit() {
    console.log(this.user);
    this.user.avator = this.avator;
    this.user.phone = this.phone;
    this.user.email = this.email;
    this.user.avatorPath = this.avatorPath;
    this.user.backgroundPath = this.backgroundPath;
    this.user.birthday = this.birthday;
    this.user.province = this.province;
    this.user.city = this.city;
    this.user.district = this.district;
    this.user.address = this.address;
    this.user.sex = this.sex;
    this.user.focus = new Array();
    // $("select[name=focus] option:selected")
    // .forEach(element => {
    //   this.user.focus.push(element.text)
    // });
    // this.user.focus =  $("select[name=focus] option:selected" ).val();
    this.user.skills = $("input[name=skill]").tagsinput('items');
    const self = this;
    $("select[name=focus] option:selected").map(function (i, el) {
      console.log($(el).text());
      self.user.focus.push($(el).text())
    });
    this.httpService.updateUser(this.user).then(response => {
      $.notify("您的个人信息已经更新", {
        type: 'success',
        placement: {
          from: 'bottom',
          align: 'center'
        }
      }, {

          animate: {
            enter: 'animated lightSpeedIn',
            exit: 'animated lightSpeedOut'
          }
        });
    });
  }

  submitpassword() {
    this.messages = [];
    this.successmessages = [];
    if (this.newpassword == this.newpassword2) {
      const changedata = { "username": window.localStorage.getItem("username"), "oldpassword": md5(this.oldpassword), "newpassword": md5(this.newpassword) };
      this.httpService.changepassword(changedata).then(resp => {
        if (resp.success) {
          this.successmessages.push(resp.message);
          this.oldpassword = "";
          this.newpassword = "";
          this.newpassword2 = "";
        } else {
          this.messages.push(resp.message);
          this.oldpassword = "";
          this.newpassword = "";
          this.newpassword2 = "";
        }
      });
    } else {
      this.messages.push("两次输入的密码不符，请重新输入");
      this.newpassword = "";
      this.newpassword2 = "";
    }
  }
}
