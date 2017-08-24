import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../http.service';
import { ContantService } from '../../../contant.service';
import { ForumInfo } from '../../../class/forum-info';
import { Ads } from '../../../class/ads';
import { Tag } from '../../../class/tag';
declare var $: any;
@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
  providers: [HttpService]
})
export class ForumsComponent implements OnInit {
  key: string;
  instrumentType: string;
  instrumentSubForums: string[] = [];
  type: string;
  forumlist: ForumInfo[] = [];
  hotlist: ForumInfo[] = [];
  loadingText: string = "加载中...";
  loadingable: boolean = true;
  isloading: boolean = false;
  page: number = 1;
  adslist: Ads[] = [];
  searchString = "";
  taglist:string[] = [];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private contantService: ContantService,
    private httpService: HttpService) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.key = params["key"];

      if (this.key != undefined) {

        this.isloading = false;
        this.instrumentType = this.contantService.getInstrumentType(this.key);
        this.instrumentSubForums = this.contantService.getSubForums(this.key);
        this.httpService.getForumsByType(this.instrumentType, this.page.toString()).then(resp => {
          // console.log(resp);
          this.page = parseInt(resp.page);
          this.forumlist = resp.results as ForumInfo[];
          
          $('#forumTab a:first').tab('show');//每次都打开第一个tab
        })

        this.httpService.getTagByType(this.instrumentType).then(resp=>{
          if (resp.success) {
            this.taglist = resp.results ;
          }
        })
      }
    });

    this.httpService.getAds().then(resp => {
      this.adslist = resp;
    });

    this.httpService.getHotForums().then(resp=>{
      this.hotlist = resp.results as ForumInfo[];
    });

    
  }

  changeListener($event){
    if(this.searchString==""){
      this.search();
    }
  }

  keypress(event) {
    if (event.keyCode == "13") {
      this.search();
    }
  }

  check(tag){
    if(this.searchString == tag){
      this.searchString = "";
    }else{
      this.searchString = tag;
    }
    this.search();
  }

  search() {
    this.page = 1;
    var tabindex = $('ul.nav-tabs li.active a').attr('target').replace("#tab_", "").trim();
    var numIndex = parseInt(tabindex);
    var subInstrumentType = this.instrumentSubForums[numIndex];
    if (this.searchString != "") {
      if (numIndex == 0) {// 第一个变迁
        this.httpService.postForumsByType(this.instrumentType, this.page.toString(), this.searchString).then(resp => {
          this.forumlist = resp.results as ForumInfo[];
        })
      } else {
        this.httpService.postForumsByTypeAndSub(this.instrumentType, this.instrumentSubForums[numIndex], this.page.toString(), this.searchString).then(resp => {
          this.forumlist = resp.results as ForumInfo[];
        });
      }
    } else {
      if (numIndex == 0) {// 第一个变迁
        this.httpService.getForumsByType(this.instrumentType, this.page.toString()).then(resp => {
          this.forumlist = resp.results as ForumInfo[];
        })
      } else {
        this.httpService.getForumsByTypeAndSub(this.instrumentType, this.instrumentSubForums[numIndex], this.page.toString()).then(resp => {
          this.forumlist = resp.results as ForumInfo[];
        });
      }
    }
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    var win = $(window);
    var self = this;
    var tabcontant = $(".tab-content");
    // Each time the user scrolls
    win.scroll(function () {
      if (self.loadingable == true && self.isloading == false) {
        if ($(window).scrollTop() + $(window).height() >= tabcontant.height() + tabcontant.offset().top) {
          self.isloading = true;
          self.page = self.page + 1;
          if ($('ul.nav-tabs li.active a').attr('target')) {
            var tabindex = $('ul.nav-tabs li.active a').attr('target').replace("#tab_", "").trim();
            var numIndex = parseInt(tabindex);
            var subInstrumentType = self.instrumentSubForums[numIndex];
            if (self.searchString == "") {
              if (numIndex == 0) {
                self.httpService.getForumsByType(self.instrumentType, self.page.toString()).then(resp => {
                  if (resp.results.length == 0) {
                    self.loadingable = false;
                  } else {
                    self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
                  }
                  self.page = parseInt(resp.page);
                  self.isloading = false;
                })
              } else {
                self.httpService.getForumsByTypeAndSub(self.instrumentType, subInstrumentType, self.page.toString()).then(resp => {

                  if (resp.results.length == 0) {
                    self.loadingable = false;
                  }
                  else {
                    self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
                  }
                  self.page = parseInt(resp.page);
                  self.isloading = false;
                })
              }
            } else {
              if (numIndex == 0) {
                self.httpService.postForumsByType(self.instrumentType, self.page.toString(), self.searchString).then(resp => {
                  if (resp.results.length == 0) {
                    self.loadingable = false;
                  } else {
                    self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
                  }
                  self.page = parseInt(resp.page);
                  self.isloading = false;
                })
              } else {
                self.httpService.postForumsByTypeAndSub(self.instrumentType, subInstrumentType, self.page.toString(), self.searchString).then(resp => {
                  if (resp.results.length == 0) {
                    self.loadingable = false;
                  }
                  else {
                    self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
                  }
                  self.page = parseInt(resp.page);
                  self.isloading = false;
                })
              }
            }
          }
        }
      }
    });
    //  论坛tab标签切换
    $('#forumTab a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');

      var tabindex = $('ul.nav-tabs li.active a').attr('target').replace("#tab_", "").trim();
      var numIndex = parseInt(tabindex);
      var subInstrumentType = self.instrumentSubForums[numIndex];
      self.forumlist = []; // 初始化论坛数据
      self.page = 1;
      self.loadingable = true; // 可以加载
      self.isloading = true; // 修改loading 标志
      if (numIndex == 0) {
        self.httpService.getForumsByType(self.instrumentType, self.page.toString()).then(resp => {
          console.log(resp);
          if (resp.results.length == 0) {
            self.loadingable = false;
          } else {
            self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
          }
          self.page = parseInt(resp.page);
          self.isloading = false;
        });
        // 
        self.httpService.getTagByType(self.instrumentType).then(resp=>{
          if (resp.success) {
            self.taglist = resp.results;
          }
        })
      } else {
        self.httpService.getForumsByTypeAndSub(self.instrumentType, subInstrumentType, self.page.toString()).then(resp => {
          console.log(resp);
          if (resp.results.length == 0) {
            self.loadingable = false;
          }
          else {
            self.forumlist = self.forumlist.concat(resp.results as ForumInfo[]);
          }
          self.page = parseInt(resp.page);
          self.isloading = false;
        });
        // 
        self.httpService.getTagByTypeAndSub(self.instrumentType,subInstrumentType).then(resp=>{
          if (resp.success) {
            self.taglist = resp.results;
          }
        })
      }

    });
  }
  // 发布帖子
  issue() {
    console.log(this.key);
    console.log(this.contantService.getInstrumentType(this.key));
    var tabindex = $('ul.nav-tabs li.active a').attr('target').replace("#tab_", "").trim();
    var numIndex = parseInt(tabindex);
    var subInstrumentType = this.instrumentSubForums[numIndex];
    if (subInstrumentType != "全部" && subInstrumentType != "其他") {
      this.router.navigate(['/home/home/issue', this.contantService.getInstrumentType(this.key), subInstrumentType])
    } else {
      this.router.navigate(['/home/home/issue', this.contantService.getInstrumentType(this.key)])
    }

  }
  adsClick(ads: Ads) {
    console.log(ads);
    if (ads.type == "url") {
      window.open(ads.value, '_blank');
    }
    if (ads.type == "news") {
      this.router.navigate(['/home/home/newcontent/' + ads.value]);
    }
    if (ads.type == "product") {
      this.router.navigate(['/home/home/product/' + ads.value]);
    }
  }
}
