import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { SharedService }    from '../../../layouts/shared-service';
import { AmChartsService }  from '@amcharts/amcharts3-angular';
import { DataService }      from '../../../services/data.service';
import { Page }             from '../../../models/page';
import { StoreCustomer }    from '../../../models/store-customer';
import { PagedData }        from '../../../models/paged-data';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  moduleId: module.id,
  selector: 'cp-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit{
  selectedRows: any[];
  selected = [];
  loadingIndicator: boolean = true;
  public showOrHide:boolean = false;
  isSendSMS:boolean = false;
  page = new Page();
  rows = new Array<StoreCustomer>();
  defaultSorting:string = "";
  public form: FormGroup;
  isUpload:boolean = false;
  title:string = "Add Customer";
  permissions:any = {};
  constructor(private _dataService: DataService, private fb: FormBuilder,) {
    this.page.sortingField = "StoreCustomerId";
    this.page.sortingOrder = "desc";
  }
  ngOnInit() {
     this.permissions = this._dataService.getPermissions();
     this.setPage({offset:0});
     this.form = this.fb.group({
      fname: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      range: [null, Validators.compose([Validators.required, CustomValidators.range([5, 9])])],
      url: [null, Validators.compose([Validators.required, CustomValidators.url])],
      date: [null, Validators.compose([Validators.required, CustomValidators.date])],
      creditCard: [null, Validators.compose([Validators.required, CustomValidators.creditCard])],
      phone: [null, Validators.compose([Validators.required, CustomValidators.phone('en-US')])],
      gender: [null, Validators.required]
    });
  }
  addCustomer() {
    this.title = "Add Customer";
    this.isUpload = false;
    this.showOrHide = true;
    this.isSendSMS = false;
  }
  uploadCustomers() {
    this.title = "Upload";
    this.isUpload = true;
    this.showOrHide = true;
    this.isSendSMS = false;
  }
  sendSMS(){
    console.log(JSON.stringify(this.selected));
    this.title = "Send SMS";
    this.isUpload = false;
    this.showOrHide = true;
    this.isSendSMS = true;
    // this._dataService.sendSMS(this.selected, () => {
    // }).subscribe(data => {
    //       //Reload the data
    //       this.setPage({offset: 0});
    //   });
  }

  closeForm(param) {
    this.showOrHide = false;
    if(param == "RELOAD"){
      this.setPage({offset:0});
    }
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
  public setPage(pageInfo){
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.rows = [];
    this.messages.emptyMessage = "";
    this.page.totalElements = 0;
    if(this.searchTerm == null){
        this._dataService.getCustomers(this.page).subscribe((data:PagedData<StoreCustomer>) => {
        this.rows = data.data;
        this.page = data.page;
        this.loadingIndicator = false;
        console.log(data);
        this.loadingIndicator = false;
        });
    } else {
        this._dataService.getCustomersSearch(this.page, this.searchTerm).subscribe((data:PagedData<StoreCustomer>) => {
            this.rows = data.data;
            this.page = data.page;
            this.loadingIndicator = false;
            console.log(data);
            this.loadingIndicator = false;
        });
    }
  }
  searchTerm:string = null;
  performSearch(searchTerm: HTMLInputElement): void {
    if(searchTerm.value.length >= 1){
      this.searchTerm = searchTerm.value; 
      this.page.pageNumber = 0;
      this.setPage({offset: 0}); 
    } else {
      this.searchTerm = null; 
      this.page.pageNumber = 0;
      this.setPage({offset: 0});
    }
  }

  showComponent(el){
      el.nativeElement.style.display ='inline-block';
  }
  hideCompoent(el){
      el.nativeElement.style.display ='none';
  }
  changePage(event){
    console.log("pagesize is ", event);
    this.page.size = event.value;
    this.selected = [];
    this.setPage({offset: 0});
  }
  saveModel(params){
      console.log("[saveModel] ", params[0]);
      this._dataService.saveCustomer(params[0]).subscribe(data => {
          console.log(data);
          this.showOrHide = false;
          params[1]();
          //Reload the data
          this.setPage({offset: 0});
      });
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

  selectedCustomers(event, customer){
    console.log('customer.StoreCustomerId',customer.StoreCustomerId);
  }
  
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

}