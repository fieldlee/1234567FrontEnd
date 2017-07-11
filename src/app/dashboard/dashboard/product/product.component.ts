import { Component, OnInit } from '@angular/core';
import { Product } from '../../../class/product';
import { Brand } from '../../../class/brand';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;
declare var BootstrapDialog: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [HttpService, LoadJQService]
})
export class ProductComponent implements OnInit {
  product: Product;
  products: Product[];
  brands: Brand[];
  types: Array<string>;
  subtypes: Array<any>;
  configlist: Array<string>;
  configvalues: Array<string>;
  uploadFileName: string;
  constructor(private httpService: HttpService, private loadJq: LoadJQService) {
    this.product = new Product();
  }

  ngOnInit() {

    this.httpService.getProducts().then(resp => {
      console.log(resp);
      this.products = resp;
      //    重构dataTable
      this.loadJq.reloadJQ(null);
    });
    this.httpService.getBrands().then(resp => {
      this.brands = resp;
    })
    //  读取分类

    this.httpService.getType().then(response => {
      console.log(response.results);
      this.types = new Array();
      response.results.forEach(element => {
        this.types.push(element.type);
      });
    });
  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  brandListener() {

  }

  typeListener() {
    this.httpService.getSubType(this.product.type).then(
      resp => {
        this.subtypes = new Array();
        resp.results.forEach(element => {
          this.subtypes.push(element);
        });
      })
  }

  selectType(t: string) {
    this.product.type = t;
    this.httpService.getSubType(this.product.type).then(
      resp => {
        this.subtypes = new Array();
        resp.results.forEach(element => {
          this.subtypes.push(element);
        });
      })
  }

  // 子分类选择后处理
  subtypeListener() {
    for (var sub in this.subtypes) {
      if (this.subtypes[sub]["subType"] == this.product.subType) {
        this.configlist = this.subtypes[sub]["configs"];
        this.configvalues = new Array(this.configlist.length);
      }
    }
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
        self.product.images.push(respJson["path"]);
        self.uploadFileName = "";
      }
    });
  }

  deleteImage(imagepath: string) {
    // var tempPath = imagepath.substring(imagepath.lastIndexOf("/") + 1);
    // alert(tempPath);
    var postImagePath = { "imagepath": imagepath };
    this.httpService.deleteImage(postImagePath).then(resp => {
      console.log(resp);
      if (resp["success"]) {
        this.product.images = this.product.images.filter(function (element) {
          return element != imagepath
        });
        console.log(this.product.images);

      }
    });
    return false;
  }

  cancle(): void {
    this.product = new Product();
    this.configlist = new Array();
    this.configvalues = new Array();
  }

  update(brand: Product) {
    this.product = brand;
    console.log(this.product.subType);
    // 获得子分类信息
    this.httpService.getSubType(this.product.type).then(
      resp => {
        this.subtypes = new Array();
        resp.results.forEach(element => {
          this.subtypes.push(element);
        });
        //    更新信息
        var obj = this.product["config"];
        console.log(obj);
        this.configlist = new Array();
        this.configvalues = new Array();
        for (var k in obj) {
          this.configlist.push(k);
          this.configvalues.push(obj[k])
        }
      })
  }

  delete(pro: Product) {
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
          self.httpService.deleteProduct(pro).then(resp => {
            self.httpService.getProducts().then(resp => {
              console.log(resp);
              self.products = resp;
            });
          });
        }
      }
    });
  }

  submit(): void {

    var configObj = {};
    for (var i in this.configlist) {
      configObj[this.configlist[i]] = this.configvalues[i];
    }
    this.product.config = configObj;
    //  提交提示
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
          if (self.product.name == undefined) {
            alert("请输入产品名称");
            return
          }
          // config 设置
          self.httpService.createProduct(self.product).then(resp => {
            console.log(resp);
            self.product = new Product();
            self.configlist = new Array();
            self.httpService.getProducts().then(resp => {
              console.log(resp);
              self.products = resp;
            });
          });
        }
      }
    });
  }
}
