import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
@Component({
  selector: 'app-maintain',
  templateUrl: './maintain.component.html',
  styleUrls: ['./maintain.component.css'],
  providers: [HttpService, LoadJQService]
})
export class MaintainComponent implements OnInit {
  notesurl:string="";
  lvl:string="";
  region="";
  type="";
  style="";

  videoPath="./public/uploads/tmpVideos";
  subtype = "";

  avators="";
  usernames="";

  constructor(private http: Http, private httpService: HttpService, private loadJq: LoadJQService) { }

  ngOnInit() {
  }
  get8notes(){
    const urls = this.notesurl.split(";");
    
    const noteinfo = {"noteurl":this.notesurl,"lvl":this.lvl,"region":this.region,"type":this.type,"style":this.style};
    this.httpService.getNotes(noteinfo);
  }

  create8notes(){
    this.httpService.createNotes();
  }

  createForum(){
    const noteinfo = {"videoPath":this.videoPath,"type":this.type,"subtype":this.subtype};
    this.httpService.createVideoForum(noteinfo);
  }

  changeVideoFormat(){
    const noteinfo = {"videoPath":this.videoPath};
    this.httpService.changeVideoFormat(noteinfo);
  }

  createUsername(){
    const noteinfo = {"usernames":this.usernames,"avators":this.avators};
    this.httpService.createUsers(noteinfo);
  }
}
