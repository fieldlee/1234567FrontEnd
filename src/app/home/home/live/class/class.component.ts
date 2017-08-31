import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { Class } from '../../../../class/class';
import { Show } from '../../../../class/show';
import { LiveService } from '../live.service';
declare var $ :any;
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers:[HttpService,LiveService]
})
export class ClassComponent implements OnInit {
  classlist:Class[]=[];
  classlisting :Class[]=[];
  classlistover :Class[]=[];
  classmyjoin :Class[]=[];

  showlist:Show[]=[];
  client : any;
  constructor(private route:ActivatedRoute,
    private router:Router,
    private contantService:ContantService,
    private liveService:LiveService,
    private httpService:HttpService) { 
      this.client = liveService.getClient();//读取客户端的client
    }

  ngOnInit() {
    this.httpService.getShow().then(resp=>{
      if(resp.success){
        this.showlist = resp.results as Show[];
      }
    });
    this.httpService.getClass().then(resp=>{
      if(resp.results.length>0){
        this.classlist = resp.results as Class[];
        
        for(var i =0;i<this.classlist.length;i++){
          this.classlist[i].start = this.liveService.formatDate(new Date(this.classlist[i].start));
          this.classlist[i].end = this.liveService.formatDate(new Date(this.classlist[i].end));
        }

        const self = this;
        this.classlisting = this.classlist.filter(function(t){
          if (t.status != self.liveService.ClassStatus.CLOSE) {
            return t;
          }
        });
        this.classlistover = this.classlist.filter(function(t) {
          if (t.status == self.liveService.ClassStatus.CLOSE) {
            return t;
          }
        });
        
        this.classmyjoin = this.classlisting.filter(function(item){
          for(var j=0;j<item.joins.length;j++){
            if (item.joins[j].joinUsername == window.localStorage.getItem("username")){
              return item;
            }
          }
        });
      }
    });
  }

  ngAfterContentInit() {
    const self = this;
    //mainLeave 主播离场通告
    this.client.getSocket().on('mainLeave', function (message) {
      console.log("mainLeave");
      //  当有人 ready 了，刷新列表
      self.httpService.getShow().then(resp=>{
        if(resp.success){
          self.showlist = resp.results as Show[];
        }
      });
    });
    this.client.getSocket().on('readyToStream', function (message) {
      //  当有人 ready 了，刷新列表
      self.httpService.getShow().then(resp=>{
        if(resp.success){
          self.showlist = resp.results as Show[];
        }
      });
    });
  }

  openlive(show:Show){
    //确认登录
    if (window.localStorage.getItem("username")=="" || window.localStorage.getItem("username") == undefined) {
      $('#loginModel').appendTo("body").modal('show');
      return;
    }
    if(show.author == window.localStorage.getItem("username")){
      this.router.navigate(['/home/home/live/live/show/'+show._id])
    }else{
      this.router.navigate(['/home/home/live/receive/show/'+show._id]);
    }
  }

  issue(){
    //确认登录
    if (window.localStorage.getItem("username")=="" || window.localStorage.getItem("username") == undefined) {
      $('#loginModel').appendTo("body").modal('show');
      return;
    }
    this.router.navigate(['/home/home/live/classauth'])
  }
}
