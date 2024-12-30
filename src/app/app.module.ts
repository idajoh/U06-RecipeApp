import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  
import { FormsModule } from '@angular/forms';  
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';

import { HomeModule } from './pages/home.module';




@NgModule({
  declarations: 
  [AppComponent,
    LoginComponent, 
    SignupComponent, 
    HomeComponent
  ],
  
  imports: [
    BrowserModule,
    HttpClientModule, 
    FormsModule, 
    AppRoutingModule, 
    HomeModule
  ],
  //providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
