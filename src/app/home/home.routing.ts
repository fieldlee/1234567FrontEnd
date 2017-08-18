import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';
import { HomedashboardComponent } from './home/homedashboard/homedashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { HelpComponent } from './home/help/help.component';
import { NewsComponent } from './home/news/news.component';
import { ForumsComponent } from './home/forums/forums.component';
import { NewcontentComponent } from './home/newcontent/newcontent.component';
import { ContentComponent } from './home/content/content.component';
import { IssueComponent } from './home/issue/issue.component';
import { FindComponent } from './home/find/find.component';
import { BrandComponent } from './home/brand/brand.component';
import { ProductComponent } from './home/product/product.component';
import { PraiseComponent } from './home/praise/praise.component';
import { SearchComponent } from './home/search/search.component';
import { NotificationComponent } from './home/notification/notification.component';

const appRoutes: Routes = [
  { path: "", redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent , children:[
    { path: "", redirectTo: 'dashboard', pathMatch: 'full'},
    { path: "dashboard", component: HomedashboardComponent},
    { path: "profile", component: ProfileComponent},
    { path: "profile/:username", component: ProfileComponent},
    { path: "news", component: NewsComponent},
    { path: "forum", component: ForumsComponent},
    { path: "forum/:key", component: ForumsComponent},
    { path: "content", component: ContentComponent},
    { path: "issue", component: IssueComponent},
    { path: "issuebyid/:id", component: IssueComponent},
    { path: "issue/:type", component: IssueComponent},
    { path: "issue/:type/:subtype", component: IssueComponent},//productid
    { path: "issue/:type/:subtype/:productid", component: IssueComponent},
    { path: "newcontent/:id", component: NewcontentComponent},
    { path: "content/:id", component: ContentComponent},
    { path: "product/:id", component: ProductComponent},
    { path: "praise/:id", component: PraiseComponent},
    { path: "brand/:id", component: BrandComponent},
    { path: "help", component: HelpComponent},
    { path: "find", component: FindComponent},
    { path: "search", component: SearchComponent},
    { path: "notification", component: NotificationComponent},
    { path: "search/:key", component: SearchComponent},
    {
      path: 'live',
      loadChildren: './home/live/live.module#LiveModule' 
    },
    {
      path: 'score',
      loadChildren: './home/score/score.module#ScoreModule' 
    }
  ]},
  
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
export class HomeRoutingModule {

}