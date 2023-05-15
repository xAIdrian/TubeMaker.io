import { Injectable } from '@angular/core';
import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { NavigationService } from '../../service/navigation.service';
import { AutoContentService } from '../../service/content/autocontent.service';
import { DurationSection, VideoDuration } from '../../model/autocreate/videoduration.model';
import { VideoNiche } from '../../model/autocreate/videoniche.model';
import { Observable, Subject, tap } from 'rxjs';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';

@Injectable({
  providedIn: 'root',
})
export class VideoDetailsService {
  
  currentTopic: string;
  currentNiche: VideoNiche;
  currentDuration: VideoDuration = {
    name: 'please wait',
    header: '',
    description: '',
    sections: [
      {
        name: 'please wait',
        controlName: 'introduction',
        isLoading: false,
        points: [],
      },
    ],
  };
  
  private errorSubject = new Subject<string>();

  constructor(
    private contentService: AutoContentService,
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
    return this.contentService.getTopicObserver();
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
  getContentProgressObserver() {
    return this.contentService.getContentProgressObserver();
  }
  getScriptProgressObserver() {
    return this.contentService.getScriptProgressObserver();
  }
  getCompleteResultsObserver() {
    return this.contentService.getCompleteResultsObserver();
  }
  getTitleObserver() {
    return this.contentService.getTitleObserver().pipe(
      tap((title) => {
        this.contentRepo.updateTitle(title);
      })
    );
  }
  getDescriptionObserver() {
    return this.contentService.getDescriptionObserver().pipe(
      tap((description) => {
        this.contentRepo.updateDescription(description);
      })
    );
  }
  getTagsObserver() {
    return this.contentService.getTagsObserver().pipe(
      tap((tags) => {
        this.contentRepo.updateTags(tags);
      })
    );
  }
  getScriptSectionObserver() {
    return this.contentService.getScriptSectionObserver();
  }

  getCurrentTopic(): string {
    return this.currentTopic;
  }

  getCurrentVideoDuration(): VideoDuration {
    return this.currentDuration;
  }

  reRollTopic() {
    this.contentService.updateNewTopic();
  }

  submitCreate(
    topic: string,
    selectedStyle: VideoNiche,
    selectedDuration: VideoDuration
  ) {
    this.submitInputs(topic, selectedStyle, selectedDuration)
      .subscribe({
        next: (response) => {
          this.navigationService.navigateToResults();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  submitInputs(
    topic: string,
    videoStyle: VideoNiche,
    videoDuration: VideoDuration
  ): Observable<YoutubeVideoPage> {
    this.contentService.resetTotalScriptPoints();

    this.currentTopic = topic
    this.currentNiche = videoStyle
    this.currentDuration = videoDuration

    this.contentService.setTotalScriptPoints(videoDuration);

    return this.contentRepo.setCurrentPageObject();
  }

  getVideoMetaData() {
    this.contentRepo.getMetaData().subscribe({
      next: (response) => {
        this.contentService.titleSubject.next(response.title);
        this.contentService.descriptionSubject.next(response.description);
        this.contentService.tagsSubject.next(response.tags);
      },
      error: (err) => {
        this.errorSubject.next(err);
      },
    });
  }

  updateTitle(prompt: string, current: string) {
    this.contentService.optimizeTitle(prompt, current);
  }

  updateDescription(prompt: string, current: string) {
    this.contentService.optimizeDescription(prompt, current);
  }

  updateTags(title: string, description: string) {
    this.contentService.getNewTags(title, description);
  }
  
  generateVideoContentWithAI() {
    this.contentService.generateVideoContentWithAI(
      this.currentTopic,
      this.currentNiche,
      this.currentDuration
    );
  }

  updateScriptSection(prompt: string, section: DurationSection) {
    throw new Error("Method not implemented.");
  }
}
