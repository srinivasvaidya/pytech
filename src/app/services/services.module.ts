import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { HttpModule }                from '@angular/http';
import { RouterModule }              from '@angular/router';
import { MaterialModule }            from '@angular/material';
import { DataService }               from './data.service';


@NgModule({
  declarations: [
  ],
  exports: [
  ],
  providers: [DataService],
  imports: [
    HttpModule,
    CommonModule,
    RouterModule,
    MaterialModule
  ]
})
export class ServiceModule { }
