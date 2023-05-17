import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {
    /** */
  }

  // navigateToLander() {
  //   this.router.navigate(['./pages/lander']);
  // }

  navigateToBrandNew() {
    this.router.navigate(['maker/auto']);
  }

  navigateToAutoDetails(id: string = '') {
    if (id === '') {
      this.router.navigate(['maker/auto/details']);
    } else {
      // localStorage.setItem('detailsId', id); for page refresh mid-edit
      this.router.navigate(['maker/auto/details', id]);
    }
  }

  navigateToLander() {
    this.router.navigate(['/lander']);
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
