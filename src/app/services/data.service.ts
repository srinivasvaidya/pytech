import {BaseService} from './base.service';
import { Injectable,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, ObservableInput } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { AppGlobals } from '../app.globals';
import { Page } from '../models/page';
import { PermissionService } from 'angular2-permission';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {
  private baseUrl = "/";
  private loginUrl = "login";
  private restBasePrefix = "api/v1/";
  private dashboardUrl = "dashboard";
  private fixeddashboardUrl = "dashboard/fixedpowerbi";
  private customersUrl = "customers";
  private transactionsUrl = "transactions";
  private saveTransactionsUrl = "transactions/add";
  private campaignsUrl = "campaigns";
  private campaignReportUrl  = "campaignreport";
  private campaignReportSearchUrl = "campaignreport/search";
  private campaignsSearchUrl = "campaigns/search";
  private customersSearchUrl = "customers/search";
  private campaignsDeleteUrl = "campaigns/delete";
  private saveCustomerUrl = "customers/add";
  private searchByMobileUrl = "customers/searchByMobile";
  private saveCampaignUrl = "campaigns/add";
  private updateCampaignUrl = "campaigns/update";
    private addFeedbackUrl = "feedback/addfeedback";
    private getFeedbackQuestionsUrl = "feedback/getQuestionsByMerchantIdFId";
    private getFeedbackQuestionsByMIdUrl = "feedback/getQuestionsByMerchantId";
    private addFeedbackQuestionsUrl = "feedback/addquestions"
    private deleteFeedbackQuestionsUrl = "feedback/deletequestion";
    private getCustomerFeedbacksByMIdUrl = "feedback/customerFeedbacksByMId";
    private deleteCustomerFeedbackUrl = "feedback/deletefeedback";
    private sendSMSUrl = "sms/sendSMS";
    private getCustomerInfo = "sms/getCustomerInfo";

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  loggedInData;
  // Default permissions
  permissions:any =  {
    "campaignsReport" : {
      "show" : false,
    },

    "campaigns" : {
      show: true,
      add:  false,
      edit: false
    },

    transactions : {
      show: true,
      add:  true,
      edit: true
    },

    customers : {
      show: true,
      add:  true,
      edit: true
    }
  }

  constructor(protected router: Router,
              protected _permissionService: PermissionService,
              protected _global: AppGlobals, protected http:Http) {
     console.log("[dataservice] Login status ", this.authenticated);
    if (this.authenticated) {
      this.setLoggedIn(true);
    }
  }
getBaseUrl() {
    if(window.location.port == "4200") {
        return "http://localhost:4300/"
    }
    return this.baseUrl;
}
getNonRestUrl(endpoint){
    return this.getBaseUrl() + endpoint
}

getUrl(endpoint) {
    return this.getBaseUrl() + this.restBasePrefix + endpoint
}

getOptions(isSingle:Boolean):any {
    let token = this._getToken();
    let merchantBranchId = this._getMerchantId();
    if(isSingle){
        merchantBranchId = JSON.parse(merchantBranchId);
        console.log(merchantBranchId);
        if(Array.isArray(merchantBranchId))
            merchantBranchId = merchantBranchId[0]
    }
    let headers = new Headers({
            'Content-Type': 'application/json',
            token: token,
            merchantBranchId: merchantBranchId
        });
    let options = new RequestOptions({headers: headers});
    return options;
}
authenticate(data) {
    let thisObj = this;
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.getUrl(this.loginUrl), data, this.getOptions(true))
            .map(function(res) {
                  return  thisObj.extractData(res);
                })
            .catch(this.handleError)
}

saveCustomer(model) {
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.saveCustomerUrl), model, this.getOptions(true))
        .map(function(res) {
                return thisObj.extractData(res);
        })
        .catch((res, caught: Observable<any>):ObservableInput<any> => {
            return this.handleError(res);
        });
}

getDashboard(data) {
    let thisObj = this;
    return this.http.post(this.getUrl(this.dashboardUrl), data, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

getFixedDashboard(data) {
    let thisObj = this;
    return this.http.post(this.getUrl(this.fixeddashboardUrl), data, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

saveTransaction(model) {
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.saveTransactionsUrl), model, this.getOptions(true))
        .map(function(res) {
                return thisObj.extractData(res);
        })
        .catch((res, caught: Observable<any>):ObservableInput<any> => {
            return this.handleError(res);
        });
}

getTransactions(page:Page) {
    let thisObj = this;
    delete page.searchTerm;
    return this.http.post(this.getNonRestUrl(this.transactionsUrl), page, this.getOptions(false))
        .map(function(res) {
                return thisObj.extractData(res);
        })
        .catch((res, caught: Observable<any>):ObservableInput<any> => {
            return this.handleError(res);
        });
}

getCustomers(page:Page){
    let thisObj = this;
    delete page.searchTerm;
    return this.http.post(this.getNonRestUrl(this.customersUrl), page, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

searchByMobile(phSearchStr){
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.searchByMobileUrl), {searchStr: phSearchStr}, this.getOptions(true))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

getCustomersSearch(page:Page, searchTerm){
    let thisObj = this;
    page.searchTerm = searchTerm;
    return this.http.post(this.getNonRestUrl(this.customersSearchUrl), page, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

updateCampaign(model){
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.updateCampaignUrl), model, this.getOptions(true))
        .map(function(res) {
                return thisObj.extractData(res);
        })
        .catch((res, caught: Observable<any>):ObservableInput<any> => {
            return this.handleError(res);
        });
}
saveCampaign(model) {
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.saveCampaignUrl), model, this.getOptions(true))
        .map(function(res) {
                return thisObj.extractData(res);
        })
        .catch((res, caught: Observable<any>):ObservableInput<any> => {
            return this.handleError(res);
        });
}

getCampaignReport(page:Page){
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.campaignReportUrl), page, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}


