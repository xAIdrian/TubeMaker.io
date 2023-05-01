import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, map, Observable, of, Subject } from 'rxjs';
import { GptGeneratedMetaData, GptGeneratedScript as GptGeneratedScriptData } from '../../model/gpt/gptgeneratedvideo.model';
import { GptVideoReqBody } from '../../model/gpt/gptvideoreqbody.model';
import { GptResponse } from '../../model/gpt/gptresponse.model';
import { catchError, concatMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ContentService } from '../content/content.service';
import { GptObservers } from './gpt.observers';
import { DurationSection } from '../../model/create/videoduration.model';

@Injectable({
  providedIn: 'root',
})
export class GptService {
  //state observables
  private contentProgressSubject = new Subject<number>();
  private scriptProgressSubject = new Subject<{
    increment: number,
    label: string
  }>();
  private completeDetailsSubject = new Subject<{
    meta: GptGeneratedMetaData,
    // script: GptGeneratedScriptData
  }>();
  private errorSubject = new Subject<string>();

  //field value observables
  private topicSubject = new Subject<String>();
  private titleSubject = new Subject<String>();
  private descriptionSubject = new Subject<String>();
  private scriptSectionSubject = new Subject<{
    sectionControl: string,
    scriptSection: string
  }>();
  private tagsSubject = new Subject<String[]>();

  private gptGeneratedSummary: string = ''

  constructor(
    private gptObservers: GptObservers,
    private contentService: ContentService
  ) {}

  getErrorObserver(): Observable<string> { return this.errorSubject.asObservable() }
  getContentProgressObserver(): Observable<number> { return this.contentProgressSubject.asObservable();  }
  getScriptProgressObserver(): Observable<{
    increment: number,
    label: string
  }> { return this.scriptProgressSubject.asObservable();  }
  getCompleteResultsObserver(): Observable<{
    meta: GptGeneratedMetaData
  }> { return this.completeDetailsSubject.asObservable();  }

  getTopicObserver() { return this.topicSubject.asObservable(); }
  getTitleObserver() { return this.titleSubject.asObservable(); }
  getDescriptionObserver() { return this.descriptionSubject.asObservable(); }
  getScriptSectionObserver() {  return this.scriptSectionSubject.asObservable(); }
  getTagsObserver() { return this.tagsSubject.asObservable(); }

