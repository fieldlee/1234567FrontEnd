import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule} from './dashboard.routing';
import { AdsComponent } from './dashboard/ads/ads.component';
import { NewsComponent } from './dashboard/news/news.component';
import { ForumActionComponent } from './dashboard/forum-action/forum-action.component';
import { ForumListComponent } from './dashboard/forum-list/forum-list.component';
import { BrandComponent } from './dashboard/brand/brand.component';
import { ProductComponent } from './dashboard/product/product.component';
// import { BrandHotComponent } from './dashboard/brand-hot/brand-hot.component';
import { BasicProviceComponent } from './basic-provice/basic-provice.component';
import { BasicCityComponent } from './basic-city/basic-city.component';
import { BasicDistrictComponent } from './basic-district/basic-district.component';
import { BasicTypeComponent } from './basic-type/basic-type.component';
import { BasicSubtypeComponent } from './basic-subtype/basic-subtype.component';
import { BasicConfigComponent } from './basic-config/basic-config.component';
import { BasicTagsComponent } from './basic-tags/basic-tags.component';
import { DelegateComponent } from './dashboard/delegate/delegate.component';
import { MaintainComponent } from './dashboard/maintain/maintain.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule
  ],
  declarations: [
   DashboardComponent,
   AdsComponent, 
   NewsComponent, 
   ForumActionComponent, 
   ForumListComponent, 
   BrandComponent, 
   ProductComponent, 
   BasicProviceComponent, 
   BasicCityComponent, 
   BasicDistrictComponent, 
   BasicTypeComponent, 
   BasicSubtypeComponent, 
   BasicConfigComponent, 
   BasicTagsComponent, DelegateComponent, MaintainComponent
   ]
})
export class DashboardModule { 
  constructor(){
  }
}
