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
  selector: 'cp-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit{
  loadingIndicator: boolean = true;
  public showOrHide:boolean = false;
  selected = [];
  isSendSMS:boolean = false;
  isUpload:boolean = false;
  allRowsSelected : any;
  title:string = "Send SMS";
  page = new Page();
  rows = new Array();
  defaultSorting:string = "";
  public form: FormGroup;
  //Prabhu : Commeneted below during merge
 // title:String = "";
  permissions:any = {};
  constructor(private _dataService: DataService, private fb: FormBuilder,) {
    this.page.sortingField = "CustomerInvoiceId";
    this.page.sortingOrder = "desc";
  }
  ngOnInit() {
     this.permissions = this._dataService.getPermissions();
     this.setPage({offset:0});
  }
  
  addTransaction(){
    this.title = "Add Transaction";
    this.showOrHide = true;
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
  setPage(pageInfo){
    this.loadingIndicator = true;
    this.page.pageNumber = pageInfo.offset;
    this.rows = [];
    this.messages.emptyMessage = "";
    this.page.totalElements = 0;
    if(this.searchTerm == null){
        this._dataService.getTransactions(this.page).subscribe((data:PagedData<StoreCustomer>) => {
        this.rows = data.data;
        this.page = data.page;
        this.loadingIndicator = false;
        console.log(data);
        this.loadingIndicator = false;
        });
    } else {
        /* this._dataService.getTransactions(this.page, this.searchTerm).subscribe((data:<StoreCustomer>) => {
            this.rows = data.data;
            this.page = data.page;
            this.loadingIndicator = false;
            console.log(data);
            this.loadingIndicator = false;
        }); */
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
  
  saveModel(params){
      console.log("[saveModel] ", params[0]);
      this._dataService.saveTransaction(params[0]).subscribe(data => {
          console.log(data);
          this.showOrHide = false;
          params[1]();
          //Reload the data
          this.setPage({offset: 0});
      });
  }

  changePage(event){
    console.log("pagesize is ", event);
    this.page.size = event.value;
    this.setPage({offset: 0});
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
  download(merchantId, pdfPath){
    let url = `http://ltblobstorage.blob.core.windows.net/merchantid-${merchantId}/${pdfPath}`;
    window.open(url);
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
  
  onHeaderSelect(event: boolean): void {
    console.log(1313343)
       this.allRowsSelected = event;
       if (this.allRowsSelected) {
             //if (!this.externalPaging) {
               const auxList = [];
               auxList.push(...this.rows);
               this.selected = auxList.slice(0, ((1) * this.page.size));
            //  }
            //  else {
            //    this.selected.push(...this.rows);
            //  }
           }
           else {
             this.selected = [];
           }
  }
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);
    console.log('all rows', ...this.rows);
      this._dataService.getCustomerInfoBySId(selected[selected.length - 1].StoreCustomerId, () => {
      }).subscribe(
        data => {
          console.log(data)
          this.selected[selected.length - 1].FirstName = data.data[0].FirstName;
          this.selected[selected.length - 1].PrimaryPhone = data.data[0].PrimaryPhone;
          this.selected.splice(0, this.selected.length);
          this.selected.push(...selected);
          console.log('this.selected',this.selected)
        },
        err => {
          console.log(err);
        }
        );
  }
}