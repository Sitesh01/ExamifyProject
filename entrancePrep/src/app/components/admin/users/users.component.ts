import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserEditDialogComponent } from '../user-add-edit-dialog/user-edit-dialog.component';
import { VerifyDialogComponent } from '../../common/utilities/verify-dialog/verify-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  users: any = [];
  allUsers: any = [];
  roles = ['admin', 'user', 'moderator'];
  displayedColumns = ['username', 'email', 'role', 'createdAt', 'actions'];
  public searchText = '';

  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  public get filteredUsers() {
    if (!this.searchText) {
      return this.allUsers;
    }
    return this.allUsers.filter((user: any) => {
      const search = this.searchText.toLowerCase();
      return (
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    });
  }

  getAllUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log("data in users", this.users);
        this.allUsers = this.users.data.users;
        console.log("data.data.users: ", this.allUsers);
        this.apiService.loader.next(false);
      },
      error: (err) => {
        this._snackBar.open('✖ ' + err.error.message, 'X', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
      },
    });
  }

  filterData() {
    const searchText = this.searchText.toLowerCase();
    this.users = this.allUsers.filter((user: any) => {
      const username = user.username.toLowerCase();
      const email = user.email.toLowerCase();
      const role = user.role.toLowerCase();
      const createdAt = user.createdAt.toLowerCase();
      const searchTerms = [username, email, role, createdAt];
      return searchTerms.some((term) => term.includes(searchText));
    });
  }

  addUser() {
    const header = 'Add';
    const btnAction = 'Create';
    const isEdit = false;
    this.dialog
      .open(UserEditDialogComponent, {
        width: '500px',
        data: { header, btnAction, isEdit },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.value === 'user added') {
          this._snackBar.open('✔ Added successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.getAllUsers();
          this.apiService.loader.next(false);
        }
      });
  }

  removeData() {}

  onEdit(element: any) {
    this.dialog
      .open(UserEditDialogComponent, {
        width: '500px',
        data: {
          header: 'Edit',
          btnAction: 'Update',
          isEdit: true,
          dataValue: element,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.value === 'user updated') {
          this._snackBar.open('✔ Updated successfully', 'X', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.getAllUsers();
          this.apiService.loader.next(false);
        }
      });
  }

  onDelete(userId: any) {
   this.dialog.open(VerifyDialogComponent, {
      width: '500px',
      data: {
        title: 'delete this user',
          message: 'This action will hard delete this user from the system.',
          btnAction: 'Yes',
          taskToDO: 'deleteUser',
          dataValue: userId,
      },
    }).afterClosed().subscribe((result) => {
      if (result.value === 'user deleted') {
        this._snackBar.open('✔ Deleted successfully', 'X', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        this.getAllUsers();
        this.apiService.loader.next(false);
      }
    }
    );

  }
}
