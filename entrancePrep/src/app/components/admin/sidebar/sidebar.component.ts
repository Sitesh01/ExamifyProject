import { Component } from '@angular/core';
import { ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { environment as config } from '../../../../environments/environment';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  navbarActive = true;

  constructor() {}

  ngOnInit(): void {
    //if screen size is less than 768px, navbarActive is set to false
    if (window.innerWidth < 768) {
      this.navbarActive = false;
    }
  }

  toggleNavbar(): void {
    this.navbarActive = !this.navbarActive;
  }

  activateNavbar(): void {
    if (!this.navbarActive) {
      this.navbarActive = true;
    }
  }
}
