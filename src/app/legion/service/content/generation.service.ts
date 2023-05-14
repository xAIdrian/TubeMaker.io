import { Injectable } from '@angular/core';
import { from, Observable, Subject, concatMap } from 'rxjs';

import { GptRepository } from '../../repository/gpt.repo';

@Injectable({
  providedIn: 'root',
})
export abstract class GenerateContentService {
  
  errorSubject = new Subject<string>();

  //field value observables
  topicSubject = new Subject<string>();
  titleSubject = new Subject<string>();
  descriptionSubject = new Subject<string>();
  scriptSectionSubject = new Subject<{
    scriptSection: string
    position: string | number
  }>();
  tagsSubject = new Subject<string[]>();

  constructor(
    protected gptRepo: GptRepository
  ) {}

  getErrorObserver(): Observable<string> { return this.errorSubject.asObservable() }

  getTopicObserver() { return this.topicSubject.asObservable(); }
  getTitleObserver() { return this.titleSubject.asObservable(); }
  getDescriptionObserver() { return this.descriptionSubject.asObservable(); }
  getScriptSectionObserver() {  return this.scriptSectionSubject.asObservable(); }
  getTagsObserver() { return this.tagsSubject.asObservable(); }

  getNewTitle(
    inputSummary: string,
    inputNiche: string
  ) {
    console.log("🚀 ~ file: gpt.service.ts:73 ~ GptService ~ updateNewTitle ~ updateNewTitle:")
    //improve error being sent back here
    if (inputSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptRepo.postNewTitleObservable({
      summary: inputSummary,
      style: inputNiche
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:84 ~ GptService ~ updateNewTitle ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  getNewDescription(
    inputSummary: string,
    inputNiche: string
  ) {
    console.log("🚀 ~ file: gpt.service.ts:114 ~ GptService ~ updateNewDescription ~ updateNewDescription:")
    //improve error being sent back here
    if (inputSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptRepo.postNewDescriptionObservable({
      summary: inputSummary,
      style: inputNiche
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:125 ~ GptService ~ updateNewDescription ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  getNewTags(
    inputSummary: string,
    inputStyle: string
  ) {
    console.log("🚀 ~ file: gpt.service.ts:153 ~ GptService ~ updateNewTags ~ updateNewTags:")
    //improve error being sent back here
    if (inputSummary === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptRepo.postNewTagsObservable({
      summary: inputSummary,
      style: inputStyle
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:164 ~ GptService ~ updateNewTags ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.tagsSubject.next(response.result.tags.split(','));
    });
  }

  optimizeTitle(
    prompt: string,
    current: string
  ) {
    //improve error being sent back here
    if (current === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptRepo.postOptimizedTitleObservable({
      prompt: prompt,
      current: current
    }).subscribe((response) => {
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.titleSubject.next(response.result.title);
    });
  }

  optimizeDescription(
    prompt: string,
    current: string
  ) {
    //improve error being sent back here
    if (current === '') {
      this.errorSubject.next('🤔 Something is not right. Please go back to the beginning and try again.');
      return;
    }

    this.gptRepo.postOptimizedDescriptionObservable({
      prompt: prompt,
      current: current
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:125 ~ GptService ~ updateNewDescription ~ response:", response)
      if (response.message !== 'success') {
        this.errorSubject.next(response.message);
        return;
      }
      this.descriptionSubject.next(response.result.description);
    });
  }

  optimizeNewScriptIndex(
    prompt: string, 
    sectionText: string, 
    sectionIndex: number
  ) {
    this.gptRepo.postOptimizeScriptSectionObservable(
      {
        prompt: prompt,
        current: sectionText
      },
      sectionIndex
    ).subscribe({
      next: (response) => {
        console.log("🚀 ~ file: contentgeneration.service.ts:161 ~ ContentGenerationService ~ response:", response)
        if (response.message !== 'success') {
          this.errorSubject.next(response.message);
        }
        this.scriptSectionSubject.next({
          scriptSection: response.result.script,
          position: response.result.position
        });
      },
      error: (error) => {
        this.errorSubject.next(error);
      }
    })
  }
}
