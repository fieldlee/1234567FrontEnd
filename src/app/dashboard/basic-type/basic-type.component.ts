import { Component, OnInit } from '@angular/core';
import {HttpService} from '../../http.service';
@Component({
  selector: 'app-basic-type',
  templateUrl: './basic-type.component.html',
  styleUrls: ['./basic-type.component.css'],
  providers:[HttpService]
})
export class BasicTypeComponent implements OnInit {
  instruments : Array<String>;
  constructor(private httpService:HttpService) { 
    this.instruments = new Array(30)
  }

  ngOnInit() {
    const _this = this;
    this.httpService.getType().then(resp=>{
        _this.instruments = new Array(30);
        var i = 0;
      resp.results.forEach(element => {
        _this.instruments[i] = element.type;
        i = i + 1;
      });
    });
  }
  changeListener($event): void {
    console.log(Number($event.target.name));
    this.instruments[Number($event.target.name)] =  $event.target.value;
  }
  submit(){
    const typeJson = {"types":this.instruments};
    this.httpService.createType(typeJson);
  }
}
