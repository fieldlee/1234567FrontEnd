import { Component, OnInit } from '@angular/core';
import { Brand } from '../../../class/brand';
import { Http, Headers, Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Image } from '../../../class/image';
declare var $: any;
declare var BootstrapDialog: any;
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers: [HttpService, LoadJQService]
})
export class BrandComponent implements OnInit {
  brand: Brand;
  brands: Brand[];
  provinces:string[];
  citys:string[];
  districts:string[];

  constructor(private httpService: HttpService, private loadJqService: LoadJQService) {
    this.brand = new Brand();
    this.brand.recommend = "0";
  }

  ngOnInit() {
    
    this.httpService.getProvinces().then(resp=>{
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });

    this.httpService.getBrands().then(resp => {
      this.brands = resp;
      // 重构dataTable
      this.loadJqService.reloadJQ(null);
    });
    
  }

   ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const self = this;
    this.loadJqService.froalaEditor("brandContent", null,null,null,null);
    
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


  provinceListener(): void {
    const _this = this;
    this.httpService.getCitys(this.brand.province).then(resp => {
      _this.citys = new Array();
      resp.results.forEach(element => {
        _this.citys.push(element.city);
      });
    });
  }

  cityListener(): void {
    const _this = this;
    this.httpService.getDistricts(this.brand.province,this.brand.city).then(resp => {
      _this.districts = new Array();
      resp.results.forEach(element => {
        _this.districts.push(element.district);
      });
    });
  }
  cancle(): void {
    this.brand = new Brand();
    $("#brandContent").froalaEditor('html.set', "");
  }

  update(brand: Brand) {
    this.brand = brand;
  }

  delete(brand: Brand) {
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
          self.httpService.deleteBrand(brand).then(resp => {
            self.httpService.getBrands().then(resp => {
              self.brands = resp;
            });
          });
        }
      }
    });
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
          if (self.brand.name == undefined) {
            alert("请输入品牌名称");
            return
          }
          self.brand.content =  $("#brandContent").froalaEditor('html.get', true);
          self.httpService.createBrand(self.brand).then(resp => {
            self.httpService.getBrands().then(resp => {
              self.brands = resp;
            });
          });
        }
      }
    });
  }
}
