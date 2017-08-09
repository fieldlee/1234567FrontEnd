import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Praise } from '../../../class/praise';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-praise',
  templateUrl: './praise.component.html',
  styleUrls: ['./praise.component.css'],
  providers: [HttpService, LoadJQService]
})
export class PraiseComponent implements OnInit {
  productid: string;
  productInfo: any = {};
  praise: Praise;
  provinces: string[];
  citys: string[];
  districts: string[];
  constructor(private httpService: HttpService,
    private route: ActivatedRoute,
    private loadJQService: LoadJQService) {
    this.praise = new Praise();
    this.praise.praisetitles = ["","","","","","","","","","","",""];
    
  }
  ngAfterViewInit() {
    
  }
  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.loadJQService.reloadJQ(null);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productid = params["id"];

      this.httpService.getProductById(this.productid).then(resp => {
        console.log(resp);
        if (resp.success) {
          this.productInfo = resp.data;
//        获取口碑配置信息 this.productInfo.type
          this.httpService.getPraiseConfig(this.productInfo.type).then(resp=>{
                if(resp.success){
                  this.praise.praisetitles = resp.data.tags;
                  var stars = new Array();
                  var values = new Array();
                  for (var i = 0; i < this.praise.praisetitles.length; i++) {
                        stars.push("4");
                        values.push("");
                  }
                  this.praise.praisestars = stars;
                  this.praise.praisevalues = values;

                }
                
          });
        }
      });
    });
    this.httpService.getProvinces().then(resp => {
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });

    if (window.localStorage.getItem("username")) {
      this.httpService.getUser(window.localStorage.getItem("username")).then(resp => {
        if (resp.success) {
          this.praise.province = resp.data['province'];
          var tmpcity = resp.data['city'];
          var tmpdistrict = resp.data['district'];

          this.httpService.getCitys(this.praise.province).then(resp => {
            this.citys = new Array();
            resp.results.forEach(element => {
              this.citys.push(element.city);
            });
            this.praise.city = tmpcity;

            this.httpService.getDistricts(this.praise.province, this.praise.city).then(resp => {
              this.districts = new Array();
              resp.results.forEach(element => {
                this.districts.push(element.district);
              });
              this.praise.district = tmpdistrict;
            });
          });
        }
      });
    }
  }
  provinceListener(): void {
    this.httpService.getCitys(this.praise.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city);
      });
    });
  }

  cityListener(): void {
    this.httpService.getDistricts(this.praise.province, this.praise.city).then(resp => {
      this.districts = new Array();
      resp.results.forEach(element => {
        this.districts.push(element.district);
      });
    });
  }


  submitPraise() {
    for (var i = 0; i < this.praise.praisetitles.length; i++) {
      if ($("#slider" + i).val() == "") {
        this.praise.praisestars[i] = "4";
      } else {
        this.praise.praisestars[i] = $("#slider" + i).val();
      }
    }
    this.praise.product = this.productid;
    this.praise.author = window.localStorage.getItem("username");
    var message="";
    if(this.praise.province == ""||this.praise.province == undefined){
      message = "请输入购买的省份";
    }
    if(this.praise.city == ""||this.praise.city == undefined){
      message = "请输入购买的城市";
    }
    if(this.praise.delegate == ""||this.praise.delegate == undefined){
      message = "请输入购买的代理商";
    }
    if (this.praise.telephone == ""||this.praise.telephone == undefined) {
      message = "请输入您的联系方式";
    }
    if (this.praise.chenghu == ""||this.praise.chenghu == undefined) {
      message = "请输入您的称呼";
    }
    if (this.praise.best == ""||this.praise.best == undefined) {
      message = "请输入您的最满意的信息";
    }
    if (this.praise.bad == ""||this.praise.bad == undefined) {
      message = "请输入您的最不满意的信息";
    }
    if(message != ""){
      $.notify(message, {
        type: 'warning',
        placement: {
          from: 'bottom',
          align: 'center'
        }
      }, {
          placement: {
            from: "bottom",
            align: "center"
          },
          animate: {
            enter: 'animated lightSpeedIn',
            exit: 'animated lightSpeedOut'
          }
        });

      return;
    }
    this.httpService.createParise(this.praise).then(resp => {
      this.praise = resp;
    });
  }

}
