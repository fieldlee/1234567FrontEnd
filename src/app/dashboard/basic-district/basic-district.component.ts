import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-basic-district',
  templateUrl: './basic-district.component.html',
  styleUrls: ['./basic-district.component.css'],
  providers:[HttpService]
})
export class BasicDistrictComponent implements OnInit {
citys:Array<String>;
city:String;
  province:String;
  provinces:Array<String>;
  districts:Array<String>;
  constructor(private httpService:HttpService) { 
    this.districts = new Array(30);
  }

  ngOnInit() {
    const _this = this;
    this.httpService.getProvinces().then(resp=>{
      console.log(resp.results);
      _this.provinces = new Array();
      resp.results.forEach(element => {
        _this.provinces.push(element.name);
      });
    });

  }
  submit(){
    if(this.province == undefined || this.province == ""){
      alert("请选择省份");
      return
    }
    if(this.city == undefined || this.city == ""){
      alert("请选择城市");
      return
    }
    const districtJson = {"districts":this.districts};
    this.httpService.createDistrict(this.province,this.city,districtJson)
  }

  changeListener($event): void {
    this.districts[Number($event.target.name)] =  $event.target.value;
  }

  provinceListener(): void {
    const _this = this;
    this.httpService.getCitys(this.province).then(resp => {
      console.log(resp);
      var i = 0;
      _this.citys = new Array(30);
      resp.results.forEach(element => {
        _this.citys[i] = element.city;
        i = i + 1;
      });
    });
  }

  cityListener(): void {
    const _this = this;
    this.httpService.getDistricts(this.province,this.city).then(resp => {
      console.log(resp);
      var i = 0;
      _this.districts = new Array(30);
      resp.results.forEach(element => {
        _this.districts[i] = element.district;
        i = i + 1;
      });
    });
  }

  setRegion(){
    this.httpService.getRegion().then(resp=>{
      
      var provinces = resp.provinces.province;
      for(var i=0;i<provinces.length;i++){
        var provinceName = provinces[i].ssqname;
        var citys = provinces[i].cities.city;
        for(var j=0;j<citys.length;j++){
          var cityName = citys[j].ssqname;
          if(cityName=="市辖区"){
            cityName = provinceName+"市";
          }
          var areas = citys[j].areas.area;
          var tdistricts = new Array();
          for(var k=0;k<areas.length;k++){
            var areaName = areas[k].ssqname;
            tdistricts.push(areaName);
            console.log(provinceName+","+cityName+","+areaName);
            
          }
          const districtJson = {"districts":tdistricts};
          this.httpService.createDistrict(provinceName,cityName,districtJson);
        }
      }
    })
  }
}
