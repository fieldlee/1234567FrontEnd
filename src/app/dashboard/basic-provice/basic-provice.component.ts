import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../http.service';
@Component({
  selector: 'app-basic-provice',
  templateUrl: './basic-provice.component.html',
  styleUrls: ['./basic-provice.component.css'],
  providers:[HttpService]
})
export class BasicProviceComponent implements OnInit {
  provinces : Array<String> ;
  constructor(private httpService:HttpService) { 
    this.provinces = ["北京市","广东省","山东省","江苏省","河南省","上海市","河北省","浙江省","香港特别行政区","陕西省","湖南省","重庆市","福建省","天津市","云南省","四川省","广西壮族自治区","安徽省","海南省","江西省","湖北省","山西省","辽宁省","台湾省","黑龙江","内蒙古自治区","澳门特别行政区","贵州省","甘肃省","青海省","新疆维吾尔自治区","西藏区","吉林省","宁夏回族自治区"];
  }

  ngOnInit() {
    
  }

  submit(){
    const provinceBody = {"provinces":this.provinces};
    this.httpService.createProvince(provinceBody);
  }
}
