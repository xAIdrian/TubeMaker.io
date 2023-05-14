import { Injectable } from '@angular/core';
import { GenerateContentService } from '../../service/content/generation.service';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { NavigationService } from '../../service/navigation.service';
import { AutoContentService } from '../../service/content/autocontent.service';
import { VideoDuration } from '../../model/autocreate/videoduration.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import { Observable, Subject } from 'rxjs';
import { YoutubeService } from '../common/youtube.service';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
import { TranscriptRepository } from '../../repository/transcript.repo';
import { TextSplitUtility } from '../../helper/textsplit.utility';

@Injectable({
  providedIn: 'root',
})
export class YoutubeAutoService extends YoutubeService {

  override currentCopyCatVideo: YoutubeVideo;
  
  constructor(
    protected override navigationService: NavigationService,
    protected override transcriptRepo: TranscriptRepository,
    protected override textSplitUtility: TextSplitUtility,
    protected autoGenerationService: AutoContentService,
    protected autoContentRepo: AutoContentRepository,
  ) {
    super(
      autoGenerationService,
      navigationService,
      autoContentRepo,
      transcriptRepo,
      textSplitUtility,
    );
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
    return this.autoGenerationService.getScriptProgressObserver();
  }
  
  getContentProgressObserver() {
    return this.autoGenerationService.getContentProgressObserver();
  }

  getInitVideoNiche() {
    return this.contentRepo.getInitVideoNiche(
      'video_style.init_header',
      'video_style.init_description'
    );
  }

  reRollTopic() {
    this.autoGenerationService.updateNewTopic();
  }
  
  generateVideoContentWithAI() {
    this.autoGenerationService.generateVideoContentWithAI();
  }

  checkCurrentTopic() {
    if (this.autoContentRepo.getCurrentTopic() === undefined) {
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

  goToHomePage() {
    this.navigationService.navigateToCreateVideo();
  }
}
