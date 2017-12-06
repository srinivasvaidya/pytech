import { Injectable,EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {
  // Observable string sources
  private emitChangeSource = new Subject();
  public branchChange$:EventEmitter<any> = new EventEmitter();
  private currentBranchId:string = "";
  // Observable string streams
  changeEmitted$ = this.emitChangeSource.asObservable();

  // Service message commands
  emitChange(change: string) {
    this.emitChangeSource.next(change);
  }

  public changeBranch(branchId:string) {
    console.log("changeBranch ", branchId)
    this.currentBranchId = branchId;
    this.branchChange$.emit(this.currentBranchId);
  }


}