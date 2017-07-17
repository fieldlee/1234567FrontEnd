import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  key:string;
  type:string;
  constructor(private route:ActivatedRoute) { 

  }

  ngOnInit() {
    this.route.params.subscribe(params=>{
        this.key = params["key"];
        
    })  
  }
}
