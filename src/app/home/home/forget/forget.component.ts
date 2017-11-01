import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../http.service';
@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css'],
  providers:[HttpService]
})
export class ForgetComponent implements OnInit {
  username:string;
  type:string;
  isErr:boolean;
  isSuccuess:boolean;
  message:string;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private httpService:HttpService
  ) { 
      this.isErr = false;
      this.isSuccuess = false;
    }

  ngOnInit() {

  }
  send(){
    this.isErr = false;
    this.isSuccuess = false;
    if(this.username==undefined || this.username==""){
      this.isErr = true;
      this.message = "请输入手机号码";
      return
    }
    this.httpService.forget({"username":this.username}).then(resp=>{
        if(resp["success"]){
          this.isSuccuess = true;
          this.message = resp["message"];
        }else{
          this.isErr = true;
          this.message = resp["message"];
        }
    });
  }

  reLogin(){
    this.router.navigate(['/login']);
  }
}
