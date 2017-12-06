import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { HttpModule }                from '@angular/http';
import { RouterModule }              from '@angular/router';
import { MaterialModule }            from '@angular/material';
import { SqueezeBoxModule }                from 'squeezebox';

import { HorizontalNavbarComponent } from './components/horizontal-navbar/horizontal-navbar.component';
import { VerticalNavbarComponent }   from './components/vertical-navbar/vertical-navbar.component';
import { AdditionNavbarComponent }   from './components/addition-navbar/addition-navbar.component';
import { LogoComponent }             from './components/logo/logo.component';
import { MenuComponent }             from './components/menu/menu.component';
import { FooterComponent }           from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';

@NgModule({
  declarations: [
    HorizontalNavbarComponent,
    VerticalNavbarComponent,
    AdditionNavbarComponent,
    LogoComponent,
    MenuComponent,
    FooterComponent
  ],
  exports: [
    HorizontalNavbarComponent,
    VerticalNavbarComponent,
    AdditionNavbarComponent,
    LogoComponent,
    MenuComponent,
    FooterComponent,
    ReactiveFormsModule
  ],
  imports: [
    HttpModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
    SqueezeBoxModule
  ]
})
export class UIModule { }
