import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

/* export function forbiddenNameValidator(name: RegExp): ValidatorFn {
  return (control: FormControl): {[key: string]: any} => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
} */
@Component({
  selector: 'campaign-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
  host: {
    '[class.side-navbar]': 'true',
    '[class.open]': 'open'
  }
})
export class CampaignSideNavbarComponent implements OnInit, OnChanges {
  @Input() 
  title: string;
  open: boolean;
  @Input() showOrHide:boolean;
  @Input() model:any;
  @Output()
  public closeEvent:EventEmitter<Event> = new EventEmitter();
  @Output()
  public saveEvent:EventEmitter<any> = new EventEmitter();
  public campaignForm: FormGroup;
  triggerType:string;
  triggerValue:string;
  customValue:string;
  particularDate: string;
  isUpdate:Boolean = false;
  constructor(private fb: FormBuilder, ) {
    this.open = false;
  }

  close(event) {
    event.preventDefault();
    this.resetForm();
    this.closeEvent.next(event);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if("showOrHide" in changes){
      this.open = changes["showOrHide"].currentValue;
      if(this.model){
        this.isUpdate = true;
        let triggerValue = null, customValue=null, triggerValue1=null, particularDate=null;
        if(this.model.CampaignTrigger == "NotSeen") {
          if(this.model.TriggerValue == 10 
            || this.model.TriggerValue == 20
            || this.model.TriggerValue == 30
            || this.model.TriggerValue == 90
            || this.model.TriggerValue == 120
            || this.model.TriggerValue == 365) {
              triggerValue1 = this.model.TriggerValue;
            } else {
              triggerValue1 = "Custom";
              customValue = this.model.TriggerValue 
            }
        } else if(this.model.CampaignTrigger == "ParticularDate"){
          particularDate = this.model.TriggerValue; 
        } else {
          triggerValue = this.model.TriggerValue;
        }
        console.log("Model is ", this.model)
        this.campaignForm.patchValue({
          campaignName: this.model.CampaignName,
          triggerType: this.model.CampaignTrigger,
          particularDate: particularDate,
          customValue: customValue,
          triggerValue1: triggerValue1,
          campaignText: this.model.CampaignText,
          triggerValue: triggerValue,
          campaignRuleId: this.model.CampaignRuleId
        });
      }
    }
  }

  validateTriggerValue(fieldName:string): ValidatorFn {
    let thisObj = this;
    return (control: FormControl): {[key: string]: any} => {
      if(fieldName == 'triggerType'){
        if(thisObj.campaignForm && thisObj.campaignForm.controls['particularDate']) {
          thisObj.campaignForm.controls['particularDate'].reset({onlySelf:true});
        }
        return null;
      } else if(fieldName == 'triggerValue'){
        if(thisObj.campaignForm && thisObj.campaignForm.controls['particularDate']) {
          thisObj.campaignForm.controls['particularDate'].reset({onlySelf:true});
        }
        if(control.value){
          return control.value.length > 1 ? null : { required: true };
        }
        return { required: true };
      } else if(fieldName == 'triggerValue1'){
        if(thisObj.campaignForm && thisObj.campaignForm.controls['particularDate'])
          thisObj.campaignForm.controls['particularDate'].reset();
        if(control.value) {
          return control.value.length > 1 ? null : { required: true };
        }
        if(thisObj.campaignForm && thisObj.campaignForm.controls['triggerValue'].value === 'Custom') {
          return { required: true };
        }
        return null;
      } else if(fieldName == 'particularDate'){
        if(control.value) {
          if(thisObj.campaignForm.controls['triggerType'].value !== 'ParticularDate'){
            return null;
          }
          return control.value.length > 1 ? null : { required: true };
        } 
        return null;
      } else if(fieldName == 'customValue'){
        if(control.value) {
          if(thisObj.campaignForm.controls['triggerType'].value == 'NotSeen' && thisObj.campaignForm.controls['triggerType1'].value == 'custom'){
            return control.value && control.value.length > 1 ? null : { required: true };
          } else {
            return null;
          }
        } 
        return null;
      }
      return null;
    };
  } 

  ngOnInit() {
    this.campaignForm = this.fb.group({
      campaignName: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      triggerType: [null, Validators.compose([Validators.required, this.validateTriggerValue('triggerType')])],
      customValue: [null, [this.validateTriggerValue('customValue')]],
      triggerValue:[null, [this.validateTriggerValue('triggerValue')]],
      triggerValue1:[null, [this.validateTriggerValue('triggerValue1')]],
      particularDate:[null, [this.validateTriggerValue('particularDate')]],      
      campaignText: [null, Validators.compose([Validators.required, Validators.minLength(30), Validators.maxLength(500)])]
    });

  }

  changeFieldValue(value, field){
    console.log("New value is ", value)
    this.campaignForm.controls[field].setValue(value, {onlySelf:true})
    console.log("Has error ", this.campaignForm.controls['triggerType'].hasError('required'))
  }
  updateCampaign(event:Event){
    let updateModel = {
      "campaignName"  : this.campaignForm.value.campaignName,
      "campaignType"  : "sms",
      triggerType     : this.campaignForm.value.triggerType,
      triggerValue    : "",
      campaignText    : this.campaignForm.value.campaignText,
      campaignRuleId  : this.model.CampaignRuleId
    }
    if(this.campaignForm.value.triggerType == "NotSeen" && this.campaignForm.value.triggerType1 == "Custom") {
      updateModel.triggerValue = this.campaignForm.value.customValue;
    } else if(this.campaignForm.value.triggerType == "ParticularDate") {
      updateModel.triggerValue = this.campaignForm.value.particularDate;
    } else {
      updateModel.triggerValue = this.campaignForm.value.triggerValue;
    }
    this.saveEvent.next([updateModel, this.isUpdate,function(){
      this.resetForm();
    }]);
  }
  saveCampaign(event:Event){
    let model = {
      "campaignName" : this.campaignForm.value.campaignName,
      "campaignType" : "sms",
      triggerType    : this.campaignForm.value.triggerType,
      triggerValue   : "",
      campaignText : this.campaignForm.value.campaignText
    }
    if(this.campaignForm.value.triggerType == "NotSeen" && this.campaignForm.value.triggerType1 == "Custom") {
      model.triggerValue = this.campaignForm.value.customValue;
    } else if(this.campaignForm.value.triggerType == "ParticularDate") {
      model.triggerValue = this.campaignForm.value.particularDate;
    } else {
      model.triggerValue = this.campaignForm.value.triggerValue;
    }
    console.log("Save Model is ", model);
    this.saveEvent.next([model, this.isUpdate, function(){
      this.resetForm();
    }]);
  }

  resetForm() {
    this.campaignForm.reset();
    this.triggerType = null;
    this.triggerValue = null;
    this.customValue = null;
    this.particularDate = null;
  }
}
