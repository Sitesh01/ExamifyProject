import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  currentUser!: User;

  menuOpen: boolean = false;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated$.value;
    this.authService.isAuthenticated.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  adminLoggedIn(): boolean {
    return (
      this.currentUser['data'].user.role === 'admin' ||
      this.currentUser['data'].user.role === 'moderator'
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
