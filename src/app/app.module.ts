import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { HttpService } from './http.service';
import { ContantService } from './contant.service';
import { LoginComponent } from './home/home/login/login.component';
import { RegisterComponent } from './home/home/register/register.component';


@NgModule({
  declarations: [
    AppComponent
    ,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [HttpService, ContantService],
  bootstrap: [AppComponent]
})
export class AppModule { }
