import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header-component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;

  isAuthenticated: boolean = false;
  userId: string;
  userName: string;
  userDetailsListenerSubs: Subscription;
  constructor(private authService: AuthService) {
    if (localStorage.getItem('userId') !== null) {
      this.userId = localStorage.getItem('userId');
      authService.getUserById(this.userId).subscribe((userData) => {
        this.userName = userData.username;
      });
    }
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.getIsUserAuthenticated();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      });
    this.userDetailsListenerSubs = this.authService
      .getUserDetailsListener()
      .subscribe((userData) => {
        this.userId = userData;

        if (this.isAuthenticated) {
          this.authService.getUserById(this.userId).subscribe((userData) => {
            this.userName = userData.username;
          });
        }
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.userDetailsListenerSubs.unsubscribe();
  }
}
