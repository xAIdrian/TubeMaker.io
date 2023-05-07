import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigateToTitleDetails() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private router: Router) {

  }

  navigateToResults() {
    this.router.navigate(['legion/details']);
  }

  navigateToCreateVideo() {
    this.router.navigate(['z/create']);
  }

  navigateToUploadVideo() {
    this.router.navigate(['legion/upload']);
  }

  navigateToLander() {
    this.router.navigate(['lander']);
  }

  navigateToCopyCat() {
    this.router.navigate(['legion/copycat']);
  }

  navigateToExtractDetails() {
    this.router.navigate(['legion/copycat/details']);
  }
}
