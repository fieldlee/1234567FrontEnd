import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ContantService } from '../../../contant.service';
import { News } from '../../../class/news';
import { Ads } from '../../../class/ads';
import { ForumInfo } from '../../../class/forum-info';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-homedashboard',
  templateUrl: './homedashboard.component.html',
  styleUrls: ['./homedashboard.component.css'],
  providers: [HttpService, LoadJQService]
})
export class HomedashboardComponent implements OnInit {
  type: string;
  types: string[];
  subType: string;
  subtypes: string[];
  brands: string[];
  province: string;
  provinces: string[];
  city: string;
  citys: string[];
  district: string;
  districts: string[];
  newslist: News[];
  forumlist: ForumInfo[];
  forumrecent: ForumInfo[];
  page: Number = 1;
  index: Number = 1;
  adslist:Ads[]=[];
  constructor(private httpService: HttpService,
    private contantService: ContantService,
    private loadJqService: LoadJQService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.type = "";
    this.subType = "";
    this.province = "";
    this.city = "";
    this.district = "";
    this.brands = new Array();
    this.httpService.getType().then(response => {
      this.types = new Array();
      response.results.forEach(element => {
        this.types.push(element.type);
      });
    });
    this.httpService.getBrands().then(response => {
      this.brands = new Array();
      response.forEach(ele => {
        this.brands.push(ele.name);
      })
    })
    this.httpService.getProvinces().then(resp => {
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });

    this.httpService.getNews(this.page.toString()).then(resp => {
      this.newslist = resp;
    });

    this.httpService.getForumsByType("键盘乐器", this.page.toString()).then(resp => {
      this.forumlist = resp.results as ForumInfo[];
    })

    this.httpService.getRecentForums().then(resp => {
      this.forumrecent = resp.results as ForumInfo[];
    });

    this.httpService.getAds().then(resp=>{
      this.adslist = resp;
    });
  }
  typeListener(): void {
    
    
    if($('#selectType').val()){
      this.type = $('#selectType').val();
    }else{
      this.type = $('#selectTypeDele').val();
    }
    this.httpService.getSubType(this.type).then(
      resp => {
        console.log(resp);
        var i = 0;
        this.subtypes = new Array();
        resp.results.forEach(element => {
          this.subtypes[i] = element.subType;
          i = i + 1;
        });
       
      })
  }



  ngAfterViewInit() {
    this.loadJqService.reloadJQ(null);

    var win = $(window);
    var self = this;
    var tab_2 = $("#tab_2");
    // Each time the user scrolls
    win.scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= tab_2.height()+tab_2.offset().top) {
          $(".fixed_tool").addClass("show");
        }
    });

    // 选择框
    var self = this;
    $("#selectType").select2({
      placeholder: '请选择乐器分类'
    }).on('select2:select', function (evt) {
      self.typeListener();
    });
    $("#selectSubType").select2({
      placeholder: '请选择乐器'
    });
//  找琴行选择
    $("#selectTypeDele").select2({
      placeholder: '请选择乐器分类'
    }).on('select2:select', function (evt) {
      self.typeListener();
    });
    $("#selectSubTypeDele").select2({
      placeholder: '请选择乐器'
    });

//  找琴行选择省市区
    $('#selectProvince').select2({
        placeholder: '请选择省份'
    }).on('select2:select', function (evt) {
      self.provinceListener();
    });

    $('#selectCity').select2({
        placeholder: '请选择市'
    }).on('select2:select', function (evt) {
      self.cityListener();
    });

    $('#selectDistrict').select2({
        placeholder: '请选择区县'
    });
  }

  changeTab(index: Number) {

    this.forumlist = []; // 初始化论坛数据
    this.page = 1;
    var type = "键盘乐器";
    var typeCode = "A";
    if (index == 2) {
      type = "键盘乐器";
      typeCode = "A";
    }
    if (index == 3) {
      type = "管式乐器";
      typeCode = "B";
    }
    if (index == 4) {
      type = "拉弦乐器";
      typeCode = "C";
    }
    if (index == 5) {
      type = "弹拨乐器";
      typeCode = "D";
    }
    if (index == 6) {
      type = "打击乐器";
      typeCode = "E";
    }
    if (index == 7) {
      type = "吹奏乐器";
      typeCode = "F";
    }
    if (this.index == index) {
      if (index == 1) {
        this.changetoNews("news");
      } else {
        this.changetoNews(typeCode);
      }
      return;
    } else {
      this.index = index;
      if (index == 1) {
        this.httpService.getNews(this.page.toString()).then(resp => {
          console.log(resp);
          this.newslist = resp;
        });
      } else {

        this.httpService.getForumsByType(type, this.page.toString()).then(resp => {
          this.forumlist = resp.results as ForumInfo[];
        })
      }
    }
    $(".fixed_tool").removeClass("show");
  }

  provinceListener(): void {
    this.province = $('#selectProvince').val();
    this.httpService.getCitys(this.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city);
      });
    });
  }

  cityListener() {
    this.city = $('#selectCity').val();
    this.httpService.getDistricts(this.province, this.city).then(resp => {
      this.districts = new Array();
      resp.results.forEach(element => {
        this.districts.push(element.district);
      });
    });
  }

  changetoNews(key: string) {
    switch (key) {
      case "news":
        this.router.navigate(['/home/home/news']);
        break;
      default:
        this.router.navigate(['/home/home/forum/' + key]);
        break;
    }
  }

  adsClick(ads:Ads){
    console.log(ads);
    if(ads.type == "url"){
      window.open(ads.value,'_blank');
    }
    if(ads.type == "news"){
      this.router.navigate(['/home/home/newcontent/'+ads.value]);
    }
    if(ads.type == "product"){
      this.router.navigate(['/home/home/product/'+ads.value]);
    }
  }
}
