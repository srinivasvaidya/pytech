import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppGlobals } from '../../../app.globals';
import { DataService } from '../../../services/data.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PermissionService } from 'angular2-permission';

@Component({
  selector: 'page-sign-in-1',
  templateUrl: './sign-in-1.component.html',
  styleUrls: ['./sign-in-1.component.scss']
})
export class PageSignIn1Component implements OnInit {
  private userName:string = "";
  private password:string = "";
  private showLogin:Boolean = false;
  constructor(private _service: DataService,
              private router: Router,
              private _permissionService: PermissionService,
              private _global: AppGlobals){
  }

  ngOnInit() { 
    if(this._service.authenticated){
      this.router.navigate(["/default-layout/dashboard"]);
    } else {
      this.showLogin = true;
    }
  }

  onSubmit() {
    let thisObj = this;
    thisObj._service.login(
         thisObj.userName, 
         thisObj.password, () => {
         thisObj.router.navigate(["/default-layout/dashboard"]);  
    });
  } 
}
