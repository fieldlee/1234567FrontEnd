import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-homedashboard',
  templateUrl: './homedashboard.component.html',
  styleUrls: ['./homedashboard.component.css'],
  providers: [HttpService, LoadJQService]
})
export class HomedashboardComponent implements OnInit {
  type: string;
  types: string[];
  subType: string;
  subtypes: string[];
  brands: string[];
  province:string;
  provinces:string[];
  city:string;
  citys:string[];
  district:string;
  districts:string[];
  constructor(private httpService: HttpService, private loadJqService: LoadJQService,
  private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.type = "";
    this.subType = "";
    this.province = "";
    this.city = "";
    this.district = "";
    this.brands = new Array();
    this.httpService.getType().then(response => {
      console.log(response.results);
      this.types = new Array();
      response.results.forEach(element => {
        this.types.push(element.type);
      });
    });
    this.httpService.getBrands().then(response=>{
      console.log(response);
      this.brands = new Array();
      response.forEach(ele=>{
        this.brands.push(ele.name);
      })
    })
    this.httpService.getProvinces().then(resp=>{
      console.log(resp.results);
      this.provinces = new Array();
      resp.results.forEach(element => {
        this.provinces.push(element.name);
      });
    });
  }
  typeListener(): void {
    this.httpService.getSubType(this.type).then(
      resp => {
        console.log(resp);
        var i = 0;
        this.subtypes = new Array();
        resp.results.forEach(element => {
          this.subtypes[i] = element.subType;
          i = i + 1;
        });
      })
  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJqService.reloadJQ(null);
  }

  provinceListener(): void {
    this.httpService.getCitys(this.province).then(resp => {
      this.citys = new Array();
      resp.results.forEach(element => {
        this.citys.push(element.city) ;
      });
    });
  }

  changetoNews(key:string){
    switch (key) {
    case "news":
        this.router.navigate(['/home/home/news']);
        break;
    default:
        this.router.navigate(['/home/home/forum/'+key]);
        break;
    }
  }
}
