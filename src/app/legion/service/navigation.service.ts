import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  navigateToCopyCatMedia() {
    throw new Error('Method not implemented.');
  }
  
  constructor(private router: Router) {

  }
  
  navigateToCreateVideo() {
    this.router.navigate(['maker/autos/create']);
  }

  navigateToResults() {
    this.router.navigate(['maker/autos/details']);
  }

  navigateToUploadVideo() {
    this.router.navigate(['maker/autos/upload']);
  }

  navigateToLander() {
    this.router.navigate(['lander']);
  }

  navigateToCopyCat() {
    this.router.navigate(['maker/copycat']);
  }

  navigateToExtractDetails() {
    this.router.navigate(['maker/copycat/details']);
  }

  navigateToTitleDetails() {
    this.router.navigate(['maker/copycat/titles']);
  }
}
