import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdsComponent } from './dashboard/ads/ads.component';
import { NewsComponent } from './dashboard/news/news.component';
import { ForumActionComponent } from './dashboard/forum-action/forum-action.component';
import { ForumListComponent } from './dashboard/forum-list/forum-list.component';
import { BrandComponent } from './dashboard/brand/brand.component';
import { ProductComponent } from './dashboard/product/product.component';
import { BasicProviceComponent } from './basic-provice/basic-provice.component';
import { BasicCityComponent } from './basic-city/basic-city.component';
import { BasicDistrictComponent } from './basic-district/basic-district.component';
import { BasicTypeComponent } from './basic-type/basic-type.component';
import { BasicSubtypeComponent } from './basic-subtype/basic-subtype.component';
import { BasicConfigComponent } from './basic-config/basic-config.component';
import { BasicTagsComponent } from './basic-tags/basic-tags.component';
//,canActivate:[AuthGuard]   { path: '', redirectTo: '/page2', pathMatch: 'full' },
// app/show/show.module#ShowModule
const appRoutes: Routes = [
  { path: "", redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: "dashboard", component: DashboardComponent, children: [
      { path: "ads", component: AdsComponent },
      { path: "news", component: NewsComponent },
      { path: "forumaction", component: ForumActionComponent },
      { path: "forumlist", component: ForumListComponent },
      { path: "brand", component: BrandComponent },
      { path: "product", component: ProductComponent },
      { path: "basic-config", component: BasicConfigComponent },
      { path: "basic-provice", component: BasicProviceComponent },
      { path: "basic-city", component: BasicCityComponent },
      { path: "basic-district", component: BasicDistrictComponent },
      { path: "basic-type", component: BasicTypeComponent },
      { path: "basic-subtype", component: BasicSubtypeComponent },
      { path: "basic-tags", component: BasicTagsComponent }
    ]
  }

];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class DashboardRoutingModule {
}