import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ContantService } from '../../../contant.service';
import { Brand } from '../../../class/brand';
import { Product } from '../../../class/product';
declare var $ : any;
@Component({
  selector: 'app-find',
  templateUrl: './find.component.html',
  styleUrls: ['./find.component.css'],
  providers:[HttpService,LoadJQService]
})
export class FindComponent implements OnInit {
  brands:object={};
  chars:string[]=[];
  constructor(private contantService:ContantService,
  private httpService:HttpService,
    private loadJQService:LoadJQService
  ) { 
    
  }

  ngOnInit() {
    this.httpService.getBrandProducts().then(resp=>{
      console.log(resp);
      if(resp.success){
          var list = resp.results;
          for(var i=0 ; i< list.length;i++){
            if(this.chars.indexOf(list[i]["char"])>=0){

            }else{
                this.chars.push(list[i]["char"]);
            } 
          }
          this.chars = this.chars.sort();
          for(var i=0;i<this.chars.length;i++){
            var tmpArr = new Array();
            for(var j=0;j<list.length;j++){
              if (list[j]["char"] == this.chars[i]){
                  var productkeys = new Array();
                  var products = new Array();
                  for(var k=0;k<list[j]["products"].length;k++){
                     
                      productkeys.push(Object.keys(list[j]["products"][k])[0]);
                      products.push(list[j]["products"][k][Object.keys(list[j]["products"][k])[0]]);
                  }
                  list[j]["productkeys"]=productkeys;
                  list[j]["products"]=products;
                  console.log(list[j]);
                  tmpArr.push(list[j] as Brand )
              }
            }
            this.brands[this.chars[i]] = tmpArr;
          }
          console.log(this.brands);
      }
      
    })
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }
  ngAfterViewChecked() {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    
  }

  jump(id:Number){
     console.log($('#Section'+id));
     var jump_position = $('#Section'+id).offset();
     console.log(jump_position);
     window.scrollTo(jump_position.left,jump_position.top-50);
     return false;
  }
}
