import { Injectable } from '@angular/core';
import { from, Observable, Subject, concatMap } from 'rxjs';

import { AutoContentRepository } from '../../repository/content/autocontent.repo';
import { GptRepository } from '../../repository/gpt.repo';
import { DurationSection } from '../../model/autocreate/videoduration.model';
import { ContentGenerationService } from './generation.service';
import { VideoMetadata } from '../../model/video/videometadata.model';

@Injectable({
  providedIn: 'root',
})
export class ContentAutoService extends ContentGenerationService {

  private gptGeneratedSummary: string = ''

  //state observables
  private contentProgressSubject = new Subject<number>();
  private scriptProgressSubject = new Subject<{
    increment: number,
    label: string
  }>();
  private completeDetailsSubject = new Subject<{
    meta: VideoMetadata,
    // script: GptGeneratedScriptData
  }>();

  constructor(
    gptRepo: GptRepository,
    private contentRepo: AutoContentRepository
  ) {
    super(gptRepo);
  }

  getContentProgressObserver(): Observable<number> { return this.contentProgressSubject.asObservable();  }
  getScriptProgressObserver(): Observable<{
    increment: number,
    label: string
  }> { return this.scriptProgressSubject.asObservable();  }
  getCompleteResultsObserver(): Observable<{
    meta: VideoMetadata
  }> { return this.completeDetailsSubject.asObservable();  }

  updateNewTopic() {
    console.log("🚀 ~ file: gpt.service.ts:63 ~ GptService ~ updateNewTopic ~ updateNewTopic:")
    this.gptRepo.postNewTopicObservable().subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:65 ~ GptService ~ this.gptRepo.postNewTopicObservable ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.topicSubject.next(response.result.topic);
    });
  }

  generateVideoContentWithAI() {
    console.log("🚀 ~ file: gpt.service.ts:192 ~ GptService ~ generateVideoContentWithAI ~ generateVideoContentWithAI:")
    if (
      this.contentRepo.getCurrentTopic() === undefined
      || this.contentRepo.getCurrentVideoNiche() === undefined
      || this.contentRepo.getCurrentVideoDuration() === undefined
    ) { throw new Error('Sources video is undefined'); }

    let compeleteMetaData: VideoMetadata = {
      parentId: '',
      summary: '',
      title: '',
      description: '',
      tags: [],
    };

    this.gptRepo.getSummaryObservable({
      prompt: this.contentRepo.getCurrentTopic()
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      } else {
        const requestSummary = response.result.summary;

        compeleteMetaData.parentId = response.result.id;
        compeleteMetaData.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.contentProgressSubject.next(25);
        
        this.gptRepo.postNewTitleObservable({
          summary: requestSummary,
          style: this.contentRepo.getCurrentVideoNiche().name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.title = response.result.title;
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(compeleteMetaData);
          }
        });

        this.gptRepo.postNewDescriptionObservable({
          summary: requestSummary,
          style: this.contentRepo.getCurrentVideoNiche().name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.description = response.result.description;
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(compeleteMetaData);
          }
        });

        this.gptRepo.postNewTagsObservable({
          summary: requestSummary,
          style: this.contentRepo.getCurrentVideoNiche().name
        }).subscribe((response) => {
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.tags = response.result.tags.split(',');
            this.contentProgressSubject.next(25);
            this.checkForCompleteResultsCompletion(compeleteMetaData);
          }
        });
      }
    });
  }

  /**
   * With this function we check if the complete results are ready to be displayed meaning every field has a non-null and non-empty value
   * When we are ready to display the results we call .next() on the completeResultsObserverSubject, otherwise take no action
   * @returns 
   */
  checkForCompleteResultsCompletion(
    completedMetaData: VideoMetadata
  ) {
    if (
      completedMetaData.parentId !== '' 
      && completedMetaData.title !== '' 
      && completedMetaData.description !== ''
      && completedMetaData.tags.length > 0
    ) {
      this.completeDetailsSubject.next({ meta: completedMetaData});
      console.log("🚀 ~ file: gpt.service.ts:266 ~ GptService ~ completedMetaData:", completedMetaData)
      
      this.contentRepo.getCurrentVideoDuration().sections.forEach((section) => {
        console.log("💵 ~ file: gpt.service.ts:271 ~ GptService ~ this.contentRepo.getCurrentVideoDuration ~ section:", section)
        this.getNewScriptSection(section);
      });
    }
  }

  getNewScriptSection(section: DurationSection) {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }
    let compiledPoints = '';
    let pointsCount = 0;

    from(section.points).pipe(
      concatMap((sectionPoint) => {
        console.log("💵 ~ file: gpt.service.ts:284 ~ GptService ~ concatMap ~ sectionPoint:", sectionPoint)
        
        return this.gptRepo.postNewScriptSectionObservable({
          summary: this.gptGeneratedSummary,
          style: this.contentRepo.getCurrentVideoNiche().name,
          point: sectionPoint,
        });
      })
    ).subscribe((response) => {
      console.log("💵 ~ file: gpt.service.ts:293 ~ GptService ~ ).subscribe ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      pointsCount++;
      compiledPoints += '\n' + response.result.script;

      //here we are managing the loading state of the view and the final nav point
      const progressItem = {
        increment: 100 / this.contentRepo.getTotalNumberOfPoints(),
        label: this.generateLoadingMessage(),
      }
      this.scriptProgressSubject.next(progressItem);

      if (pointsCount === section.points.length) { 
        this.contentRepo.updateScriptMap(section.controlName, compiledPoints.trim()); 
        // emit just the view value of the section
        this.scriptSectionSubject.next({
          scriptSection: compiledPoints.trim(),
          position: section.controlName
        });
      }
    });
  }

  generateLoadingMessage(): string {
    const messages = [
      'Processing neural data...',
      'Optimizing deep learning models...',
      'Training artificial intelligence...',
      'Analyzing data sets...',
      'Generating synthetic samples...',
      'Improving machine learning algorithms...',
      'Simulating neural networks...',
      'Building intelligent agents...',
      'Modeling data with artificial neural nets...',
      'Designing natural language processing systems...',
      'Extracting features from images...',
      'Creating intelligent decision systems...'
    ];
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  }
  
}
