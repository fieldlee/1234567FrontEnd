import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';
import { HomedashboardComponent } from './home/homedashboard/homedashboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { HelpComponent } from './home/help/help.component';
import { NewsComponent } from './home/news/news.component';
import { ForumsComponent } from './home/forums/forums.component';
import { ContentComponent } from './home/content/content.component';
import { IssueComponent } from './home/issue/issue.component';
const appRoutes: Routes = [
  { path: "", redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent , children:[
    { path: "", redirectTo: 'dashboard', pathMatch: 'full'},
    { path: "dashboard", component: HomedashboardComponent},
    { path: "profile", component: ProfileComponent},
    { path: "news", component: NewsComponent},
    { path: "forum", component: ForumsComponent},
    { path: "forum/:key", component: ForumsComponent},
    { path: "content", component: ContentComponent},
    { path: "issue", component: IssueComponent},
    { path: "issue/:type/:subtype", component: IssueComponent},
    { path: "content/:id", component: ContentComponent},
    { path: "help", component: HelpComponent}
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