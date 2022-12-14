import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  removeAlert,
  setAlert,
} from 'src/app/store/features/alert/alert.reducers';
import {
  decreaseRating,
  decreaseScore,
  increaseRating,
  increaseScore,
  setAppraise,
} from 'src/app/store/features/reviews/review.actions';
import { initialState } from 'src/app/store/features/reviews/review.reducers';
import { IReview } from 'src/app/store/features/reviews/types';
import { store } from 'src/app/store/store';
import { ReviewService } from './review.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  constructor(
    private stores: Store<typeof store>,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  @Output('alert') alert: EventEmitter<any> = new EventEmitter();
  review: IReview = initialState;

  ngOnInit(): void {
    this.stores.select('reviewReducer').subscribe({
      next: (value) => {
        const newValue = value as unknown as IReview;
        this.review = newValue;
      },
    });
  }

  getEntries(data: IReview) {
    if (data.developmentObjective) {
      return Object.entries(data.developmentObjective.fields) as [string, any];
    } else {
      return Object.entries(data.performanceObjective.fields) as [string, any];
    }
  }

  onAppraiseReview() {
    this.stores.dispatch(setAppraise({ payload: 'true' }));
    this.reviewService.onAppraiseReview(this.review).subscribe({
      next: () => {
        this.stores.dispatch(
          setAlert({ payload: 'feedback sent successfully' })
        );
        setTimeout(() => this.stores.dispatch(removeAlert()), 3000);
        this.router.navigate(['/manager']);
      },
    });
  }

  increase_score() {
    this.stores.dispatch(increaseScore());
  }
  decrease_score() {
    this.stores.dispatch(decreaseScore());
  }

  increase_rating() {
    this.stores.dispatch(increaseRating());
  }
  decrease_rating() {
    this.stores.dispatch(decreaseRating());
  }

  onLogout() {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/auth_manager']);
  }
}
