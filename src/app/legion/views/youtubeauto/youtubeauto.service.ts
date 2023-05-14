import { Injectable } from '@angular/core';
import { GenerateContentService } from '../../service/content/generation.service';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { NavigationService } from '../../service/navigation.service';
import { AutoContentService } from '../../service/content/autocontent.service';
import { VideoDuration } from '../../model/autocreate/videoduration.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import { Observable, Subject } from 'rxjs';
import { YoutubeService } from '../common/youtube.service';

@Injectable({
  providedIn: 'root',
})
export class YoutubeAutoService extends YoutubeService {

  private isInDebugMode: boolean = false;
  
  constructor(
    protected override generationService: AutoContentService,
    protected override navigationService: NavigationService,
    protected autoContentRepo: AutoContentRepository
  ) {
    super(
      generationService,
      navigationService,
      autoContentRepo
    )
  }

  getInitVideoDurationObserver() {
    return this.autoContentRepo.getInitVideoDurationObserver();
  }
  getTopicObserver() {
    return this.generationService.getTopicObserver();
  }
  getDefaultVideoNichesObserver() {
    return this.contentRepo.getDefaultVideoNichesObserver();
  }
  getDefaultVideoDurationsObserver() {
    return this.autoContentRepo.getDefaultVideoDurationsObserver();
  }
  getErrorObservable() {
    return this.errorSubject.asObservable();
  }
  getScriptProgressObserver() {
    return this.generationService.getScriptProgressObserver();
  }
  getCompleteResultsObserver() {
    return this.generationService.getCompleteResultsObserver();
  }
  getScriptSectionObserver() {
    return this.generationService.getScriptSectionObserver();
  }
  getContentProgressObserver() {
    return this.generationService.getContentProgressObserver();
  }

  getInitVideoNiche() {
    return this.contentRepo.getInitVideoNiche(
      'video_style.init_header',
      'video_style.init_description'
    );
  }

  reRollTopic() {
    this.generationService.updateNewTopic();
  }
  
  generateVideoContentWithAI() {
    this.generationService.generateVideoContentWithAI();
  }

  checkCurrentTopic() {
    if (this.autoContentRepo.getCurrentTopic() === undefined && !this.isInDebugMode) {
      this.navigationService.navigateToCreateVideo();
      return
    }
  }

  submitCreate(
    topic: string,
    selectedStyle: VideoNiche,
    selectedDuration: VideoDuration
  ) {
    this.autoContentRepo.submitInputs(topic, selectedStyle, selectedDuration).subscribe({
      next: (response) => {
        this.navigationService.navigateToResults();
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  override getNewVideoMetaData(): void {
    throw new Error('Method not implemented.');
  }
  override updateTags(): void {
    throw new Error('Method not implemented.');
  }
}
