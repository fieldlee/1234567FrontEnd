import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ForumInfo } from '../../../class/forum-info';
import { Product } from '../../../class/product';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  key:string;
  products:Product[]=[];
  countProduct:Number = 0;
  formus:ForumInfo[]=[];
  countForum :Number = 0;
  constructor(private route:ActivatedRoute,
    private router:Router,
    private httpService:HttpService) { }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.key = params["key"];
        if(this.key != undefined){
            this.search();
        }
    }) 
  }

  keypress(event){
    if(event.keyCode == "13"){
     this.search();         
    }
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }
  search(){
    this.formus = [];
    this.countForum = 0;
    this.products = [];
    this.countProduct = 0 ;
    const json = {"key":this.key};
    // console.log(json);
    this.httpService.search(json).then(resp=>{
      // console.log(resp);
      if(resp.success){
        console.log(resp);
        this.formus = resp.forums as ForumInfo[];
        this.countForum = resp.forumCount;
        this.products = resp.products as Product[];
        this.countProduct = resp.productCount ;
      }
      // resultJson["forums"] = results.two;
      //               resultJson["forumCount"] = results.two.length;
      //               resultJson["products"] = results.one;
      //               resultJson["productCount"] = results.one.length;
    });
  }
}
