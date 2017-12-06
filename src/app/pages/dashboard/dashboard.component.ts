import { Component, OnInit, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SharedService } from '../../layouts/shared-service';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { DataService } from '../../services/data.service';
import * as pbi from 'powerbi-client';
const breadcrumb: any[] = [
  {
    title: 'Main',
    link: '#'
  },
  {
    title: 'Dashboard',
    link: ''
  }
];
const folders: any[] = [
  {
    icon: 'android',
    badge: false,
    name: 'Android app',
    updated: 'July 21, 2017'
  },
  {
    icon: 'update',
    badge: false,
    name: 'Update plugins',
    updated: 'July 19, 2017'
  },
  {
    icon: 'bug_report',
    badge: false,
    name: 'Fix bugs',
    updated: 'July 22, 2017'
  },
  {
    icon: 'unarchive',
    badge: false,
    name: 'Create app design',
    updated: 'July 25, 2017'
  },
  {
    icon: 'content_copy',
    badge: 8,
    name: 'Create widgets',
    updated: 'July 16, 2017'
  },
  {
    icon: 'folder_open',
    badge: false,
    name: 'Documentation',
    updated: 'July 28, 2017'
  },
  {
    icon: 'folder_open',
    badge: false,
    name: 'Upload',
    updated: 'July 30, 2017'
  }
];
const timelineData: any[] = [];

@Component({
  moduleId: module.id,
  selector: 'page-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [{ provide: Window, useValue: window }]
})
export class PageDashboardComponent {
  models = window['powerbi-client'].models;
  powerbi = window['powerbi'];
  permissions:any;
  pageTitle: string = 'Dashboard';
  breadcrumb: any[] = breadcrumb;
  folders: any[] = folders;
  timelineData: any[] = timelineData;
  private chart: any;
  valueCustomers = [];
  repeatCustomers = [];
  embed_token = "";
  access_token = "";
  report_id = "";
  groupId = "";
  config = {};
  valueCustomersColDef = [
    { name: 'Name', prop: 'name' },
    { name: 'Phone', prop: 'PrimaryPhone' },
    { name: 'Amount', prop: 'totalAmount' },
  ];
  repeatCustomersColDef = [
    { name: 'Name', prop: 'name' },
    { name: 'Phone', prop: 'PrimaryPhone' },
    { name: 'No.of Times', prop: 'count' },
  ];
  columns = [
    { name: 'Customer Name', prop: 'name' },
    { name: 'Phone', prop: 'phone' },
    { name: 'Email', prop: 'email' },
    { name: 'Address', prop: 'address' },
    { name: 'Birthday', prop: 'birthday' },
    { name: 'Anniversary', prop: 'anniversary' },
    { name: 'Last Transaction Date', prop: 'lastTxDate' },
    { name: 'Total Transaction Amt', prop: 'totalTxAmt' },
    { name: 'Not seen for', prop: 'notSeen' },
    { name: 'No Of Transactions', prop: 'noOfTransactions' }
  ];
  
  transactionTableColumns = [
    { name: 'Customer Name', prop: 'name' },
    { name: 'Invoice Number', prop: 'phone' },
    { name: 'Invoice Date', prop: 'email' },
    { name: 'Invoice Type', prop: 'address' },
    { name: 'Invoice Amount', prop: 'birthday' },
    { name: 'Discount Amount', prop: 'anniversary' },
    { name: 'Invoice PDF', prop: 'lastTxDate' },
    { name: 'Action', prop: 'totalTxAmt' }
  ];

  campaignTableColumns = [
    { name: 'Campaign Name', prop: 'name' },
    { name: 'Campaign Type', prop: 'phone' },
    { name: 'Trigger', prop: 'email' },
    { name: 'Trigger Value', prop: 'address' },
    { name: 'Campaign Text', prop: 'birthday' },
    { name: 'Created Date', prop: 'anniversary' },
    { name: 'Created By', prop: 'lastTxDate' }
  ];

  campaignReportsTableColumns = [
    { name: 'Campaign Name', prop: 'name'},
    { name: 'Campaign Type', prop: 'phone'},
    { name: 'isAuto', prop: 'email' },
    { name: 'Campaign Text', prop: 'address'}
  ];

