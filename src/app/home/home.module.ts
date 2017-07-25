import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeRoutingModule } from './home.routing';
import { FroalaEditorModule, FroalaViewModule} from 'angular2-froala-wysiwyg';
import { HomeComponent } from './home/home.component';
import { HomedashboardComponent } from './home/homedashboard/homedashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { HelpComponent } from './home/help/help.component';
import { NewsComponent } from './home/news/news.component';
import { ForumsComponent } from './home/forums/forums.component';
import { ContentComponent } from './home/content/content.component';
import { PlayerComponent } from './home/player/player.component';
import { IssueComponent } from './home/issue/issue.component';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import { FindComponent } from './home/find/find.component';
import { NewcontentComponent } from './home/newcontent/newcontent.component';
import { BrandComponent } from './home/brand/brand.component';
import { ProductComponent } from './home/product/product.component';
import { PraiseComponent } from './home/praise/praise.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    InfiniteScrollModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  declarations: [
  HomeComponent,
  HomedashboardComponent,
  ProfileComponent,
  HelpComponent,
  NewsComponent,
  ForumsComponent,
  ContentComponent,
  PlayerComponent,
  IssueComponent,
  FindComponent,
  NewcontentComponent,
  BrandComponent,
  ProductComponent,
  PraiseComponent
  ]
})
export class HomeModule { }
