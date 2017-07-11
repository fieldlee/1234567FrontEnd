import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpService } from './http.service';
import { ContantService } from './contant.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AdsComponent } from './dashboard/dashboard/ads/ads.component';
import { NewsComponent } from './dashboard/dashboard/news/news.component';
import { ForumActionComponent } from './dashboard/dashboard/forum-action/forum-action.component';
import { ForumListComponent } from './dashboard/dashboard/forum-list/forum-list.component';
import { BrandComponent } from './dashboard/dashboard/brand/brand.component';
import { ProductComponent } from './dashboard/dashboard/product/product.component';

import { BasicProviceComponent } from './dashboard/basic-provice/basic-provice.component';
import { BasicCityComponent } from './dashboard/basic-city/basic-city.component';
import { BasicDistrictComponent } from './dashboard/basic-district/basic-district.component';
import { BasicTypeComponent } from './dashboard/basic-type/basic-type.component';
import { BasicSubtypeComponent } from './dashboard/basic-subtype/basic-subtype.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { BasicConfigComponent } from './dashboard/basic-config/basic-config.component';
import { BasicTagsComponent } from './dashboard/basic-tags/basic-tags.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AdsComponent,
    NewsComponent,
    ForumActionComponent,
    ForumListComponent,
    BrandComponent,
    ProductComponent,
    BasicConfigComponent,
    BasicProviceComponent, 
    BasicCityComponent, 
    BasicDistrictComponent, 
    BasicTypeComponent, 
    BasicSubtypeComponent,
    BasicTagsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  providers: [HttpService, ContantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