  rows = [];
  loadingIndicator: boolean = true;
  public showOrHide:boolean = false;
  @ViewChild('dashboardTab') dTab: any; 
  @ViewChild('customersView') customersView:any;
  @ViewChild('transactionsView') transactionsView:any;
  @ViewChild('campaignsView') campaignsView:any;
  @ViewChild('campaignsReportView') campaignsReportView:any;
  @ViewChild('power') power: any;
  @ViewChild('fixedpower') fixedpower: any;
  constructor( private AmCharts: AmChartsService, private _sharedService: SharedService, 
    private _dataService: DataService ) {
    this._sharedService.emitChange(this.pageTitle);
    this._sharedService.branchChange$.subscribe(data => {
      console.log(this.dTab.selectedIndex);
      this._dataService._setMerchantId(JSON.stringify(data));
      this._dataService.getDashboard({}).subscribe(data => {
        console.log(data);
      //  if(data.error) {alert(data.error);}
        this.embed_token = data.embed_token;
        this.access_token = data.access_token;
        this.report_id = data.data['Report-id'];
        this.groupId = data.data['Group-id'];
        this.config = {
          // type: data.data['ReportType'],
          type: 'report',
          tokenType: this.models.TokenType.Embed,
          permissions: this.models.Permissions.All,
          accessToken: this.embed_token,
          embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + this.report_id + '&groupId=' + this.groupId,
          id: this.report_id
        };
        this.powerbi.reset(this.power['nativeElement']);
        this.powerbi.embed(this.power['nativeElement'], this.config);
      });
      this.customersView.setPage({offset: 0});
      this.transactionsView.setPage({offset:0});
      this.campaignsView.setPage({offset:0});
      this.campaignsReportView.setPage({offset: 0});
    });
    this.fetch((data) => {
      this.rows = data;
      setTimeout(() => { this.loadingIndicator = false; }, 1500);
    });
    this.permissions = this._dataService.getPermissions();
  }

