import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import {ForumsComponent} from './forums/forums.component';
import {ContantService} from '../../contant.service';
import {HttpService} from '../../http.service';
declare var BootstrapDialog: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[ContantService,HttpService]
})
export class HomeComponent implements OnInit {
  key:string;
  avatorName: string;
  isAnymouse: boolean;
  menuKey : string="";
  avatorPath:string = "";
  percent : string = "";
  username :string="";
  lvlpercent :string="";
  curlvl :string="";
  tolvl:string="";
  newsNumber:string = "";
  constructor(
    private ref: ChangeDetectorRef,
    private route :ActivatedRoute,
    private router:Router,
    private httpService:HttpService,
    private contantService:ContantService
  ) {
    this.avatorName = window.localStorage.getItem("avator");

    this.isAnymouse = false;
    if (window.localStorage.getItem("x-access-token")) {
      this.isAnymouse = true;
    }

  }

  ngOnInit() {
    this.contantService.homeComponent = this;
    if(window.localStorage.getItem("avatorPath")){
      this.avatorPath = window.localStorage.getItem("avatorPath");
    }
    this.curlvl = window.localStorage.getItem("lvl");
    if(this.curlvl==""|| this.curlvl==undefined){
      this.curlvl="普通会员";
    }
    if(this.curlvl=="普通会员"){
      this.tolvl = "银会员";
    }else if (this.curlvl == "银会员"){
      this.tolvl = "金会员";
    }else if(this.curlvl == "金会员"){
      this.tolvl = "钻石会员";
    }
    this.lvlpercent = window.localStorage.getItem("lvlpercent");
    if(this.lvlpercent==""|| this.lvlpercent==undefined){
      this.lvlpercent="5";
    }
    this.percent = window.localStorage.getItem("percent");
    this.username = window.localStorage.getItem("username");

    this.httpService.getNewsNumber().then(resp=>{
      console.log(resp);
        if(resp.success){
          this.newsNumber = resp.count+"";
        }
    });
  }

  keypress(event){
    if(event.keyCode == "13"){
     this.search();         
    }
  }

  search(){
    this.router.navigate(['/home/home/search/'+this.key]);
  }

  logout() {
    const self = this;
    BootstrapDialog.confirm({
      title: '确认',
      message: '确定要退出登录吗?',
      type: BootstrapDialog.TYPE_INFO, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
      closable: true, // <-- Default value is false
      draggable: true, // <-- Default value is false
      btnCancelLabel: '取消', // <-- Default value is 'Cancel',
      btnOKLabel: '确定', // <-- Default value is 'OK',
      btnOKClass: 'btn-info', // <-- If you didn't specify it, dialog type will be used,
      callback: function (result) {
        // result will be true if button was click, while it will be false if users close the dialog directly.
        if (result) {
          window.localStorage.clear();
          self.isAnymouse = false;
          self.avatorName = "";
        }
      }
    });
  }
}