/* getCampaignReportSearch(page:Page, searchTerm){
    let thisObj = this;
    page.searchTerm = searchTerm;
    return this.http.post(this.getNonRestUrl(this.campaignRulesSearchUrl), page, this.getOptions())
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}
 */

getCampaigns(page:Page){
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.campaignsUrl), page, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}


getCampaignsSearch(page:Page, searchTerm){
    let thisObj = this;
    page.searchTerm = searchTerm;
    return this.http.post(this.getNonRestUrl(this.campaignsSearchUrl), page, this.getOptions(false))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}

deleteCampaign(ruleId){
    let thisObj = this;
    return this.http.post(this.getNonRestUrl(this.campaignsDeleteUrl), {ruleId: ruleId}, this.getOptions(true))
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch((res, caught: Observable<any>):ObservableInput<any> => {
                return this.handleError(res);
            });
}


/*getTenants(page) {
    let thisObj = this;
    //let body = values + "&grant_type=password";
    let body = "";
    for(let item in page) {
        body += item + "=" + page[item] + "&";
    }
    this._appGlobals.token.subscribe(value => token = value);
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded', token: token});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.getUrl(this.tenantsUrl), body, this.getOptions())
            .map(function(res) {
                    return thisObj.extractData(res);
            })
            .catch(this.handleError)
}
 */
private extractData(res: Response) {
    let body = res.json();
    if("status" in body){
        if(body["status"] == "ERROR"){
            if(body["errorCode"] == 'CCA001'){
                // Redirect to Login screen
                console.log("Redirecting to login screen " + this.router)
                this.router.navigate(['/extra-layout/sign-in']);
            }
        }
    }
    return body;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    console.log(error)
    if (error instanceof Response) {

      if(error.status == 401){
          this.clearSession();
          this.router.navigate(['/extra-layout/sign-in']);
          return Observable.of([])
      }
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  setSession(token, role, merchantBranchId, user, branches) {
    // Save session data and update login status subject
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('profile', role);
    localStorage.setItem('merchantBranchId', JSON.stringify([merchantBranchId]));
    localStorage.setItem('branches', JSON.stringify(branches));
  }

  clearSession() {
      // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('merchantBranchId');
    localStorage.removeItem('user');
    localStorage.removeItem('branches');
  }



  setLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login(userName:string, password:string, callback: () => any) {
    this.authenticate({userName: userName, password: password}).subscribe(
        data => {
            if(!("jwt" in data)){
                alert("Error while authenticating " + data["message"])
            } else {
                this._setSession(data["jwt"], data["role"], data["merchantBranchId"], data["user"], data["branches"]);
                this._permissionService.define([data["role"]]);
                console.log("Loaded permissions are ", data["permissions"]);
                this.setPermissions(data["permissions"])
                callback();
            }
        },
        error => {
            alert("Authentication failed. " + error);
        }
    )
  }

  private _getToken():string {
      let token = localStorage.getItem('token');
      console.log("[_getTOken] Token is ", token);
      return token;
  }

  private _setSession(token, role, merchantBranchId, user, branches) {
    // Save session data and update login status subject
    this.setSession(token, role, merchantBranchId, user, branches);
    this._global.setToken(token);
    this.setLoggedIn(true);
  }
  _getUser() {
      return JSON.parse(localStorage.getItem('user'));
  }
  _getMerchantId() {
      return localStorage.getItem('merchantBranchId');
  }

  _setMerchantId(merchantBranchId) {
      return localStorage.setItem('merchantBranchId', merchantBranchId);
  }
  getBranches() {
      return JSON.parse(localStorage.getItem("branches"));
  }
  logout(redirect:boolean) {
    this.clearSession();
    this.setLoggedIn(false);
    if(redirect){
        this.router.navigate(['/extra-layout/sign-in']);
    }
  }

  get authenticated() {
    return localStorage.getItem('token') && localStorage.getItem('merchantBranchId') ? true : false;
  }

  getPermissions() {
      return this.permissions;
  }

  setPermissions(permissions) {
      this.permissions = permissions;
      this.permissionsChange$.emit(this.permissions);
  }

  public permissionsChange$:EventEmitter<any> = new EventEmitter();

    addFeedback(feedbackDetails, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.addFeedbackUrl), feedbackDetails, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)

    }

    getFeedbacksFromCustomersService(callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.getCustomerFeedbacksByMIdUrl), {}, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }

    getFeedbackQuestionsService(model, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.getFeedbackQuestionsUrl), model, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }

    getFeedbackQuestionsByMIdService(callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.getFeedbackQuestionsByMIdUrl), {}, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }

    addFeedbackQuestions(feedbackQuestions, callback: () => any) {
        let thisObj = this;
        this.http.post(this.getNonRestUrl(this.addFeedbackQuestionsUrl), feedbackQuestions, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
            .subscribe(
            data => {
                callback();
            },
            error => {
                alert("Authentication failed. " + error);
            }
            )
    }

    deleteQuestion(feedbackQuestionId, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.deleteFeedbackQuestionsUrl), { id: feedbackQuestionId }, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }
    deleteFeedback(id, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getNonRestUrl(this.deleteCustomerFeedbackUrl), { id: id }, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }

    sendSMS(smsModel, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getUrl(this.sendSMSUrl), smsModel, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }

    getCustomerInfoBySId(storeCustomerId, callback: () => any) {
        let thisObj = this;
        return this.http.post(this.getUrl(this.getCustomerInfo), {StoreCustomerId : storeCustomerId}, this.getOptions(true))
            .map(function (res) {
                return thisObj.extractData(res);
            })
            .catch(this.handleError)
    }
}
