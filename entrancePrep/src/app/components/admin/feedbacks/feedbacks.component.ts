import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.scss'],
})
export class FeedbacksComponent {
  feedbackList: any = [];

  constructor(private apiService: ApiService, private _snackBar: MatSnackBar, private feedbackApiService: FeedbackService) {}

  ngOnInit(): void {
    this.getFeedbackByUserDetails();
  }

  getFeedbackByUserDetails() {
    this.feedbackApiService.getFeedbackByUserDetails().subscribe({
      next: (data) => {
        this.feedbackList = data.data.feedbacks;
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(error.error.message, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
}
