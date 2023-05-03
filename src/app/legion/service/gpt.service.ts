import { Injectable } from '@angular/core';
import { from, Observable, Subject, concatMap } from 'rxjs';
import { GptGeneratedMetaData } from '../model/gpt/gptgeneratedvideo.model';

import { ContentRepository } from '../model/content.repo';
import { GptRepository } from '../repository/gpt.repo';
import { DurationSection } from '../model/videoduration.model';

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
    private gptRepo: GptRepository,
    private contentRepo: ContentRepository
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
    this.gptRepo.postNewTopicObservable().subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:65 ~ GptService ~ this.gptRepo.postNewTopicObservable ~ response:", response)
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

    this.gptRepo.postNewTitleObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentRepo.getCurrentVideoStyle().name,
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
    this.gptRepo.postOptimizedTitleObservable({
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

    this.gptRepo.postNewDescriptionObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentRepo.getCurrentVideoStyle().name,
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
    this.gptRepo.postOptimizedDescriptionObservable({
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

    this.gptRepo.postNewTagsObservable({
      summary: this.gptGeneratedSummary,
      style: this.contentRepo.getCurrentVideoStyle().name,
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
    this.gptRepo.postOptimizedTagsObservable({
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
      this.contentRepo.getCurrentTopic() === undefined
      || this.contentRepo.getCurrentVideoStyle() === undefined
      || this.contentRepo.getCurrentVideoDuration() === undefined
    ) { throw new Error('Sources video is undefined'); }

    let compeleteMetaData: GptGeneratedMetaData = {
      id: '',
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

        compeleteMetaData.id = response.result.id;
        compeleteMetaData.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.contentProgressSubject.next(25);
        
        this.gptRepo.postNewTitleObservable({
          summary: requestSummary,
          style: this.contentRepo.getCurrentVideoStyle().name
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
          style: this.contentRepo.getCurrentVideoStyle().name
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
          style: this.contentRepo.getCurrentVideoStyle().name
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
          style: this.contentRepo.getCurrentVideoStyle().name,
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
  //       return this.gptRepo.postOptimizeScriptSectionObservable({
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
