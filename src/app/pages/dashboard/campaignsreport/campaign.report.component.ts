import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { SharedService }    from '../../../layouts/shared-service';
import { AmChartsService }  from '@amcharts/amcharts3-angular';
import { DataService }      from '../../../services/data.service';
import { Page }             from '../../../models/page';
import { CampaignRule }    from '../../../models/campaign.rule';
import { PagedData }        from '../../../models/paged-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  moduleId: module.id,
  selector: 'cp-campaign-report',
  templateUrl: './campaign.report.component.html',
  styleUrls: ['./campaign.report.component.scss']
})
export class CampaignReportComponent implements OnInit{
    loadingIndicator: boolean = true;
    public showOrHide:boolean = false;
    page = new Page();
    rows = new Array<CampaignRule>();
  public form: FormGroup;
  constructor(private _dataService: DataService, private fb: FormBuilder,) {
  }
  ngOnInit() {
     this.setPage({offset:0});
  }
  addCampaign() {
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
  
  changePage(event){
    console.log("pagesize is ", event);
    this.page.size = event.value;
    this.setPage({offset: 0});
  }
  messages:any = {
     emptyMessage: 'No data to display',
    // Footer total message
    totalMessage: 'total'
  }
  setPage(pageInfo){
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.totalElements = 0;
    this.rows = [];
    this.messages.emptyMessage = "";
    this.page.totalElements = 0;
    this._dataService.getCampaignReport(this.page).subscribe((data:PagedData<CampaignRule>) => {
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
      console.log(model);
      this._dataService.saveCustomer(model).subscribe(data => {
        if(data.status == "SUCCESS"){
          alert("Successfully inserted the record");
        }else {
          this.showOrHide = false;
        }
        
      });
  }
  searchTerm:string = null;
  performSearch(searchTerm: HTMLInputElement): void {
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

}