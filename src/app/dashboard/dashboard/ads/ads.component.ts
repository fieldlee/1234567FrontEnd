import { Component, OnInit } from '@angular/core';
import { Ads } from '../../../class/ads';
import { Http, Headers, Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
declare var BootstrapDialog: any;
@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css'],
  providers: [HttpService, LoadJQService]
})
export class AdsComponent implements OnInit {
  editAds: Ads;
  headers: Headers;
  url: string;
  adsList: Ads[];
  constructor(private http: Http, private httpService: HttpService, private loadJq: LoadJQService) {
    this.editAds = new Ads();
  }

  ngOnInit() {
    this.httpService.getAds().then(adslist => {
      this.adsList = adslist;
      // 重构dataTable
      const self = this;
      this.loadJq.reloadJQ(function (startDate, endDate) {
        self.editAds.startTime = startDate;
        self.editAds.endTime = endDate;
      });
    });
  }

  ngAfterViewInit() {

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
        _this.editAds.path = respJson["path"];
        _this.editAds.imagename = respJson["originName"];
      }
    });

  }
  update(ads: Ads) {
    this.editAds = ads;
    $('#dateValid').daterangepicker({ startDate: this.editAds.startTime, endDate: this.editAds.endTime });
  }

  delete(ads: Ads) {
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要删除该信息吗?',
      type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '删除', // <-- Default value is 'OK',
      btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          self.httpService.deleteAds(ads).then(resp => {
            self.editAds = new Ads();
            self.httpService.getAds().then(adslist => {
              self.adsList = adslist;
            });
          });
        }
      }
    });
  }

  cancle(): void {
    this.editAds = new Ads();
  }

  submit(): void {

    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要提交该信息吗?',
      type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '提交', // <-- Default value is 'OK',
      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          if (self.editAds.startTime) {
            self.httpService.createAds(self.editAds).then(response => {
              self.editAds = new Ads();
              self.httpService.getAds().then(adslist => {
                self.adsList = adslist;
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
