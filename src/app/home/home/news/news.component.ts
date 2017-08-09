import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ContantService } from '../../../contant.service';
import { Router, ActivatedRoute } from '@angular/router';
import {News} from '../../../class/news';
import {Ads} from '../../../class/ads';
declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [HttpService, LoadJQService]
})
export class NewsComponent implements OnInit {
  newslist:News[];
  page:Number = 1;
  loadingable:boolean = true;
  isloading:boolean = false;
  adslist:Ads[]=[];
  constructor(private httpService: HttpService,
    private contantService:ContantService, 
    private loadJqService: LoadJQService,
    private route: ActivatedRoute,
    private router: Router) { }
   
  ngOnInit() {
    this.httpService.getNews(this.page.toString()).then(resp=>{
        this.newslist = resp;
    });
      
    this.httpService.getAds().then(resp=>{
      this.adslist = resp;
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    var win = $(window);
    const self = this;
    var tabcontant = $("#newsPanel");
    // Each time the user scrolls
    win.scroll(function() {
        if (self.loadingable==true && self.isloading==false){
          if ($(window).scrollTop() + $(window).height() >= tabcontant.height()+tabcontant.offset().top) {
            self.isloading = true;
            self.page = Number(self.page.toString()) + 1;
            self.httpService.getNews(self.page.toString()).then(resp=>{
              console.log(resp);
              if(resp.length>0){
                self.newslist = self.newslist.concat(resp);
              }
              else{
                self.loadingable=false;
              }
              
              self.isloading = false;
            });
          }
        }
    });
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
