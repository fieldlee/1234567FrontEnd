import { Component, OnInit } from '@angular/core';
declare var $ : any;
@Component({
  selector: 'app-homedashboard',
  templateUrl: './homedashboard.component.html',
  styleUrls: ['./homedashboard.component.css']
})
export class HomedashboardComponent implements OnInit {
  
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.carousel();
  }
  
  carousel(){
    //owl carousel
	$('#owl-works').owlCarousel({
            items : 1,
            lazyLoad:true,
            loop:true,
            autoPlay: true,
            autoHeight: true
        });
  }
}
