import { Component, OnInit} from '@angular/core';
import { HttpService } from '../../../http.service';
import { ContantService } from '../../../contant.service';
import { LoadJQService } from '../../../load-jq.service';
import { ForumInfo } from '../../../class/forum-info';
import { Location} from '@angular/common';
import { Routes, RouterModule, ActivatedRoute ,Router} from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
  providers: [HttpService, LoadJQService,ContantService]
})
export class IssueComponent implements OnInit {
  productid:string;
  id:string;
  type: string;
  subType: string;
  types: string[];
  subTypes: string[];
  showType: boolean;
  showSubType: boolean;
  forum: ForumInfo;
  titleErr:boolean = false;
  constructor(private httpService: HttpService,
    private router:Router,
    private _location:Location,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private route: ActivatedRoute) {
    this.showType = false;
    this.showSubType = true;
    this.forum = new ForumInfo();
    this.forum.issueTime = new Date();
    this.forum.author = window.localStorage.getItem("username");

  }
  checkTitle(){
    if(this.forum.title !== ""){
      this.titleErr = false;
    }else{
      this.titleErr=true;
    }
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params["id"];
      this.type = params["type"];
      this.subType = params["subtype"];
      this.productid = params["productid"];

      if(this.productid){
        this.httpService.getProductById(this.productid).then(resp=>{
            if(resp.success==false){ //如果产品没有的话
              // this.router.navigate
              this._location.back();
            }
        });
      }

      // 如果有id，读取forum
      if(this.id){
        this.httpService.getForumsById(this.id).then(resp=>{
            this.forum = resp;
            $("#forumissueContent").froalaEditor('html.set', this.forum.content);

            if (this.forum.type != undefined) {
              this.httpService.getSubType(this.forum.type).then(
                resp => {
                  this.subTypes = new Array();
                  resp.results.forEach(element => {
                    this.subTypes.push(element.subType);
                  });
                  this.subType = this.forum.subType;
                })
            }
        });
        
      }
      //  读取分类
      this.httpService.getType().then(response => {
        console.log(response.results);
        this.types = new Array();
        response.results.forEach(element => {
          console.log(element.type);
          this.types.push(element.type);
          if (this.type != undefined){
            this.forum.type = this.type;
          }
        });
      });

      if (this.type != undefined) {
        this.httpService.getSubType(this.type).then(
          resp => {
            this.subTypes = new Array();
            resp.results.forEach(element => {
              this.subTypes.push(element.subType);
              if(this.subType != undefined){
                this.forum.subType = this.subType;
              }
            });
            console.log(this.subTypes);
          })
      }
    })
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;

    this.loadJq.reloadJQ(null);
    this.loadJq.froalaEditor("forumissueContent", function (imageurl: string) {
      if (self.forum.images == undefined) {
        self.forum.images = new Array<string>();
      }
      self.forum.images.push(imageurl);
    }, function (imageurl: string) {
      if (self.forum.images != undefined) {
        self.forum.images = self.forum.images.filter(function (item) {
          return item != imageurl
        })
      }
    }, function (videoUrl: string) {
      console.log(videoUrl);
      var videoArr = new Array<string>();
      for (var tvideourl in self.forum.videos) {
        videoArr.push(tvideourl);
      }
      videoArr.push(videoUrl);
      self.forum.videos = videoArr;
    }, function (videoUrl: string) {
      self.forum.videos = self.forum.videos.filter(function (item) {
        return item != videoUrl
      })
    });
  }

  goBack(){
    var tmpType = this.contantService.getType(this.type);
    this._location.back();
    // this.router.navigate(['/home/home/forum',tmpType]);
  }
  
  typeListener() {

    this.httpService.getSubType(this.forum.type).then(
      resp => {
        this.subTypes = new Array();
        resp.results.forEach(element => {
          this.subTypes.push(element.subType);
        });
        console.log(this.subTypes);
      })
  }

  submit(){
    if(this.forum.title == undefined || this.forum.title==""){
      this.titleErr = true;
      return;
    }
    if(this.productid==""||this.productid==undefined){

    }else{
      this.forum.product = this.productid;
    }
    this.forum.tags = $("input[name=tags]").tagsinput('items');
    this.forum.content = $("#forumissueContent").froalaEditor('html.get', true);
    console.log(this.forum);
    this.httpService.createForum(this.forum).then(resp=>{
      this.forum._id = resp._id;
      $.notify("帖子已经发布！", {
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

            return;
    });
  }
}
