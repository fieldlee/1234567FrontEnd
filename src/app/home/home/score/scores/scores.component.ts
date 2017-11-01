import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Score } from '../../../../class/score';
import { Ads } from '../../../../class/ads';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  providers: [HttpService, LoadJQService, ContantService]
})
export class ScoresComponent implements OnInit {
  scoreslist: Score[];
  hotscorelist: Score[];

  scoreid: string;

  region: string = "";
  style: string = "";
  lvl: string = "";

  loadingText: string = "加载中...";
  loadingable: boolean = true;
  isloading: boolean = false;

  page: Number = 1;
  adslist: Ads[] = [];
  searchString = "";

  instruments = ["钢琴", "萨克斯", "小提琴", "吉他", "中提琴", "大提琴", "架子鼓"];
  instrumenticons = ["Piano", "Sax", "Violin", "Guitar", "Viola", "Cello", "Drum"];

  taglist: string[] = [];
  instrumentName = "钢琴";
  constructor(private router: Router,
    private contantService: ContantService,
    private loadJq: LoadJQService,
    private httpService: HttpService,
    private route: ActivatedRoute) {
    this.scoreslist = [];
  }

  ngOnInit() {
    this.httpService.getScoresByType(this.instrumentName, this.page.toString()).then(resp => {
      if (resp.success) {
        this.scoreslist = resp.results as Score[];
      }
    })

    this.httpService.getAds().then(resp => {
      this.adslist = resp;
    });

    this.httpService.getHotScores(this.instrumentName).then(resp => {
      if (resp.success) {
        this.hotscorelist = resp.results as Score[];
      }
    });
    // hotscorelist
    // this.httpService.getTagByType(this.instrumentName).then(resp=>{
    //   if (resp.success) {
    //     this.taglist = resp.results ;
    //   }
    // })
  }

  changeSelListener($event) {
    const filter = { "lvl": this.lvl, "region": this.region, "style": this.style };
    this.httpService.getScoresByTypeAndFilter(this.instrumentName, filter).then(resp => {
      if (resp.success) {
        // this.loadingable = false;
        this.scoreslist = resp.results as Score[];
        // this.isloading = false;
      }
    });
  }

  clearSel() {
    this.lvl = "";
    this.region = "";
    this.style = "";
    this.httpService.getScoresByType(this.instrumentName, this.page.toString()).then(resp => {
      if (resp.success) {
        // this.loadingable = false;
        this.scoreslist = resp.results as Score[];
        // this.isloading = false;
      }
    })
  }
  changeListener($event) {
    if (this.searchString == "") {
      this.search();
    }
  }

  keypress(event) {
    if (event.keyCode == "13") {
      this.search();
    }
  }

  check(tag) {
    if (this.searchString == tag) {
      this.searchString = "";
    } else {
      this.searchString = tag;
    }
    this.search();
  }

  search() {
    this.page = 1;
    if (this.searchString != "") {
      this.httpService.getScoresByTypeAndKey(this.instrumentName, this.searchString).then(resp => {
        if (resp.success) {
          // this.loadingable = false;
          this.scoreslist = resp.results as Score[];
          // this.isloading = false;
        }
      })
    } else {
      this.httpService.getScoresByType(this.instrumentName, this.page.toString()).then(resp => {
        if (resp.success) {
          this.scoreslist = resp.results as Score[];
        }
      })
    }
  }
  changeTab(index) {
    console.log("index:" + index);
    this.instrumentName = this.instruments[index];

    this.scoreslist = []; // 初始化论坛数据
    this.page = 1;
    this.loadingable = true; // 可以加载
    this.isloading = true; // 修改loading 标志

    this.httpService.getScoresByType(this.instrumentName, this.page.toString()).then(resp => {
      if (resp.success) {
        if (resp.results.length == 0) {
          this.loadingable = false;
        } else {
          this.scoreslist = this.scoreslist.concat(resp.results as Score[]);
        }
        this.page = parseInt(resp.page);
        this.isloading = false;
      }
    });
    //获取最热的曲谱
    this.httpService.getHotScores(this.instrumentName).then(resp => {
      if (resp.success) {
        this.hotscorelist = resp.results as Score[];
      }
    });
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
          self.page = parseInt(self.page.toString()) + 1;
          if ($('ul.nav-tabs li.active a').attr('target')) {
            var tabindex = $('ul.nav-tabs li.active a').attr('target').replace("#tab_", "").trim();
            var numIndex = parseInt(tabindex);
            self.instrumentName = self.instruments[numIndex];
            if (self.searchString == "") {
              self.httpService.getScoresByType(self.instrumentName, self.page.toString()).then(resp => {
                if (resp.success) {
                  if (resp.results.length == 0) {
                    self.loadingable = false;
                  } else {
                    self.scoreslist = self.scoreslist.concat(resp.results as Score[]);
                  }
                  self.page = parseInt(resp.page);
                  self.isloading = false;
                }
              })
            } else {
              self.httpService.getScoresByTypeAndKey(self.instrumentName, self.searchString).then(resp => {
                if (resp.success) {
                  self.loadingable = false;
                  self.scoreslist = resp.results as Score[];
                  self.isloading = false;
                }
              })
            }
          }
        }
      }
    });
  }
}
