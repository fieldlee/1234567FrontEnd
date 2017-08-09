import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule,ActivatedRoute,Router} from '@angular/router';
import { HttpService } from '../../../../http.service';
import { ContantService } from '../../../../contant.service';
@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers:[HttpService]
})
export class ClassComponent implements OnInit {

  constructor(private route:ActivatedRoute,
    private router:Router,
    private contantService:ContantService,
    private httpService:HttpService) { }

  ngOnInit() {
  }

  issue(){
    this.router.navigate(['/home/home/live/classauth'])
  }
}
