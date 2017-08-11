import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { LiveService } from '../live.service';
import { ContantService } from '../../../../contant.service';
import { LoadJQService } from '../../../../load-jq.service';
import { Class } from '../../../../class/class';
import { Location} from '@angular/common';
import { Routes, RouterModule, ActivatedRoute ,Router} from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-classauth',
  templateUrl: './classauth.component.html',
  styleUrls: ['./classauth.component.css'],
  providers: [HttpService, LoadJQService,ContantService,LiveService]
})
export class ClassauthComponent implements OnInit {
  class:Class;
  classid:string;
  isself:boolean = false;
  joinTel:string;
  joinVerifyCode : string;
  joinPayStatus:boolean = false;
  constructor(private httpService: HttpService,
    private router:Router,
    private _location:Location,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private liveService: LiveService,
    private route: ActivatedRoute) { 
      this.class = new Class();
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.classid = params["id"];
      if (this.classid != undefined) {
        
        this.httpService.getClassById(this.classid).then(resp=>{
          this.class = resp.data as Class;
          this.class.start = this.liveService.formatDate(new Date(this.class.start));
          this.class.end = this.liveService.formatDate(new Date(this.class.end));

    
          if(this.class.author == window.localStorage.getItem("username")){
            this.isself = true;
            $("#classContent").froalaEditor('html.set', this.class.content);
            if(this.class.record == true){
              $('input[name="switchrecord"]').prop('checked',true);
              }else{
              $('input[name="switchrecord"]').prop('checked',false);
            }
            // console.log($('input[name="classStartDate"]'));
            // console.log($('input[name="classStartDate"]').data('daterangepicker'));
            // $('input[name="classStartDate"]').data('daterangepicker').setStartDate(this.class.start);
            // $('input[name="classStartDate"]').data('daterangepicker').setEndDate(this.class.start);
            // $('input[name="classEndDate"]').data('daterangepicker').setStartDate(this.class.end);
            // $('input[name="classEndDate"]').data('daterangepicker').setEndDate(this.class.end);
            // $('input[name="classStartDate"]').daterangepicker({ startDate: this.class.start, endDate: this.class.start });
          }
        });
      }else{
        this.class = new Class();
        this.isself = true;
      }
    });
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;
    this.loadJq.reloadJQ(null);
    this.loadJq.froalaEditor("classContent", function (imageurl: string) {
      if (self.class.images == undefined) {
        self.class.images = new Array<string>();
      }
      self.class.images.push(imageurl);
    }, function (imageurl: string) {
      if (self.class.images != undefined) {
        self.class.images = self.class.images.filter(function (item) {
          return item != imageurl
        })
      }
    }, null, null);

  }
  addSchedule(){
    var dateTime;
    var free;
    if($('input[name="classdate"]').data('daterangepicker').startDate.format('YYYY-MM-DD hh:mm')){
      dateTime = $('input[name="classdate"]').data('daterangepicker').startDate.format('YYYY-MM-DD hh:mm');
    }
    if($('input[name="free"]').prop('checked')){
      free = "试听";
    }else{
      free = "收费";
    }
    this.class.schedules.push({"dateTime":dateTime,"free":free});
    $('input[name="classdate"]').val('');
  }

  schedule(){
    $('#commentbymodal').appendTo("body").modal('show');
  }

  joinclick(){
    $('#joinbymodal').appendTo("body").modal('show');
  }

  deleteSchedule(dateTime:string){
    this.class.schedules = this.class.schedules.filter(function(item){
      return item.dateTime != dateTime;
    })
  }

  submit(){
    if($('input[name="switchrecord"]').prop('checked')){
      this.class.record = true
    }else{
      this.class.record = false;
    }
    this.class.author = window.localStorage.getItem("username");
    this.class.start = new Date($('input[name="classStartDate"]').data('daterangepicker').startDate.format('YYYY-MM-DD'));
    this.class.end = new Date($('input[name="classEndDate"]').data('daterangepicker').startDate.format('YYYY-MM-DD'));
    this.class.content =  $("#classContent").froalaEditor('html.get', true);

    this.httpService.createClass(this.class).then(resp=>{

      this.class = resp.data as Class;
    })
  }

  joinclass(){
    const joinBody = { "classid":this.class._id,"joinTel":this.joinTel,"joinUsername":window.localStorage.getItem("username"),"joinPayStatus":this.joinPayStatus};
    this.httpService.joinClass(joinBody).then(resp=>{
      if(resp.success){
        this.httpService.getClassById(this.class._id).then(resp=>{
          if(resp.success){
            this.class = resp.data as Class;
          }
        })
      }
    });
  }
}
