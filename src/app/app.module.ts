import { BrowserModule }                    from '@angular/platform-browser';
import { RouterModule }                     from '@angular/router';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';
import { MaterialModule }                  from '@angular/material';

import { routes, AppRoutingModule }         from './app-routing.module';
import { AppComponent }                     from './app.component';
import { UIModule }                         from './ui/ui.module';
import { NiComponentsModule }               from './ni-components/ni-components.module';
import { PagesModule }                      from './pages/pages.module';

import { DefaultLayoutComponent }           from './layouts/default/default.component';
import { BoxedLayoutComponent }             from './layouts/boxed/boxed.component';
import { DefaultCLayoutComponent }          from './layouts/default-c/default-c.component';
import { BoxedCLayoutComponent }            from './layouts/boxed-c/boxed-c.component';
import { ExtraLayoutComponent }             from './layouts/extra/extra.component';
import { ServiceModule }                    from './services/services.module';
import { AppGlobals }                       from './app.globals';
import { Ng2Permission }                    from 'angular2-permission';
import { AuthGuard }                        from './services/auth.guard';
import { Ng2CompleterModule } from "ng2-completer";

@NgModule({
  declarations : [
    AppComponent,
    DefaultLayoutComponent,
    BoxedLayoutComponent,
    DefaultCLayoutComponent,
    BoxedCLayoutComponent,
    ExtraLayoutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    Ng2Permission,
    Ng2CompleterModule,
    
    AppRoutingModule,
    UIModule,
    NiComponentsModule,
    PagesModule,
    MaterialModule,
    ServiceModule
  ],
  exports: [
    Ng2Permission
  ],
  providers: [ AppGlobals, AuthGuard],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
