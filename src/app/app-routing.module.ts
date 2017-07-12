import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { AppComponent } from './app.component'
import { LoginComponent } from './home/home/login/login.component';
import { RegisterComponent } from './home/home/register/register.component';
import { ForgetComponent } from './home/home/forget/forget.component';
const appRoutes: Routes = [
  { path: "", redirectTo: 'home', pathMatch: 'full' },
  { path: "login", component:LoginComponent },
  { path: "register", component:RegisterComponent  },
  { path: "forget", component:ForgetComponent  },
  {
    path: "dashboard",
    loadChildren: "./dashboard/dashboard.module#DashboardModule"
  },
  {
    path: "home",
    loadChildren: "./home/home.module#HomeModule"
  }
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(appRoutes);
