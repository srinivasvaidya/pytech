import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';

import { NiAlertComponent }      from './ni-alert/ni-alert.component';
import { NiBadgeComponent }      from './ni-badge/ni-badge.component';
import { NiBreadcrumbComponent } from './ni-breadcrumb/ni-breadcrumb.component';
import { NiButtonComponent }     from './ni-button/ni-button.component';
import { NiCardComponent }       from './ni-card/ni-card.component';
import { NiFileComponent }       from './ni-file/ni-file.component';
import { NiHTimelineComponent }  from './ni-h-timeline/ni-h-timeline.component';

import { ColorDirective }        from './directives/color/color.directive';
import { BgDirective }           from './directives/bg/bg.directive';
import { GradientDirective }     from './directives/gradient/gradient.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NiAlertComponent,
    NiBadgeComponent,
    NiBreadcrumbComponent,
    NiButtonComponent,
    NiCardComponent,
    NiFileComponent,
    NiHTimelineComponent,
    ColorDirective,
    BgDirective,
    GradientDirective
  ],
  exports: [
    NiAlertComponent,
    NiBadgeComponent,
    NiBreadcrumbComponent,
    NiButtonComponent,
    NiCardComponent,
    NiFileComponent,
    NiHTimelineComponent,
    ColorDirective,
    BgDirective,
    GradientDirective
  ]
})
export class NiComponentsModule { }
