import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdsComponent } from './dashboard/ads/ads.component';
import { NewsComponent } from './dashboard/news/news.component';
import { ForumActionComponent } from './dashboard/forum-action/forum-action.component';
import { ForumListComponent } from './dashboard/forum-list/forum-list.component';
import { BrandComponent } from './dashboard/brand/brand.component';
import { ProductComponent } from './dashboard/product/product.component';

//,canActivate:[AuthGuard]   { path: '', redirectTo: '/page2', pathMatch: 'full' },
// app/show/show.module#ShowModule
const appRoutes: Routes = [
  { path: "", redirectTo: 'dashboard', pathMatch: 'full' },
  { path: "dashboard", component: DashboardComponent },
  { path: "ads", component: AdsComponent },
  { path: "news", component: NewsComponent },
  { path: "forumaction", component: ForumActionComponent },
  { path: "forumlist", component: ForumListComponent },
  { path: "brand", component: BrandComponent },
  { path: "product", component: ProductComponent }
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