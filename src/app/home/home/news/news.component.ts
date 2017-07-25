import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
import { ContantService } from '../../../contant.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [HttpService, LoadJQService]
})
export class NewsComponent implements OnInit {

  constructor(private httpService: HttpService,
    private contantService:ContantService, 
    private loadJqService: LoadJQService,
  private route: ActivatedRoute,
    private router: Router) { }
   
  ngOnInit() {

  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    
  }
}
