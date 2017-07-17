import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { LoadJQService } from '../../../load-jq.service';
declare var $: any;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  providers:[HttpService,LoadJQService]
})
export class ContentComponent implements OnInit {

  constructor(private httpService:HttpService,private loadJqService:LoadJQService) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.loadJqService.froalaEditorComment('forumComment');
  }
}
