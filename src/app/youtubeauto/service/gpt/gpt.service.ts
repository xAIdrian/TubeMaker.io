import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { GptGeneratedMetaData, GptGeneratedScript as GptGeneratedScriptData } from '../../model/gpt/gptgeneratedvideo.model';
import { GptVideoReqBody } from '../../model/gpt/gptvideoreqbody.model';
import { GptResponse } from '../../model/gpt/gptresponse.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ContentService } from '../content.service';
import { GptObservers } from './gpt.observers';

@Injectable({
  providedIn: 'root',
})
export class GptService {
  //state observables
  private progressSubject = new Subject<number>();
  private completeDetailsSubject = new Subject<{
    meta: GptGeneratedMetaData,
    // script: GptGeneratedScriptData
  }>();
  private errorSubject = new Subject<string>();

  //field value observables
  private topicSubject = new Subject<String>();
  private titleSubject = new Subject<String>();
  private descriptionSubject = new Subject<String>();
  private scriptSubject = new Subject<String>();
  private tagsSubject = new Subject<String[]>();

  private gptGeneratedSummary: string = ''

  constructor(
    private gptObservers: GptObservers,
    private contentService: ContentService
  ) {}

  getErrorObserver(): Observable<string> { return this.errorSubject.asObservable() }
  getProgressObserver(): Observable<number> { return this.progressSubject.asObservable();  }
  getCompleteResultsObserver(): Observable<{
    meta: GptGeneratedMetaData,
    // script: GptGeneratedScriptData
  }> { return this.completeDetailsSubject.asObservable();  }

  getTopicObserver() { return this.topicSubject.asObservable(); }
  getTitleObserver() { return this.titleSubject.asObservable(); }
  getDescriptionObserver() { return this.descriptionSubject.asObservable(); }
  getScriptSectionObserver() {  return this.scriptSubject.asObservable(); }
  getTagsObserver() { return this.tagsSubject.asObservable(); }

  updateNewTopic() {
    this.gptObservers.postNewTopicObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.topicSubject.next(response.result.topic);
    });
  }

  updateNewTitle() {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewTitleObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  optimizeTitle(title: string) {
    if (title === '') {
      this.errorSubject.next('Please enter a title');
      return;
    }
    this.gptObservers.postOptimizedTitleObservable({
      current: title,
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  updateNewDescription() {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewDescriptionObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  optimizeDescription(description: string) {
    if (description === '') {
      this.errorSubject.next('Please enter a description');
      return;
    }
    this.gptObservers.postOptimizedDescriptionObservable({
      current: description,
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  getNewScriptSection() {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    // this.postNewScriptObservable().subscribe((response) => {
    //   if (response.message !== 'success') {
    //     this.scriptObserverSubject.next("How to make money with faceless youtube automation");
    //     return;
    //   }
    //   this.scriptObserverSubject.next(response.result.script);
    // });
  }

  getOptimizedScriptSection(script: any) {
    throw new Error('Method not implemented.');
  }

  updateNewTags() {
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewTagsObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.tagsSubject.next(response.result.tags.split(','));
    });
  }

  optimizeTags(tags: string) {
    if (tags === '') {
      this.errorSubject.next('Please enter a description');
      return;
    }
    this.gptObservers.postOptimizedTagsObservable({
      current: tags,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:178 ~ GptService ~ optimizeTags ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.tagsSubject.next(response.result.tags.split(','));
    });
  }

  generateVideoContentWithAI() {
    if (
      this.contentService.getCurrentTopic() === undefined
      || this.contentService.getCurrentVideoStyle() === undefined
      || this.contentService.getCurrentVideoDuration() === undefined
    ) { throw new Error('Sources video is undefined'); }

    let compeleteMetaData: GptGeneratedMetaData = {
      id: '',
      summary: '',
      title: '',
      description: '',
      tags: [],
    };
    let completeScriptData: GptGeneratedScriptData = {
      id: '',
      introduction: '',
      mainContent: '',
      conclusion: ''
    };

    this.gptObservers.getSummaryObservable({
      prompt: this.contentService.getCurrentTopic()
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:96 ~ GptService ~ generateVideoFromSources ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      } else {
        const requestSummary = response.result.summary;

        compeleteMetaData.id = response.result.id;
        compeleteMetaData.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.progressSubject.next(20);
        
        this.gptObservers.postNewTitleObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:108 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.title = response.result.title;
            this.progressSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteMetaData);
          }
        });

        this.gptObservers.postNewDescriptionObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:122 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.description = response.result.description;
            this.progressSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteMetaData);
          }
        });

        /**
         * we need a chained for loop to complete all of these synchronously
         */
        // this.postNewScriptObservable({
        //   summary: requestSummary,
        //   style: this.contentService.getCurrentVideoStyle().name,
        //   // point: Selection.point
        // }).subscribe((response) => {
        //   console.log("🚀 ~ file: gpt.service.ts:136 ~ GptService ~ generateVideoFromSources ~ response:", response)
        //   if (response.message !== 'success') {
        //     console.error('Failed to generate video', response.message);
        //     //todo error response to view
        //   } else {
        //     compeleteResults.script = response.result.script;
        //     this.progressObserverSubject.next(20);
        //     this.checkForCompleteResultsCompletion(compeleteResults);
        //   }
        // });

        this.gptObservers.postNewTagsObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:150 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            this.errorSubject.next(response.message);
            return;
          } else {
            compeleteMetaData.tags = response.result.tags.split(',');
            this.progressSubject.next(20);
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
    completedMetaData: GptGeneratedMetaData,
    // completedScriptData: GptGeneratedScriptData
  ) {
    if (
      completedMetaData.id !== '' 
      && completedMetaData.title !== '' 
      && completedMetaData.description !== ''
      && completedMetaData.tags.length > 0
      // && completedScriptData.introduction !== ''
      // && completedScriptData.mainContent !== ''
      // && completedScriptData.conclusion !== ''
    ) {
      console.log("🚀 ~ file: gpt.service.ts:206 ~ GptService ~ checkForCompleteResultsCompletion ~ generatedVideo:", completedMetaData)
      this.completeDetailsSubject.next({ meta: completedMetaData});
    }
  }

  // getScriptForDownload(): Observable<{ blob: Blob; filename: string }> {
  //   if (!this.generatedVideo || !this.generatedVideo.script) {
  //     return throwError('Script not available');
  //   }
  //   const blob = new Blob([this.generatedVideo.script], { type: 'text/plain' });
  //   return of({
  //     blob: blob,
  //     filename:
  //       this.generatedVideo.title
  //         .replace(' ', '_')
  //         .replace(':', '')
  //         .replace("'", '')
  //         .replace('"', '') + '.txt',
  //   });
  // }
}
