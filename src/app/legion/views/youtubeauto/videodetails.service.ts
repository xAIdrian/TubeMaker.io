import { Injectable } from '@angular/core';
import { GenerateContentService } from '../../service/content/generation.service';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { NavigationService } from '../../service/navigation.service';
import { AutoContentService } from '../../service/content/autocontent.service';
import { VideoDuration } from '../../model/autocreate/videoduration.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailsService {

  private errorSubject = new Subject<string>()
  
  constructor(
    private gptService: AutoContentService,
    private contentRepo: AutoContentRepository,
    private navigationService: NavigationService
  ) {
    /** */
  }

  getInitVideoNiche() {
    return this.contentRepo.getInitVideoNiche(
      'video_style.init_header',
      'video_style.init_description'
    );
  }
  getInitVideoDurationObserver() {
    return this.contentRepo.getInitVideoDurationObserver();
  }
  getTopicObserver() {
    return this.gptService.getTopicObserver();
  }
  getDefaultVideoNichesObserver() {
    return this.contentRepo.getDefaultVideoNichesObserver();
  }
  getDefaultVideoDurationsObserver() {
    return this.contentRepo.getDefaultVideoDurationsObserver();
  }
  getErrorObservable() {
    return this.errorSubject.asObservable();
  }

  reRollTopic() {
    this.gptService.updateNewTopic();
  }
  submitCreate(
    topic: string,
    selectedStyle: VideoNiche,
    selectedDuration: VideoDuration
  ) {
    this.contentRepo.submitInputs(topic, selectedStyle, selectedDuration).subscribe({
      next: (response) => {
        this.navigationService.navigateToResults();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
