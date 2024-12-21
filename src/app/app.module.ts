import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // To handle HTTP requests
import { FormsModule } from '@angular/forms';  // Add this import for ngModel support

import { AppComponent } from './app.component';

@NgModule({
  declarations: 
  [AppComponent],
  
  imports: [
    BrowserModule,
    HttpClientModule, // Enables HTTP client functionality
    FormsModule       // Add this line to enable ngModel functionality
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
