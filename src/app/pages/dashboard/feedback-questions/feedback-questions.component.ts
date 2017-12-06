import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppGlobals } from '../../../app.globals';
import { DataService } from '../../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PermissionService } from 'angular2-permission';

@Component({
    selector: 'feedback-questions',
    templateUrl: './feedback-questions.component.html',
    styleUrls: ['./feedback-questions.component.scss']
})
export class FeedBackQuestionsComponent implements OnInit {
    private merchantBranchId: number;
    private custFeedbackId: number;
    private feedbackQuestions = [];
    private feedbackQuestionModel = {};

    constructor(private _service: DataService,
        private router: Router,
        private zone: NgZone,
        private route: ActivatedRoute,
        private _permissionService: PermissionService,
        private _global: AppGlobals) {
    }

    ngOnInit() {
        this.addQuestionAndSetupQuestions();
    }
    addQuestionAndSetupQuestions() {
        this.feedbackQuestionModel = {
            customerFeedbackId: 1,
            questionText: "",
            questionWeight: 10,
        };

        let thisObj = this;
        var getQuestionModel = { merchantBranchId: this.merchantBranchId, custFeedbackId: this.custFeedbackId }
        thisObj._service.getFeedbackQuestionsByMIdService(() => {
        })
            .subscribe((res) => {
                this.zone.run(() => {
                    this.feedbackQuestions = res.data;
                });
            });
    }
    onSubmit(feedback, form) {
        if (form.valid) {
            let thisObj = this;
            thisObj._service.addFeedbackQuestions(feedback, () => {
                this.zone.run(() => {
                    form.resetForm();
                    setTimeout(() => {
                        this.addQuestionAndSetupQuestions();
                    }, 500);
                });
            });
        }
    }
    deletQuestion(question) {
        let thisObj = this;
        thisObj._service.deleteQuestion(question.QuestionNumber, () => {
        }).subscribe(
            res => {
                var index = this.feedbackQuestions.indexOf(question, 0);
                if (index > -1) {
                    this.feedbackQuestions.splice(index, 1);
                    this.addQuestionAndSetupQuestions();
                }
            },
            err => {
                console.log(err);
            }
            );
    }
}
