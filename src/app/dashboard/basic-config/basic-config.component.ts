import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { LoadJQService } from '../../load-jq.service';
declare var $ : any;
@Component({
  selector: 'app-basic-config',
  templateUrl: './basic-config.component.html',
  styleUrls: ['./basic-config.component.css'],
  providers: [HttpService, LoadJQService]
})
export class BasicConfigComponent implements OnInit {
  type: string;
  subType:string;
  types: Array<string>;
  subTypes: Array<string>;
  subTypeObjs:Array<any>;
  configs:Array<object>;
  constructor(private httpService: HttpService, private loadJQ: LoadJQService) {
    this.types = new Array();
    
  }

  ngOnInit() {

    this.loadJQ.reloadJQ(null);

    const _this = this;
    this.httpService.getType().then(resp => {
      resp.results.forEach(element => {
          _this.types.push(element["type"]);
        });
    });

    
  }
  typeListener(): void {
    const _this = this;
    this.httpService.getSubType(this.type).then(
      resp => {
        console.log(resp);
        _this.subTypes = new Array();
        _this.subTypeObjs = new Array();
        resp.results.forEach(element => {
          _this.subTypes.push(element.subType);
          _this.subTypeObjs.push(element);
        });
      })
  }

tagListen($event){
  console.log($event.target);
}

update(sub:any){
  this.type = sub["type"];
  this.subType = sub["subType"];
  var i = 0;
  for (var con of sub["configs"]) {
    i+=1;
    console.log(con);
    // $("#tagsinputconfig").tagsinput('add',{id:i+"",name:con});
    $("#tagsinputconfig").tagsinput('add',con);
  }
}
submit(){
  this.configs = $("#tagsinputconfig").tagsinput("items");
  var configsList = {"configs":this.configs};
  console.log(configsList);
  this.httpService.createTypeConfigs(this.type,this.subType,configsList);
}

}
