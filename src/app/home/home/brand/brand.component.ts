import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import { Brand } from '../../../class/brand';
@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'],
  providers:[HttpService,LoadJQService]
})
export class BrandComponent implements OnInit {
  id:string;
  brand:Brand;
  constructor(private httpService :HttpService,
    private route:ActivatedRoute,
    private loadJqService:LoadJQService) {
      this.brand = new Brand();
     }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.id = params["id"];
        this.httpService.getBrandById(this.id).then(resp=>{
            this.brand = resp;
        });
    });
    
  }

}
