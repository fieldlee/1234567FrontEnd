import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Score } from '../../../../class/score';
import { Location} from '@angular/common';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Routes, RouterModule, ActivatedRoute ,Router} from '@angular/router';
declare var $ : any;
@Component({
  selector: 'app-scoreissue',
  templateUrl: './scoreissue.component.html',
  styleUrls: ['./scoreissue.component.css'],
  providers: [HttpService, LoadJQService,ContantService]
})
export class ScoreissueComponent implements OnInit {
  score:Score;
  scoreid:string;
  scoreTypes:string[];
  scoreDifficults:string[];
  constructor(private httpService: HttpService,
    private router:Router,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private route: ActivatedRoute) {
        this.score = new Score();
        this.scoreTypes = ["钢琴","小提琴","大提琴","单簧管"];
        this.scoreDifficults = ["难","标准","入门"];
     }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.scoreid = params["id"];
      if (this.scoreid != undefined) {

      }else{
        this.score = new Score();
      }
    });
  }
  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.loadJq.reloadJQ(null);
  }
  ngAfterViewInit() {
    
  }
  changeListener($event): void {
    const _this = this;
    $('#uploadForm').ajaxSubmit({
      error: function (xhr) {
        console.log(xhr)
      },
      success: function (response) {
        console.log(response);
        var respJson;
        if (typeof respJson == "string") {
          respJson = JSON.parse(response);
        } else {
          respJson = response;
        }
        _this.score.mp3 = {"name":respJson["originName"],"path":respJson["path"]};
      }
    });
  }
  changeListener2($event): void {
    const _this = this;
    $('#uploadForm2').ajaxSubmit({
      error: function (xhr) {
        console.log(xhr)
      },
      success: function (response) {
        console.log(response);
        var respJson;
        if (typeof respJson == "string") {
          respJson = JSON.parse(response);
        } else {
          respJson = response;
        }
        _this.score.files.push({"name":respJson["originName"],"path":respJson["path"]});
      }
    });
  }
  submit(){
    if(this.score.files && this.score.files.length>0){
      this.httpService.createScore(this.score).then(resp=>{
          if(resp.success){
            this.score = resp.data as Score;
            $.notify("已经发布了该曲谱", {
              type: "success",
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
          }
      });
    }
  }
}
