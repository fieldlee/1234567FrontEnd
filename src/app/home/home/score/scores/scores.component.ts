import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Score } from '../../../../class/score';
import { Location} from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRoute ,Router} from '@angular/router';
@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  providers: [HttpService, LoadJQService,ContantService]
})
export class ScoresComponent implements OnInit {
  scoreslist:Score[];
  scoreid:string;
  page:Number = 1;
  constructor(private router:Router,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private httpService:HttpService,
    private route: ActivatedRoute) {
      this.scoreslist = [];
     }

  ngOnInit() {
    this.httpService.getScores(this.page.toString()).then(resp=>{
      if(resp.success){
        this.scoreslist = resp.results as Score[];
      }
    })
  }
}
