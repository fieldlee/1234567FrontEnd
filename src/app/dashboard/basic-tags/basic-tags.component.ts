import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../http.service';
import { LoadJQService } from '../../load-jq.service';
declare var $: any;
@Component({
  selector: 'app-basic-tags',
  templateUrl: './basic-tags.component.html',
  styleUrls: ['./basic-tags.component.css'],
  providers: [HttpService, LoadJQService]
})
export class BasicTagsComponent implements OnInit {
  type: string;
  types: Array<string>;
  configs:Array<object>;
  tags:Array<any>;
  _id:string;
  constructor(private httpService: HttpService, private loadJQ: LoadJQService) { 
    this.tags = new Array();
    this.types = new Array();
  }

  ngOnInit() {
    this.loadJQ.reloadJQ(null);

    this.httpService.getType().then(resp => {
      resp.results.forEach(element => {
        this.types.push(element["type"]);
      });
    });
    this.httpService.getTags().then(resp => {
      resp.results.forEach(element => {
        this.tags.push(element);
      });
    });
  }
  typeListener(): void {

  }

  update(tag:any){
    this._id =  tag["_id"];
    this.type = tag["type"];
    for (var t of tag["tags"]) {
      $("#tagsinputconfig").tagsinput('add',t);
    }
  }

  submit(){
  this.configs = $("#tagsinputconfig").tagsinput("items");
  var configiNFO = {"_id":this._id,"type":this.type,"tags":this.configs};
  console.log(configiNFO);
  this.httpService.createTags(configiNFO);
  this.tags = new Array();
  this.httpService.getTags().then(resp => {
      resp.results.forEach(element => {
        this.tags.push(element);
      });
    });
  }
}
