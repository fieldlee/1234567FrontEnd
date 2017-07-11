import { Component, OnInit } from '@angular/core';
import { ForumAction } from '../../../class/forum-action';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
declare var BootstrapDialog: any;

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
    this.loadJqService.reloadJQ(function (startDate, endDate) {
      this.action.startTime = startDate;
      this.action.endTime = endDate;
    });
    this.httpService.getActions().then(response => {
      this.actions = response
    });
  }

  //onChange file listener
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

    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要提交该信息吗?',
      type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '提交', // <-- Default value is 'OK',
      btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          if (self.action.startTime) {
            self.httpService.createAction(self.action).then(response => {
              self.action = new ForumAction();
              self.httpService.getActions().then(response => {
                self.actions = response
              });
            });
          } else {
            alert("请选择日期范围");
            return
          }
        }
      }
    });

  }

}
