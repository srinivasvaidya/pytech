import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppGlobals } from '../../../app.globals';
import { DataService } from '../../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PermissionService } from 'angular2-permission';

@Component({
    selector: 'page-sign-in-1',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss']
})
export class FeedBackComponent implements OnInit {
    private merchantBranchId: number;
    private custFeedbackId: number;
    private showLogin: Boolean = false;
    private feedbackQuestions = [];
    private feedback = [];

    constructor(private _service: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private _permissionService: PermissionService,
        private _global: AppGlobals) {
    }

    ngOnInit() {
        let thisObj = this;
        this.route.params.subscribe(params => {
            this.merchantBranchId = parseInt(params['merchantBranchId']);
            this.custFeedbackId = parseInt(params['custFeedbackId']);
        });
        var getQuestionModel = { merchantBranchId: this.merchantBranchId, custFeedbackId: this.custFeedbackId }
        thisObj._service.getFeedbackQuestionsService(getQuestionModel, () => {
        })
            .subscribe(
            res => {
                if (res.data && res.data.length == 0) {
                    thisObj.router.navigate(["/extra-layout/page-404"]);
                } else {
                    this.feedbackQuestions = res.data;
                    for (var v in this.feedbackQuestions) // for acts as a foreach  
                    {
                        this.feedback.push({
                            storeCustomerId: 0,
                            customerInvoiceId: "",
                            merchantBranchId: 0,
                            questionNum: 0,
                            feedback: "",
                            phoneNumber: "",
                            rating: 9
                        });
                    }
                    console.log(res.data);
                }
            },
            err => {
                console.log(err);
                thisObj.router.navigate(["/extra-layout/page-404"]);
            }
            );
    }

    onSubmit(feedback, form) {
        if (form.valid) {
            let thisObj = this;
            var phoneNumber;
            for (let i = 0; i < this.feedback.length; i++) {
                if (i == 0) {
                    phoneNumber = this.feedback[i]["phoneNumber"];
                }
                this.feedback[i]["phoneNumber"] = phoneNumber;
                this.feedback[i]["questionNum"] = this.feedbackQuestions[i].QuestionNumber;

                this.feedback[i]["merchantBranchId"] = this.merchantBranchId;
                this.feedback[i]["custFeedbackId"] = this.custFeedbackId;
                thisObj._service.addFeedback(this.feedback[i], () => {
                })
                    .finally(() => {
                        if (i == (this.feedback.length - 1)) {
                            alert("Thank you for your valuable feedback");
                        }
                    }
                    )
                    .subscribe(
                    data => {
                        if (i == (this.feedback.length - 1)) {
                            thisObj.router.navigate(["/default-layout/dashboard"]);
                        }
                    },
                    error => {
                        alert("Something went wrong... Please try again " + error);
                    }
                    );
            }
        }
    }
}
