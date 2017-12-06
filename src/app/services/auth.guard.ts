import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';
import { DataService } from './data.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: DataService, private router: Router) {}
  canActivate() {
    // If the user is not logged in we'll send them back to the home page
    if (!this.auth.authenticated) {
      this.router.navigate(["/extra-layout/sign-in"]);
      return false;
    }
    return true;
  }

}