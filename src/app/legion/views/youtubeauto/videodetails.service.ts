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
  private videoDurationsSubject = new Subject<VideoDuration>();

  constructor(
    private contentService: AutoContentService,
    private contentRepo: AutoContentRepository,
    private navigationService: NavigationService
  ) {
    /** */
  }

  hasVideoData(): boolean {
    return this.contentService.getTotalScriptPoints() > 0;
  }
  getInitVideoNicheObserver = this.contentRepo.getDefaultInitVideoNicheObserver();
  getInitVideoDurationObserver = this.contentRepo.getDefaultInitVideoDurationObserver();

  getInitVideoNiche() {
    return this.contentRepo.getInitVideoNiche();
  }
  getInitVideoDuration() {
    return this.contentRepo.getInitVideoDuration();
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
  getVideoDetailsDurationObserver() {
    return this.videoDurationsSubject.asObservable();
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
          this.navigationService.navigateToAutoDetails();
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

    return this.contentRepo.setCurrentPageObject(
      this.currentTopic,
      this.currentNiche,
      this.currentDuration
    );
  }

  getCurrentPage(id: string) {
    return this.contentRepo.getCurrentPage(id).pipe(
      tap((response) => {
        console.log("🚀 ~ file: videodetails.service.ts:145 ~ VideoDetailsService ~ tap ~ response:", response)
        if (response.topic !== undefined) {
          this.currentTopic = response.topic;
        }
        if (response.niche !== undefined) {
          this.currentNiche = response.niche;
        }
        if (response.duration !== undefined) {
          this.videoDurationsSubject.next(response.duration);
          this.currentDuration = response.duration;
        }
      })
    );
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
    if (this.currentTopic === undefined || this.currentTopic === '') { 
      this.navigationService.navigateToBrandNew(); 
      return;
    }
    this.contentService.generateVideoContentWithAI(
      this.currentTopic,
      this.currentNiche,
      this.currentDuration
    );
  }

  updateScriptSection(prompt: string, section: DurationSection) {
    // this.contentService.(prompt, section);
  }
}
