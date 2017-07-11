import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../http.service';
@Component({
  selector: 'app-basic-subtype',
  templateUrl: './basic-subtype.component.html',
  styleUrls: ['./basic-subtype.component.css'],
  providers:[HttpService]
})
export class BasicSubtypeComponent implements OnInit {
  subtypes:Array<String>;
  type:String;
  types:Array<String>;
  constructor(private httpService:HttpService) {
    this.subtypes = new Array(30);
   }

  ngOnInit() {
    const _this = this;
    this.httpService.getType().then(response => {
      console.log(response.results);
      _this.types = new Array();
      response.results.forEach(element => {
        _this.types.push(element.type);
      });
    });
  }
  changeListener($event): void {
    this.subtypes[Number($event.target.name)] =  $event.target.value;
  }

typeListener(): void {
    const _this = this;
    this.httpService.getSubType(this.type).then(
      resp => {
      console.log(resp);
      var i = 0;
      _this.subtypes = new Array(30);
      resp.results.forEach(element => {
        _this.subtypes[i] = element.subType;
        i = i + 1;
      });
      })
  }
  submit(){
    if(this.type == "" || this.type == undefined){
      alert("请选择大分类");
      return
    }
    const subtypelIST  = {"subtypes":this.subtypes};
    this.httpService.createSubType(this.type,subtypelIST);
  }
}
