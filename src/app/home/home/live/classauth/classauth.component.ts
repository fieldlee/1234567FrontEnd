import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
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
    providers: [HttpService, LoadJQService,ContantService]
})
export class ClassauthComponent implements OnInit {
  class:Class;
  constructor(private httpService: HttpService,
    private router:Router,
    private _location:Location,
    private contantService:ContantService,
    private loadJq: LoadJQService,
    private route: ActivatedRoute) { 
      this.class = new Class();
    }

  ngOnInit() {

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

  submit(){
    
    
    this.class.start = new Date($('input[name="classStartDate"]').data('daterangepicker').startDate.format('YYYY-MM-DD'));
    this.class.end = new Date($('input[name="classEndDate"]').data('daterangepicker').startDate.format('YYYY-MM-DD'));
    this.class.content =  $("#classContent").froalaEditor('html.get', true);
    console.log(this.class);
    
  }
}