  updateNewTopic() {
    console.log("🚀 ~ file: gpt.service.ts:63 ~ GptService ~ updateNewTopic ~ updateNewTopic:")
    this.gptObservers.postNewTopicObservable().subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:65 ~ GptService ~ this.gptObservers.postNewTopicObservable ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.topicSubject.next(response.result.topic);
    });
  }

  updateNewTitle() {
    console.log("🚀 ~ file: gpt.service.ts:73 ~ GptService ~ updateNewTitle ~ updateNewTitle:")
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewTitleObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:84 ~ GptService ~ updateNewTitle ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  optimizeTitle(title: string) {
    console.log("🚀 ~ file: gpt.service.ts:96 ~ GptService ~ optimizeTitle ~ optimizeTitle:")
    if (title === '') {
      this.errorSubject.next('Please enter a title');
      return;
    }
    this.gptObservers.postOptimizedTitleObservable({
      current: title,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:104 ~ GptService ~ optimizeTitle ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  updateNewDescription() {
    console.log("🚀 ~ file: gpt.service.ts:114 ~ GptService ~ updateNewDescription ~ updateNewDescription:")
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewDescriptionObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:125 ~ GptService ~ updateNewDescription ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  optimizeDescription(description: string) {
    console.log("🚀 ~ file: gpt.service.ts:135 ~ GptService ~ optimizeDescription ~ optimizeDescription:")
    if (description === '') {
      this.errorSubject.next('Please enter a description');
      return;
    }
    this.gptObservers.postOptimizedDescriptionObservable({
      current: description,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:143 ~ GptService ~ optimizeDescription ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  updateNewTags() {
    console.log("🚀 ~ file: gpt.service.ts:153 ~ GptService ~ updateNewTags ~ updateNewTags:")
    //improve error being sent back here
    if (this.gptGeneratedSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptObservers.postNewTagsObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentService.getCurrentVideoStyle().name,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:164 ~ GptService ~ updateNewTags ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.tagsSubject.next(response.result.tags.split(','));
    });
  }

  optimizeTags(tags: string) {
    console.log("🚀 ~ file: gpt.service.ts:174 ~ GptService ~ optimizeTags ~ optimizeTags:")
    if (tags === '') {
      this.errorSubject.next('Please enter a description');
      return;
    }
    this.gptObservers.postOptimizedTagsObservable({
      current: tags,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:182 ~ GptService ~ optimizeTags ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.tagsSubject.next(response.result.tags.split(','));
    });
  }

  generateVideoContentWithAI() {
    console.log("🚀 ~ file: gpt.service.ts:192 ~ GptService ~ generateVideoContentWithAI ~ generateVideoContentWithAI:")
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

    this.gptObservers.getSummaryObservable({
      prompt: this.contentService.getCurrentTopic()
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      } else {
        const requestSummary = response.result.summary;

        compeleteMetaData.id = response.result.id;
        compeleteMetaData.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.contentProgressSubject.next(25);
        
        this.gptObservers.postNewTitleObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
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

        this.gptObservers.postNewDescriptionObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
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

        this.gptObservers.postNewTagsObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
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
    completedMetaData: GptGeneratedMetaData
  ) {
    if (
      completedMetaData.id !== '' 
      && completedMetaData.title !== '' 
      && completedMetaData.description !== ''
      && completedMetaData.tags.length > 0
    ) {
      this.completeDetailsSubject.next({ meta: completedMetaData});
      console.log("🚀 ~ file: gpt.service.ts:266 ~ GptService ~ completedMetaData:", completedMetaData)
      
      this.contentService.getCurrentVideoDuration().sections.forEach((section) => {
        console.log("💵 ~ file: gpt.service.ts:271 ~ GptService ~ this.contentService.getCurrentVideoDuration ~ section:", section)
        this.getNewScriptSection(section);
      });
    }
  }

  getNewScriptSection(section: DurationSection, updateProgress = true) {
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
        
        return this.gptObservers.postNewScriptSectionObservable({
          summary: this.gptGeneratedSummary,
          style: this.contentService.getCurrentVideoStyle().name,
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
        increment: 100 / this.contentService.getTotalNumberOfPoints(),
        label: this.generateLoadingMessage(),
      }
      this.scriptProgressSubject.next(progressItem);

      if (pointsCount === section.points.length) { 
        this.contentService.updateScriptMap(section.controlName, compiledPoints.trim()); 
        // emit just the view value of the section
        this.scriptSectionSubject.next({
          sectionControl: section.controlName,
          scriptSection: compiledPoints.trim()
        });
      }
    });
  }

  // optimizeScriptSection(section: DurationSection, currentSection: string) {
  //   //improve error being sent back here
  //   // if (this.currentSection === '') {
  //   //   this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
  //   //   return;
  //   // }
  //   let compiledPoints = '';
  //   let pointsCount = 0;

  //   from(currentSection.split('\n\n')).pipe(
  //     concatMap((section) => {
  //       return this.gptObservers.postOptimizeScriptSectionObservable({
  //         current: section
  //       });
  //     })
  //   ).subscribe((response) => {
  //     if (response.message !== 'success') {
  //       this.errorSubject.next(response.message);
  //       return;
  //     }
  //     pointsCount++;
  //     compiledPoints += '\n' + response.result.script;

  //     if (pointsCount === currentSection.length) {        
  //       // emit just the view value of the section
  //       this.scriptSectionSubject.next({
  //         sectionControl: section.controlName,
  //         scriptSection: compiledPoints.trim()
  //       });
  //     }
  //   });
  // }

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
