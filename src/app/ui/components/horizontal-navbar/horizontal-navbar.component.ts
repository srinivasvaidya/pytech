import { Component, OnInit, Input, Output, EventEmitter, ViewChild,ElementRef } from '@angular/core';
import { DataService } from '../../../services/data.service';

@Component({
  moduleId: module.id,
  selector: 'horizontal-navbar',
  templateUrl: 'horizontal-navbar.component.html',
  styleUrls: ['horizontal-navbar.component.scss'],
  host: {
    '[class.app-navbar]': 'true',
    '[class.show-overlay]': 'showOverlay'
  }
})
export class HorizontalNavbarComponent implements OnInit {
  @Input() title: string;
  @Input() openedSidebar: boolean;
  @Output() sidebarState = new EventEmitter();
  @Output() changeBranch:any = new EventEmitter();
  @ViewChild("branchMenu") branchMenu:ElementRef;
  branchTitle:string = "Branch";
  showOverlay: boolean;
  user:any = {};
  branches = [];
  constructor(private _dataService: DataService) {
    this.openedSidebar = false;
    this.showOverlay = false;
  }

  ngOnInit() {
    let user = this._dataService._getUser();
    this.branches = this._dataService.getBranches();
    this.user = user;
  }

  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    event.preventDefault();

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');

    //Add class 'show-overlay'
    this.showOverlay = true;
  }

  close(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    event.preventDefault();

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }

    //Remove class 'show-overlay'
    this.showOverlay = false;
  }

  openSidebar() {
    this.openedSidebar = !this.openedSidebar;
    this.sidebarState.emit();
  }

  logout(event) {
    event.preventDefault();
    this._dataService.logout(true);
  }
  updateBranch(event, branch) {
    event.preventDefault();
    console.log("Branch id ", branch);
    
    if(branch === 'all'){
      this.branchTitle = "All Branches";
      let branchIds = []
      for(let branch in this.branches){
        branchIds.push(this.branches[branch].MerchantBranchId)
      }
      this.changeBranch.emit(branchIds);
    } else {
      this.branchTitle = branch.BranchName;
      console.log("Updating branch id to ", branch.MerchantBranchId)
      this._dataService._setMerchantId(branch.MerchantBranchId);
      this.changeBranch.emit([branch.MerchantBranchId]);
    }
    let items = this.branchMenu.nativeElement.parentElement.children;
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    this.showOverlay = false;
  }
}
