import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
@Component({
  selector: 'addition-navbar',
  templateUrl: './addition-navbar.component.html',
  styleUrls: ['./addition-navbar.component.scss'],
  host: {
    '[class.addition-navbar]': 'true',
    '[class.open]': 'open'
  }
})
export class AdditionNavbarComponent implements OnInit, OnChanges {
  @Input() 
  title: string;
  open: boolean;
  @Input() showOrHide:boolean;
  @Output()
  public closeEvent:EventEmitter<Event> = new EventEmitter();
  @Output()
  public saveEvent:EventEmitter<any> = new EventEmitter();
  public customerForm: FormGroup;

  constructor(private fb: FormBuilder, ) {
    this.open = false;
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

    this.customerForm = this.fb.group({
      firstName: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      lastName: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(30)])],      
      email: [null, Validators.compose([Validators.required, CustomValidators.email])],
      primaryPhone: [null, Validators.compose([Validators.required, CustomValidators.phone('IN')])],
      secondaryPhone:[null],
      companyName: [null],
      addressLine1: [null],
      state: [null],
      addressLine2: [null],
      city:[null],
      country: [null],
      pinCode:[null]
    });
  }

  saveCustomer(event:Event){
    this.saveEvent.next(this.customerForm.value);
  }

}
