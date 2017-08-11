import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { Class } from '../../../../class/class';
import { LiveService } from '../live.service';
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers:[HttpService,LiveService]
})
export class ClassComponent implements OnInit {
  classlist:Class[]=[];
  constructor(private route:ActivatedRoute,
    private router:Router,
    private contantService:ContantService,
    private liveService:LiveService,
    private httpService:HttpService) { }

  ngOnInit() {
    this.httpService.getClass().then(resp=>{
      if(resp.results.length>0){
        this.classlist = resp.results as Class[];
        for(var i =0;i<this.classlist.length;i++){
          this.classlist[i].start = this.liveService.formatDate(new Date(this.classlist[i].start));
          this.classlist[i].end = this.liveService.formatDate(new Date(this.classlist[i].end));
        }
      }
    });
  }

  issue(){
    this.router.navigate(['/home/home/live/classauth'])
  }
}
