import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { Class } from '../../../../class/class';
import { Show } from '../../../../class/show';
import { LiveService } from '../live.service';
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
  constructor(private route:ActivatedRoute,
    private router:Router,
    private contantService:ContantService,
    private liveService:LiveService,
    private httpService:HttpService) { }

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
          if(this.classlist[i].status=="progress"||this.classlist[i].status=="waiting"){
            if(this.classlist[i].status=="progress"){
              this.classlist[i].status = "开课中";
            }
            if(this.classlist[i].status=="waiting"){
              this.classlist[i].status = "待开课";
            }
            this.classlisting.push(this.classlist[i]);
          }else{
            if(this.classlist[i].status=="end"){
              this.classlist[i].status = "课程完成";
            }
            if(this.classlist[i].status=="close"){
              this.classlist[i].status = "课程关闭";
            }
            this.classlistover.push(this.classlist[i]);
          }
          // 我参加的课程
          this.classmyjoin = this.classlisting.filter(function(item){
            for(var j=0;j<item.joins.length;j++){
              if (item.joins[j].joinUsername == window.localStorage.getItem("username")){
                return item;
              }
            }
          })
        }
      }
    });
  }

  openlive(show:Show){
    if(show.author == window.localStorage.getItem("username")){
      this.router.navigate(['/home/home/live/live/show/'+show._id])
    }else{
      this.router.navigate(['/home/home/live/receive/'+show._id]);
    }
  }

  issue(){
    this.router.navigate(['/home/home/live/classauth'])
  }
}
