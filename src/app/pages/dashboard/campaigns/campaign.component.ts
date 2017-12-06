import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { SharedService }    from '../../../layouts/shared-service';
import { AmChartsService }  from '@amcharts/amcharts3-angular';
import { DataService }      from '../../../services/data.service';
import { Page }             from '../../../models/page';
import { CampaignRule }    from '../../../models/campaign.rule';
import { PagedData }        from '../../../models/paged-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';

@Component({
  moduleId: module.id,
  selector: 'cp-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit{
  loadingIndicator: boolean = true;
  public showOrHide:boolean = false;
  page = new Page();
  rows = new Array<CampaignRule>();
  dialogRef: MdDialogRef<DeleteDialogComponent>;
  model = null;
  public form: FormGroup;
  config: MdDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      action: '',
      event: []
    }
  };

  permissions:any = {};

  constructor(public dialog: MdDialog, private _dataService: DataService, private fb: FormBuilder,) {
  }
  ngOnInit() {
     this.permissions = this._dataService.getPermissions();
     console.log("Campaigns ", this.permissions.campaigns);
     this.page.sortingField = "CampaignRuleId";
     this.page.sortingOrder = "desc";
     this.setPage({offset:0});
     this.form = this.fb.group({
      /*fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      range: [null, Validators.compose([Validators.required, CustomValidators.range([5, 9])])],
      url: [null, Validators.compose([Validators.required, CustomValidators.url])],
      date: [null, Validators.compose([Validators.required, CustomValidators.date])],
      creditCard: [null, Validators.compose([Validators.required, CustomValidators.creditCard])],
      phone: [null, Validators.compose([Validators.required, CustomValidators.phone('en-US')])],
      gender: [null, Validators.required] */
    });
  }
  addCampaign() {
    this.model = "";
    this.showOrHide = true;
  }

  edit(row) {
    this.model = row;
    this.showOrHide = true;
  }

  openNavbar(event) {
    event.preventDefault();
    this.showOrHide = true;
  }

  closeForm() {
    this.showOrHide = false;
  }
  onSort(event) {
    // event was triggered, start sort sequence
    console.log('Sort Event', event);
    //this.loading = true;
    const sort = event.sorts[0];
    this.page.sortingOrder = sort.dir;
    if(this.page.sortingField != sort.prop){
      this.page.sortingField = sort.prop;
      this.setPage({offset:0});
      return;
    }
    this.setPage({offset:this.page.pageNumber});
  }
  messages:any = {
     emptyMessage: 'No data to display',
    // Footer total message
    totalMessage: 'total'
  }
  setPage(pageInfo){
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = 10;
    this.rows = [];
    this.messages.emptyMessage = "";
    this.page.totalElements = 0;
    this._dataService.getCampaigns(this.page).subscribe((data:PagedData<CampaignRule>) => {
      this.rows = data.data;
      this.page = data.page;
      this.loadingIndicator = false;
      console.log(data);
      this.loadingIndicator = false;
    });
  }
  showComponent(el){
      el.nativeElement.style.display ='inline-block';
  }
  hideCompoent(el){
      el.nativeElement.style.display ='none';
  }
  saveModel(model){
    console.log(model[0]);
    if(model[1] == false){
      this._dataService.saveCampaign(model[0]).subscribe(data => {
        if(data.status == "SUCCESS"){
          alert("Successfully inserted the record");
          this.setPage({offset: 0});
          this.showOrHide = false;       
        }else {
          this.showOrHide = false;
        }
      });
    } else {
      this._dataService.updateCampaign(model[0]).subscribe(data => {
        if(data.status == "Success"){
          this.setPage({offset: 0});
          this.showOrHide = false;       
          alert("Successfully update the record");
        }else {
          alert("Failed to update " + data.message);
          this.showOrHide = false;
        }
      }); 
    }
  }
  changePage(event){
    console.log("pagesize is ", event);
    this.page.size = event.value;
    this.setPage({offset: 0});
  }
  searchTerm:string = null;
  performSearch(searchTerm: HTMLInputElement): void {
    console.log("[performSearch] search term is ", this.searchTerm);
    if(searchTerm.value.length >= 1){
      this.searchTerm = searchTerm.value; 
      this.page.pageNumber = 0;
      this.page.searchTerm = this.searchTerm;
      this.setPage({offset: 0}); 
    } else {
      this.searchTerm = null; 
      this.page.pageNumber = 0;
      this.page.searchTerm = null;
      this.setPage({offset: 0});
    } 
  }

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;
  ngAfterViewChecked() {
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
      window.dispatchEvent(new Event('resize'));
    }
  }

  delete(row) {
    this.config.data = {"row": row};
    this.dialogRef = this.dialog.open(DeleteDialogComponent, this.config);
    this.dialogRef.afterClosed().subscribe((result: string) => {
      if(result === 'delete'){
        this.invokeDeleteService(row);
      }
      this.dialogRef = null;
    });
  }

  invokeDeleteService(row){
    let thisObj = this;
    this._dataService.deleteCampaign(row.CampaignRuleId).subscribe(data => {
        alert("Successfully deleted record");
        thisObj.setPage({offset:0});
    });
  }
}


@Component({
  selector: 'cp-confirmation',
  template: `
  <h5 class="mt-0">Campaign Delete Confirmation</h5>
  <div class="mb-4">
    <strong>Are you sure you want to delete Campaign Rule - {{data.row.CampaignName}} ?</strong>
  </div>
  <button md-button type="button" (click)="dialogRef.close('delete')">Delete</button>
  &nbsp;&nbsp;
  <button md-button type="button" (click)="dialogRef.close('cancel')">Cancel</button>`
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MdDialogRef<DeleteDialogComponent>,
    @Inject(MD_DIALOG_DATA) public data: any) { }
}