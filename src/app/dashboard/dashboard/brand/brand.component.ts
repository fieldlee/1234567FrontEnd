import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../class/brand';
import { Http, Headers, Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Image } from '../../../class/image';
declare var $: any;

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers: [HttpService, LoadJQService]
})
export class BrandComponent implements OnInit {
  brand: Brand;
  brands: Brand[];
  constructor(private httpService: HttpService, private loadJqService: LoadJQService) {
    this.brand = new Brand();
    this.brand.recommend = "0";
  }

  ngOnInit() {
    this.loadJqService.reloadJQ(null);
    this.httpService.getBrands().then(resp => {
      this.brands = resp;
    });
  }
  //onChange file listener
  changeListener($event): void {

    const self = this;
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
        self.brand.icon = respJson["path"];
        self.brand.iconname = respJson["originName"];
      }
    });
  }


  cancle(): void {
    this.brand = new Brand();
  }

  update(brand: Brand) {
    this.brand = brand;
  }

  submit(): void {
    if (this.brand.name == undefined) {
      alert("请输入品牌名称");
      return
    }

    this.httpService.createBrand(this.brand).then(resp => {
      this.httpService.getBrands().then(resp => {
        this.brands = resp;
      });
    });
  }
}
