import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ContantService } from '../../../contant.service';
import {News} from '../../../class/news';
import {ForumInfo} from '../../../class/forum-info';
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
  province:string;
  provinces:string[];
  city:string;
  citys:string[];
  district:string;
  districts:string[];
  newslist:News[];
  forumlist:ForumInfo[];
  forumrecent:ForumInfo[];
  page:Number = 1;
  constructor(private httpService: HttpService,
    private contantService:ContantService, 
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
      console.log(response.results);
      this.types = new Array();
      response.results.forEach(element => {
        this.types.push(element.type);
      });
    });
    this.httpService.getBrands().then(response=>{
      console.log(response);
      this.brands = new Array();
      response.forEach(ele=>{
        this.brands.push(ele.name);
      })
    })
    this.httpService.getProvinces().then(resp=>{
      console.log(resp.results);
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });

    this.httpService.getNews(this.page.toString()).then(resp=>{
        console.log(resp);
        this.newslist = resp;
    });

    this.httpService.getRecentForums().then(resp=>{
      this.forumrecent = resp.results as ForumInfo[];
    });
  }
  typeListener(): void {
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
    
  }
  changeTab(index:Number){
    this.forumlist = []; // 初始化论坛数据
    this.page = 1;
    if(index==1){
         this.httpService.getNews(this.page.toString()).then(resp=>{
          console.log(resp);
          this.newslist = resp;
        });
    }else{
      var type="键盘乐器";
        if(index==2){
          type="键盘乐器";
        }
        if(index==3){
          type="管式乐器";
        }
        if(index==4){
          type="拉弦乐器";
        }
        if(index==5){
          type="弹拨乐器";
        }
        if(index==6){
          type="打击乐器";
        }
        if(index==7){
          type="吹奏乐器";
        }
        this.httpService.getForumsByType(type,this.page.toString() ).then(resp=>{
            this.forumlist = resp.results as ForumInfo[] ;
        })
    }
  }

  provinceListener(): void {
    this.httpService.getCitys(this.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city) ;
      });
    });
  }

  cityListener(){
    this.httpService.getDistricts(this.province, this.city).then(resp => {
      console.log(resp);
      this.districts = new Array();
      resp.results.forEach(element => {
        this.districts.push(element.district);
      });
    });
  }

  changetoNews(key:string){
    switch (key) {
    case "news":
        this.router.navigate(['/home/home/news']);
        break;
    default:
        this.router.navigate(['/home/home/forum/'+key]);
        break;
    }
  }
}
