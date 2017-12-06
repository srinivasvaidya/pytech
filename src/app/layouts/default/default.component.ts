import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared-service';
import { DataService } from '../../services/data.service';

@Component({
  moduleId: module.id,
  selector: 'default-layout',
  templateUrl: 'default.component.html',
  styleUrls: ['../layouts.scss'],
  providers: [ SharedService ]
})
export class DefaultLayoutComponent implements OnInit {
  pageTitle: any;
  boxed: boolean;
  compress: boolean;
  menuStyle: string;
  rtl: boolean;
  @Input() openedSidebar: boolean;

  constructor( private _sharedService: SharedService, private _dataService: DataService ) {
    this.openedSidebar = false;
    this.boxed = false;
    this.compress = true;
    this.menuStyle = 'style-3';
    this.rtl = false;

    _sharedService.changeEmitted$.subscribe(
      title => {
        this.pageTitle = title;
      }
    );
  }

  ngOnInit() { }

  getClasses() {
    let menu: string = (this.menuStyle);

    return {
      ['menu-' + menu]: menu,
      'boxed': this.boxed,
      'compress-vertical-navbar': this.compress,
      'open-sidebar': this.openedSidebar,
      'rtl': this.rtl,
      'no-vertical-bar' : true 
    };
  }

  sidebarState() {
    this.openedSidebar = !this.openedSidebar;
  }

  changeBranch(branchId) {
    this._sharedService.changeBranch(branchId);
  }

}