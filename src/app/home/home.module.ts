import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeRoutingModule } from './home.routing';
import { FroalaEditorModule, FroalaViewModule} from 'angular2-froala-wysiwyg';
import { HomeComponent } from './home/home.component';
import { HomedashboardComponent } from './home/homedashboard/homedashboard.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
  HomeComponent,
  HomedashboardComponent
  ]
})
export class HomeModule { }
