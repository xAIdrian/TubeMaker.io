import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  
  constructor(private router: Router) {}

  navigateToResults() {
    this.router.navigate(['/youtubeauto/results']);
  }

  navigateToCreateVideo() {
    this.router.navigate(['youtubeauto/create']);
  }

  navigateToUploadVideo() {
    this.router.navigate(['youtubeauto/upload']);
  }
}
