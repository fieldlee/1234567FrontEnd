import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
@Component({
  selector: 'app-basic-city',
  templateUrl: './basic-city.component.html',
  styleUrls: ['./basic-city.component.css'],
  providers : [HttpService]
})
export class BasicCityComponent implements OnInit {
  citys:Array<String>;
  province:String;
  provinces:Array<String>;
  constructor(private httpService:HttpService) { 
    this.citys = new Array(30);
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
    const cityJson = {"citys":this.citys};
    this.httpService.createCity(this.province,cityJson)
  }

  setRegion(){

    this.httpService.getRegion().then(resp=>{
      
      var provinces = resp.provinces.province;
      for(var i=0;i<provinces.length;i++){
        var provinceName = provinces[i].ssqname;
        var citys = provinces[i].cities.city;
        var citysName = new Array();
        for(var j=0;j<citys.length;j++){
          var cityName = citys[j].ssqname;
          if(cityName=="市辖区"){
            cityName = provinceName+"市";
          }
          citysName.push(cityName);
        }
        const cityJson = {"citys":citysName};
        console.log(citysName);
        this.httpService.createCity(provinceName,cityJson)
      }
    });  
  }

  changeListener($event): void {
    this.citys[Number($event.target.name)] =  $event.target.value;
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

}
