import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Delegate } from '../../../class/delegate';
declare var $: any;
declare var BootstrapDialog: any;
@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css'],
  providers: [HttpService, LoadJQService]
})
export class DelegateComponent implements OnInit {
  delegates:Delegate[]=[];
  delegate : Delegate;
  provinces:string[];
  citys:string[];
  districts:string[];
  constructor(private httpService: HttpService, private loadJq: LoadJQService) { }

  ngOnInit() {
    this.delegate = new Delegate();

    this.httpService.getProvinces().then(resp=>{
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
        
      });
      console.log(this.provinces);
    });

    this.httpService.getDelegates().then(resp=>{
      if(resp.success){
        this.delegates = resp.results as Delegate[];
      }
    });
  }

  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    this.loadJq.reloadJQ(null);
  }

  provinceListener(): void {
    this.httpService.getCitys(this.delegate.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city);
      });
    });
  }

  cityListener(): void {
    this.httpService.getDistricts(this.delegate.province,this.delegate.city).then(resp => {
      this.districts = new Array();
      resp.results.forEach(element => {
        this.districts.push(element.district);
      });
    });
  }

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
        self.delegate.images.push(respJson["path"]) ;
      }
    });
  }


update(brand: Delegate) {
    this.delegate = brand;
  }

  delete(delegate: Delegate) {
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要删除该琴行信息吗?',
      type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '删除', // <-- Default value is 'OK',
      btnOKClass: 'btn-warning', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          self.httpService.deleteDelegate(delegate._id).then(resp => {
            self.httpService.getDelegates().then(resp => {
              self.delegates = resp.results as Delegate[];
            });
          });
        }
      }
    });
  }

  cancle(): void {
    this.delegate = new Delegate();
   
  }

  submit(): void {
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要提交该琴行信息吗?',
      type: BootstrapDialog.TYPE_PRIMARY, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '提交', // <-- Default value is 'OK',
      btnOKClass: 'btn-primary', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          if (self.delegate.name == undefined) {
            alert("请输入琴行名称");
            return
          }
          self.httpService.createDelegate(self.delegate).then(resp=>{
              if(resp.success){
                self.delegate = resp.data as Delegate;
                self.httpService.getDelegates().then(resp=>{
                  self.delegates = resp.results as Delegate[];
                })
              }
          });
        }
      }
    });
  }
}
