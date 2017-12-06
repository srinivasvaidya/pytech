import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { DataService }      from '../../../../services/data.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { Subject } from 'rxjs/Subject';
import { Page } from '../../../../models/page';

@Component({
  selector: 'transaction-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
  host: {
    '[class.addition-navbar]': 'true',
    '[class.open]': 'open'
  }
})
export class TransactionSideNavbarComponent implements OnInit, OnChanges {
  @Input() 
  title: string;
  open: boolean;
  @Input() showOrHide: boolean;
  @Input() isUpload: boolean;
  @Input() isSendSMS: boolean;
  @Input() selected: any[];
  @Input() page: Page;
  @Output()
  public closeEvent:EventEmitter<any> = new EventEmitter();
  @Output()
  public saveEvent: EventEmitter<any> = new EventEmitter();
  private smsForm: FormGroup;
  days: Array<number>;
  months: Array<string> = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  constructor(private fb: FormBuilder, private _dataService: DataService) {
    this.open = false;
    this.days = Array<number>(31);
  }

  close(event) {
    event.preventDefault();
    this.closeEvent.next(event);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if("showOrHide" in changes){
      this.open = changes["showOrHide"].currentValue;
    }
  }

  ngOnInit() {
    /*
      range: [null, Validators.compose([Validators.required, CustomValidators.range([5, 9])])],
      url: [null, Validators.compose([Validators.required, CustomValidators.url])],
      date: [null, Validators.compose([Validators.required, CustomValidators.date])],
      creditCard: [null, Validators.compose([Validators.required, CustomValidators.creditCard])],
      phone: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
    gender: [null, Validators.required],
    
    state: [null],
    addressLine2: [null],
    city:[null],
    country: [null],
    zip:[null],
    birthDay:[null],
    birthMonth:[null],
    annivDay:[null],
    annivMonth:[null] 
    
          */
    this.smsForm = this.fb.group({
      campaignName: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(15)])],
      campaignText: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(320)])],
      contentRadioValue: [null]
    });

  }

  sendSMS() {
    var smsFrm = this.smsForm.value;
    smsFrm.triggerType = this.page.size
    smsFrm.triggerValue = this.page.size
    var smsObj = {
      smsCampaign: smsFrm,
      customer: this.selected
    }
    this._dataService.sendSMS(smsObj, () => {
    }).subscribe(
      data => {
        this.resetSMS();
        this.closeEvent.next(["RELOAD"]);
      },
      err => {
        this.resetSMS();
        this.closeEvent.next(["RELOAD"]);
        console.log(err);
      }
      );
  }

  resetSMS() {
    this.smsForm.reset();
  }
  
  handleChangeContent(e) {
    var frm = this.smsForm.value;
    if(e.target.checked){
      var txt = "Dear Customer,";
      if(frm.campaignText && frm.campaignText != null && frm.campaignText.length > 0)
      {
        txt += frm.campaignText;
      }
      this.smsForm.controls['campaignText'].setValue(txt, {onlySelf: true}); 
      //"Dear Customer," + this.smsForm.controls['campaignText']; 
    }else{
      this.smsForm.controls['campaignText'].setValue(frm.campaignText ? frm.campaignText.replace("Dear Customer,",""):frm.campaignText, {onlySelf: true}); 
    }
  }
}
