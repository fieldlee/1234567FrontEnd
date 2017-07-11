import { Component, OnInit } from '@angular/core';
import { Ads } from '../../../class/ads';
import { Http, Headers, Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;

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
      console.log(this.adsList);
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;
    this.loadJq.reloadJQ(function (startDate, endDate) {
      self.editAds.startTime = startDate;
      self.editAds.endTime = endDate;
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
        _this.editAds.path = respJson["path"];
        _this.editAds.imagename = respJson["originName"];
        console.log(_this.editAds);
      }
    });

  }
  update(ads: Ads) {
    this.editAds = ads;
    $('#dateValid').dateRangePicker('setDate', this.editAds.startTime);

  }


  cancle(): void {
    this.editAds = new Ads();
    console.log($('#adsListTable'));
  }

  submit(): void {
    // console.log(this.editAds);
    // console.log(new Date($('#dateValid').data('daterangepicker').startDate._i));
    // console.log(new Date($('#dateValid').data('daterangepicker').endDate._i));
    if (this.editAds.startTime) {
      // this.editAds.startTime = new Date($('#dateValid').data('daterangepicker').startDate._i);
      // this.editAds.endTime = new Date($('#dateValid').data('daterangepicker').endDate._i);
      this.httpService.createAds(this.editAds).then(response => {
        console.log(response);
        this.editAds = new Ads();
        this.httpService.getAds().then(adslist => {
          this.adsList = adslist;
          console.log(this.adsList);
        });
      });
    } else {
      alert("请选择日期范围");
      return
    }
  }
}
