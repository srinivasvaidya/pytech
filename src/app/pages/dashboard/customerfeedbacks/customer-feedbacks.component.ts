import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'customer-feedbacks',
    templateUrl: './customer-feedbacks.component.html',
    styleUrls: ['./customer-feedbacks.component.scss']
})
export class CustomerFeedbacksComponent implements OnInit {
    private custFeedbacks: any = [];
    private isLoaded:any = false;
    constructor(private fb: FormBuilder, private _dataService: DataService,
        private zone: NgZone, private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.getFeedbacks();
    }
    getFeedbacks() {
        let thisObj = this;
        thisObj._dataService.getFeedbacksFromCustomersService(() => {
        })
            .subscribe((res) => {
                this.custFeedbacks = res.data;
            });
    }
    
    ngAfterViewInit () {
            this.isLoaded = !this.isLoaded;
            this.zone.run(() => {
            this.getFeedbacks();
        });
    }
    deleteFeedback(feedback) {
        let thisObj = this;
        thisObj._dataService.deleteFeedback(feedback.CustomerFeedbackId, () => {
        })
            .subscribe(
            res => {
                var index = this.custFeedbacks.indexOf(feedback, 0);
                if (index > -1) {
                    this.custFeedbacks.splice(index, 1);
                    this.getFeedbacks();
                }
            },
            err => {
                console.log(err);
            }
            );
    }
}
