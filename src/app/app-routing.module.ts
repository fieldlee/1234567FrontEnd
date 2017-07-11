import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { AppComponent }   from './app.component'
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { AdsComponent } from './dashboard/dashboard/ads/ads.component';
import { NewsComponent } from './dashboard/dashboard/news/news.component';
import { ForumActionComponent } from './dashboard/dashboard/forum-action/forum-action.component';
import { ForumListComponent } from './dashboard/dashboard/forum-list/forum-list.component';
import { BrandComponent } from './dashboard/dashboard/brand/brand.component';
import { ProductComponent } from './dashboard/dashboard/product/product.component';
import { BasicConfigComponent } from './dashboard/basic-config/basic-config.component';

import { BasicProviceComponent } from './dashboard/basic-provice/basic-provice.component';
import { BasicCityComponent } from './dashboard/basic-city/basic-city.component';
import { BasicDistrictComponent } from './dashboard/basic-district/basic-district.component';
import { BasicTypeComponent } from './dashboard/basic-type/basic-type.component';
import { BasicSubtypeComponent } from './dashboard/basic-subtype/basic-subtype.component';
import { BasicTagsComponent } from './dashboard/basic-tags/basic-tags.component';

const appRoutes: Routes = [
  { path: "", redirectTo: 'dashboard', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "ads", component: AdsComponent },
  { path: "news", component: NewsComponent },
  { path: "forumaction", component: ForumActionComponent },
  { path: "forumlist", component: ForumListComponent },
  { path: "brand", component: BrandComponent },
  { path: "product", component: ProductComponent },
  { path: "basic-config", component: BasicConfigComponent },
  {path:"basic-provice",component:BasicProviceComponent},
  {path:"basic-city",component:BasicCityComponent},
  {path:"basic-district",component:BasicDistrictComponent},
  {path:"basic-type",component:BasicTypeComponent},
  {path:"basic-subtype",component:BasicSubtypeComponent},
  {path:"basic-tags",component:BasicTagsComponent}
];

export const AppRoutingModule:ModuleWithProviders = RouterModule.forRoot(appRoutes);
