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
  imageCanvas: any;
  imageBackCanvas: any;
  uploadtype: string = "head";

  curUsername: string;
  oldpassword: string = "";
  newpassword: string = "";
  newpassword2: string = "";
  messages: string[] = [];
  successmessages: string[] = [];

  follows: any[] = [];
  followMy: any[] = [];
  issueForums: any[] = [];
  collections: any[] = [];

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
    this.avatorPath = "data:image/png;base64,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";
    this.backgroundPath = "./public/img/bg.jpg";
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
      console.log(this.curUsername);
      if (this.curUsername == undefined) {
        if (window.localStorage.getItem("username")) {
          this.curUsername = window.localStorage.getItem("username");
        }
        else {
          return;
        }
      }
      // 获得个人信息
      // =============
      this.httpService.getUser(this.curUsername).then(resp => {
        if (resp.success) {
          this.user = resp.data;
          if (this.user.username == window.localStorage.getItem("username")) {
            this.isSelf = true;
          }
          if (this.user.avatorPath) {
            this.avatorPath = this.user.avatorPath;
          } else {
            this.avatorPath = "data:image/png;base64,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"
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
          if(this.province){
            this.provinceListener();
            // var self = this;
            // $("#province").select2({
            //   placeholder: '请选择省份'
            // }).on('select2:select', function (evt) {
            //   self.provinceListener();
            // });
            // $("#province").val(this.province);
          }
          this.city = this.user.city;
          if(this.city){
            this.cityListener();
            // var self = this;
            // $("#city").select2({
            //   placeholder: '请选择市'
            // }).on('select2:select', function (evt) {
            //   self.cityListener();
            // });
            // $("#city").val(this.city);
          }
          this.district = this.user.district;
          // if(this.district){
          //   var self = this;
          //   $("#district").select2({
          //     placeholder: '请选择区县'
          //   }).on('select2:select', function (evt) {
              
          //   });
          //   $("#district").val(this.city);
          // }
          this.address = this.user.address;
          this.sex = this.user.sex;
          this.focus = this.user.focus;
          this.skills = this.user.skills;
          if (this.birthday) {
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
      this.httpService.getCollections(this.curUsername).then(resp => {
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

  showToast() {
    $.notify("请先上传图片", {
      type: "warning",
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
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    var self = this;
    this.imageCanvas = $("#imageHead");
    this.imageBackCanvas = $("#imageBack");
    this.imageCanvas.cropper({
      aspectRatio: 1,
      preview: "#headerPreview"
    });
    this.imageBackCanvas.cropper({
      aspectRatio: 2,
      preview: "#backPreview"
    });
    var $inputImage = $("#inputImage");
    var $inputBackImage = $("#inputBackImage");
    $inputImage.change(function () {
      var fileReader = new FileReader(),
        files = this.files,
        file;
      if (!files.length) {
        return;
      }
      file = files[0];
      if (/^image\/\w+$/.test(file.type)) {
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          $inputImage.val("");
          self.imageCanvas.cropper("reset", true).cropper("replace", this.result);
        };
      } else {
        this.showToast()
      }
    });

    $inputBackImage.change(function () {
      var fileReader = new FileReader(),
        files = this.files,
        file;
      if (!files.length) {
        return;
      }
      file = files[0];
      if (/^image\/\w+$/.test(file.type)) {
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          $inputBackImage.val("");
          self.imageBackCanvas.cropper("reset", true).cropper("replace", this.result);
        };
      } else {
        this.showToast()
      }
    });
  }

  ngAfterViewChecked() {
    const self = this;
    this.loadJqService.reloadJQ(function (start, end) {
      self.birthday = start;
    });
  }

  UploadImage(type: string) {
    this.uploadtype = type;
    if (this.uploadtype == "head") {
      $('#modifyHeadermodal').appendTo("body").modal('show');
    }
    if (this.uploadtype == "back") {
      $('#modifyBackmodal').appendTo("body").modal('show');
    }
  }

  getHeaderImageData() {
    console.log(this.imageCanvas.cropper({"fillColor":"#fff"}).cropper("getCroppedCanvas")) ;
    var imageDate = this.imageCanvas.cropper("getDataURL");
    var qulity = 1.0;
    if (imageDate.length > 100000) {
      qulity = 0.1;
    } else if (imageDate.length > 50000) {
      qulity = 0.3;
    } else if (imageDate.length > 25000) {
      qulity = 0.8;
    } else {
      qulity = 1.0;
    }
    var newImageData = this.imageCanvas.cropper("getDataURL",{
                    width: 150,
                    height: 150
                }, "image/jpeg",qulity);
    this.httpService.updateUserAvator(this.curUsername, JSON.stringify({ data: newImageData })).then(resp => {

      this.avatorPath = newImageData;
    });


  }

  getBackImageData() {
    var imageDate = this.imageBackCanvas.cropper("getDataURL");
    
    var qulity = 1.0;
    if (imageDate.length > 100000) {
      qulity = 0.1;
    } else if (imageDate.length > 50000) {
      qulity = 0.3;
    } else if (imageDate.length > 25000) {
      qulity = 0.8;
    } else {
      qulity = 1.0;
    }
    
    var newImageData = this.imageBackCanvas.cropper("getDataURL",{
                    width: 600,
                    height: 300
                }, "image/jpeg",qulity);

    this.httpService.updateUserBack(this.curUsername, JSON.stringify({ data: newImageData })).then(resp => {
      this.backgroundPath = newImageData;
      this.urlbackground = "url(" + this.backgroundPath + ") center center";
    })
  }

  changeListener($event): void {
   
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

    this.user.avator = this.avator;
    this.user.phone = this.phone;
    this.user.email = this.email;
    this.user.avatorPath = "";
    this.user.backgroundPath = "";
    this.user.birthday = this.birthday;
    this.user.province = this.province;
    this.user.city = this.city;
    this.user.district = this.district;
    this.user.address = this.address;
    this.user.sex = this.sex;
    this.user.focus = new Array();

    this.user.skills = $("input[name=skill]").tagsinput('items');
    const self = this;
    $("select[name=focus] option:selected").map(function (i, el) {
      self.user.focus.push($(el).text())
    });
    console.log(this.user);
    this.httpService.updateUser(this.user).then(response => {
      console.log(response);

      window.localStorage.setItem("avator", this.avator);
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