  ngOnInit() {
    this._dataService.getDashboard({}).subscribe(data => {
      console.log(data);
    //  if(data.error) {alert(data.error);}
      this.embed_token = data.embed_token;
      this.access_token = data.access_token;
      this.report_id = data.data['Report-id'];
      this.groupId = data.data['Group-id'];
      this.config = {
        // type: data.data['ReportType'],
        type: 'report',
        tokenType: this.models.TokenType.Embed,
        permissions: this.models.Permissions.All,
        accessToken: this.embed_token,
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + this.report_id + '&groupId=' + this.groupId,
        id: this.report_id
      };
      this.powerbi.embed(this.power['nativeElement'], this.config);

      this.callStaticPowebi();

      // this._dataService.getFixedDashboard({}).subscribe(data => {
      //   console.log('skssnsjfkfnksfsn',data);
      //   if(data.error) {alert(data.error);}
      //   this.embed_token = data.embed_token;
      //   this.access_token = data.access_token;
      //   this.report_id = data.data['Report-id'];
      //   this.groupId = data.data['Group-id'];
      //   this.config = {
      //     // type: data.data['ReportType'],
      //     type: 'report',
      //     tokenType: this.models.TokenType.Embed,
      //     permissions: this.models.Permissions.All,
      //     accessToken: this.embed_token,
      //     embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + this.report_id + '&groupId=' + this.groupId,
      //     id: this.report_id
      //   };
      //   this.powerbi.embed(this.fixedpower['nativeElement'], this.config);
      // });
      
    });


    /*
    this.chart = this.AmCharts.makeChart('amchart-2', {
      'type': 'pie',
      'theme': 'light',
      'dataProvider': [
        {
          'country': 'Lithuania',
          'litres': 501.9
        }, {
          'country': 'Czech Republic',
          'litres': 301.9
        }, {
          'country': 'Ireland',
          'litres': 201.1
        }, {
          'country': 'Germany',
          'litres': 165.8
        }, {
          'country': 'Australia',
          'litres': 139.9
        }, {
          'country': 'Austria',
          'litres': 128.3
        }, {
          'country': 'UK',
          'litres': 99
        }, {
          'country': 'Belgium',
          'litres': 60
        }, {
          'country': 'The Netherlands',
          'litres': 50
        }
      ],
      'pullOutRadius': 0,
      'labelRadius': -40,
      'valueField': 'litres',
      'titleField': 'country',
      'labelText': '[[litres]]',
      'balloon': {
        'fixedPosition': true
      }
    });
    */

  this.chart = this.AmCharts.makeChart('amchart-2', {
      'type': 'serial',
      'theme': 'light',
      //'autoMarginOffset':20,
      'dataDateFormat': 'YYYY-MM-DD HH:NN',
      'dataProvider': [
        {
          'date': '2012-01-01',
          'value': 8
        }, {
          'date': '2012-01-02',
          'color':'#CC0000',
          'value': 10
        }, {
          'date': '2012-01-03',
          'value': 12
        }, {
          'date': '2012-01-04',
          'value': 14
        }, {
          'date': '2012-01-05',
          'value': 11
        }, {
          'date': '2012-01-06',
          'value': 6
        }, {
          'date': '2012-01-07',
          'value': 7
        }, {
          'date': '2012-01-08',
          'value': 9
        }, {
          'date': '2012-01-09',
          'value': 13
        }, {
          'date': '2012-01-10',
          'value': 15
        }, {
          'date': '2012-01-11',
          'color':'#CC0000',
          'value': 19
        }, {
          'date': '2012-01-12',
          'value': 21
        }, {
          'date': '2012-01-13',
          'value': 22
        }, {
          'date': '2012-01-14',
          'value': 20
        }, {
          'date': '2012-01-15',
          'value': 18
        }, {
          'date': '2012-01-16',
          'value': 14
        }, {
          'date': '2012-01-17',
          'color':'#CC0000',
          'value': 16
        }, {
          'date': '2012-01-18',
          'value': 18
        }, {
          'date': '2012-01-19',
          'value': 17
        }, {
          'date': '2012-01-20',
          'value': 15
        }, {
          'date': '2012-01-21',
          'value': 12
        }, {
          'date': '2012-01-22',
          'color':'#CC0000',
          'value': 10
        }, {
          'date': '2012-01-23',
          'value': 8
        }
      ],
      'valueAxes': [{
        'axisAlpha': 0,
        'guides': [{
          'fillAlpha': 0.1,
          'fillColor': '#888888',
          'lineAlpha': 0,
          'toValue': 16,
          'value': 10
        }],
        'position': 'left',
        'tickLength': 0
      }],
      'graphs': [{
        'balloonText': '[[category]]<br><b><span style="font-size:14px;">value:[[value]]</span></b>',
        'bullet': 'round',
        'dashLength': 3,
        'colorField':'color',
        'valueField': 'value'
      }],
      'trendLines': [{
        'finalDate': '2012-01-11 12',
        'finalValue': 19,
        'initialDate': '2012-01-02 12',
        'initialValue': 10,
        'lineColor': '#CC0000'
      }, {
        'finalDate': '2012-01-22 12',
        'finalValue': 10,
        'initialDate': '2012-01-17 12',
        'initialValue': 16,
        'lineColor': '#CC0000'
      }],
      'chartCursor': {
        'fullWidth':true,
        'valueLineEabled':true,
        'valueLineBalloonEnabled':true,
        'valueLineAlpha':0.5,
        'cursorAlpha':0
      },
      'categoryField': 'date',
      'categoryAxis': {
        'parseDates': true,
        'axisAlpha': 0,
        'gridAlpha': 0.1,
        'minorGridAlpha': 0.1,
        'minorGridEnabled': true
      }
    });

  this.chart = this.AmCharts.makeChart('amchart-3', {
      'type': 'serial',
      'theme': 'light',
      //'autoMarginOffset':20,
      'dataDateFormat': 'YYYY-MM-DD HH:NN',
      'dataProvider': [
        {
          'date': '2012-01-01',
          'value': 8
        }, {
          'date': '2012-01-02',
          'color':'#CC0000',
          'value': 10
        }, {
          'date': '2012-01-03',
          'value': 12
        }, {
          'date': '2012-01-04',
          'value': 14
        }, {
          'date': '2012-01-05',
          'value': 11
        }, {
          'date': '2012-01-06',
          'value': 6
        }, {
          'date': '2012-01-07',
          'value': 7
        }, {
          'date': '2012-01-08',
          'value': 9
        }, {
          'date': '2012-01-09',
          'value': 13
        }, {
          'date': '2012-01-10',
          'value': 15
        }, {
          'date': '2012-01-11',
          'color':'#CC0000',
          'value': 19
        }, {
          'date': '2012-01-12',
          'value': 21
        }, {
          'date': '2012-01-13',
          'value': 22
        }, {
          'date': '2012-01-14',
          'value': 20
        }, {
          'date': '2012-01-15',
          'value': 18
        }, {
          'date': '2012-01-16',
          'value': 14
        }, {
          'date': '2012-01-17',
          'color':'#CC0000',
          'value': 16
        }, {
          'date': '2012-01-18',
          'value': 18
        }, {
          'date': '2012-01-19',
          'value': 17
        }, {
          'date': '2012-01-20',
          'value': 15
        }, {
          'date': '2012-01-21',
          'value': 12
        }, {
          'date': '2012-01-22',
          'color':'#CC0000',
          'value': 10
        }, {
          'date': '2012-01-23',
          'value': 8
        }
      ],
      'valueAxes': [{
        'axisAlpha': 0,
        'guides': [{
          'fillAlpha': 0.1,
          'fillColor': '#888888',
          'lineAlpha': 0,
          'toValue': 16,
          'value': 10
        }],
        'position': 'left',
        'tickLength': 0
      }],
      'graphs': [{
        'balloonText': '[[category]]<br><b><span style="font-size:14px;">value:[[value]]</span></b>',
        'bullet': 'round',
        'dashLength': 3,
        'colorField':'color',
        'valueField': 'value'
      }],
      'trendLines': [{
        'finalDate': '2012-01-11 12',
        'finalValue': 19,
        'initialDate': '2012-01-02 12',
        'initialValue': 10,
        'lineColor': '#CC0000'
      }, {
        'finalDate': '2012-01-22 12',
        'finalValue': 10,
        'initialDate': '2012-01-17 12',
        'initialValue': 16,
        'lineColor': '#CC0000'
      }],
      'chartCursor': {
        'fullWidth':true,
        'valueLineEabled':true,
        'valueLineBalloonEnabled':true,
        'valueLineAlpha':0.5,
        'cursorAlpha':0
      },
      'categoryField': 'date',
      'categoryAxis': {
        'parseDates': true,
        'axisAlpha': 0,
        'gridAlpha': 0.1,
        'minorGridAlpha': 0.1,
        'minorGridEnabled': true
      }
    });





















  
  
  console.log("About to invoke dashboard ... ");

  
  }
 
  callStaticPowebi(){
    this._dataService.getFixedDashboard({}).subscribe(data => {
      console.log('skssnsjfkfnksfsn',data);
    //  if(data.error) {alert(data.error);}
      this.embed_token = data.embed_token;
      this.access_token = data.access_token;
      this.report_id = data.data['Report-id'];
      this.groupId = data.data['Group-id'];
      this.config = {
        // type: data.data['ReportType'],
        type: 'report',
        tokenType: this.models.TokenType.Embed,
        permissions: this.models.Permissions.All,
        accessToken: this.embed_token,
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + this.report_id + '&groupId=' + this.groupId,
        id: this.report_id
      };
      this.powerbi.embed(this.fixedpower['nativeElement'], this.config);
    });
  }

  fetch(cb) {
      const req = new XMLHttpRequest();
      req.open('GET', 'assets/table-data.json?' + Math.random());

      req.onload = () => {
        cb(JSON.parse(req.response));
      };

      req.send();
  }
  addCustomer() {
    this.showOrHide = true;
    console.log("Is it working ...");
  }
  closeForm() {
    console.log("is it coming.....")
    this.showOrHide = false;
  }
}

