import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: "", component: HomeComponent}
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