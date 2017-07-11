import { Component, OnInit } from '@angular/core';
import { ForumAction } from '../../../class/forum-action';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
@Component({
  selector: 'app-forum-action',
  templateUrl: './forum-action.component.html',
  styleUrls: ['./forum-action.component.css'],
  providers: [HttpService, LoadJQService]
})
export class ForumActionComponent implements OnInit {
  action: ForumAction;
  actions: ForumAction[];
  constructor(private httpService: HttpService,
    private loadJqService: LoadJQService
  ) { this.action = new ForumAction(); }

  ngOnInit() {
    this.loadJqService.reloadJQ(function(startDate,endDate){
      this.action.startTime = startDate;
      this.action.endTime = endDate;
    });
    this.httpService.getActions().then(response=>{
      this.actions = response
    });
  }

  //onChange file listener
  changeListener($event): void {
    console.log($event.target);
    // this.postFile($event.target);
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
        _this.action.path = respJson["path"];
        _this.action.imagename = respJson["originName"];
      }
    });

  }
  update(action: ForumAction) {
    this.action = action;
  }
  cancel() {
    this.action = new ForumAction();
  }

submit(): void {
    // console.log(this.editAds);
    // console.log(new Date($('#dateValid').data('daterangepicker').startDate._i));
    // console.log(new Date($('#dateValid').data('daterangepicker').endDate._i));
    if (this.action.startTime) {
        this.httpService.createAction(this.action).then(response => {
        console.log(response);
        this.action = new ForumAction();
        this.httpService.getActions().then(response=>{
          this.actions = response
        });
      });
    } else {
      alert("请选择日期范围");
      return
    }
  }

}
