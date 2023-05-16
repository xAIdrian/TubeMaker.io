import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  
  constructor(
    private router: Router
  ) { /** */ }
  
  navigateToCreateVideo() {
    this.router.navigate(['maker/auto']);
  }

  navigateToResults() {
    this.router.navigate(['maker/auto/details']);
  }

  navigateToUploadVideo() {
    this.router.navigate(['maker/auto/upload']);
  }

  navigateToLander() {
    this.router.navigate(['lander']);
  }

  navigateToCopyCat() {
    this.router.navigate(['maker/copycat']);
  }

  navigateToExtractDetails(id: string = '') {
    if (id === '') {
      this.router.navigate(['maker/copycat/details']);
    } else {
      // localStorage.setItem('detailsId', id); for page refresh mid-edit
      this.router.navigate(['maker/copycat/details', id]);
    }
  }

  navigateToTitleDetails() {
    this.router.navigate(['maker/copycat/titles']);
  }
}
