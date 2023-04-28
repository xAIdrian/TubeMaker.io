import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { GptVideoReqBody } from '../model/gpt/gptvideoreqbody.model';
import { GptResponse } from '../model/gpt/gptresponse.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ContentService } from './content.service';
import { VideoDuration } from '../model/videoduration.model';

@Injectable({
  providedIn: 'root',
})
export class GptService {

  private topicObserverSubject = new Subject<String>();

  private progressObserverSubject = new Subject<number>();
  private completeResultsObserverSubject = new Subject<GptGeneratedVideo>();

  private titleObserverSubject = new Subject<String>();
  private descriptionObserverSubject = new Subject<String>();
  private scriptObserverSubject = new Subject<String>();
  private tagsObserverSubject = new Subject<String[]>();

  private gptGeneratedSummary: string = ''

  constructor(
    private http: HttpClient,
    private contentService: ContentService
  ) {}

  getTopicSubjectObserver() {
    return this.topicObserverSubject.asObservable();
  }

  getTitleSubjectObserver() {
    return this.titleObserverSubject.asObservable();
  }

  getDescriptionSubjectObserver() {
    return this.descriptionObserverSubject.asObservable();
  }

  getScriptSubjectObserver() {
    return this.scriptObserverSubject.asObservable();
  }

  getTagsSubjectObserver() {
    return this.tagsObserverSubject.asObservable();
  }

  getProgressSubjectObserver(): Observable<number> {
    return this.progressObserverSubject.asObservable();
  }

  getCompleteResultsSubjectObserver(): Observable<GptGeneratedVideo> {
    return this.completeResultsObserverSubject.asObservable();
  }

  postNewTopicObservable(): Observable<{ message: string, result: any }> {
    return this.http.get<{ message: string, result: any }>(
      'http://localhost:3000/api/openai/new/topic'
    );
  }

  getSummaryObservable(reqBody: { prompt: string }): Observable<{ message: string, result: { id: string, summary: string } }> {
    return this.http.post<{ message: string, result: { id: string, summary: string } }>(
      'http://localhost:3000/api/openai/summary', reqBody
    );
  }

  postNewTitleObservable(reqBody: { summary: string, style: string}): Observable<{ message: string, result: { title: string } }> {
    return this.http.post<{ message: string, result: { title: string } }>(
      'http://localhost:3000/api/openai/new/title', reqBody
      );
  }

  postNewDescriptionObservable(reqBody: { summary: string, style: string}): Observable<{ message: string, result: { description: string } }> {
    return this.http.post<{ message: string, result: { description: string } }>(
      'http://localhost:3000/api/openai/new/description', reqBody
    );
  }

  postNewScriptObservable(reqBody: { summary: string, style: string, point: string}): Observable<{ message: string, result: { script: string } }> {
    return this.http.post<{ message: string, result: { script: string } }>(
      'http://localhost:3000/api/openai/new/script', 
      reqBody
    );
  }

  postNewTagsObservable(reqBody: { summary: string, style: string}): Observable<{ message: string, result: { tags: string } }> {
    return this.http.post<{ message: string, result: { tags: string } }>(
      'http://localhost:3000/api/openai/new/tags', 
      reqBody
    );
  }

  getNewTopic() {
    this.postNewTopicObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.topicObserverSubject.next("How to make money with faceless youtube automation");
        return;
      }
      this.topicObserverSubject.next(response.result.topic);
    });
  }

  getNewTitle() {
    this.postNewTitleObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.titleObserverSubject.next("How to make money with faceless youtube automation");
        return;
      }
      this.titleObserverSubject.next(response.result.title);
    });
  }

  getNewDescription() {
    this.postNewDescriptionObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.descriptionObserverSubject.next("How to make money with faceless youtube automation");
        return;
      }
      this.descriptionObserverSubject.next(response.result.description);
    });
  }

  getNewScriptSection() {
    this.postNewScriptObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.scriptObserverSubject.next("How to make money with faceless youtube automation");
        return;
      }
      this.scriptObserverSubject.next(response.result.script);
    });
  }

  getNewTags() {
    this.postNewTagsObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.tagsObserverSubject.next(["How", "to", "make", "money", "with", "faceless", "youtube", "automation"]);
        return;
      }
      this.tagsObserverSubject.next(response.result.tags.split(','));
    });
  }

  generateVideoFromSources(): void {
    if (
      this.contentService.getCurrentTopic() === undefined
      || this.contentService.getCurrentVideoStyle() === undefined
      || this.contentService.getCurrentVideoDuration() === undefined
    ) {
      throw new Error('Sources video is undefined');
    }
    let compeleteResults: GptGeneratedVideo = {
      id: '',
      summary: '',
      title: '',
      description: '',
      script: '',
      tags: [],
    };

    this.getSummaryObservable({
      prompt: this.contentService.getCurrentTopic()
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:96 ~ GptService ~ generateVideoFromSources ~ response:", response)
      if (response.message !== 'success') {
        console.error('Failed to generate video', response.message);
        //todo error response to view
      } else {
        const requestSummary = response.result.summary;

        compeleteResults.id = response.result.id;
        compeleteResults.summary = requestSummary;
        this.gptGeneratedSummary = requestSummary;
        this.progressObserverSubject.next(20);
  
        this.postNewTitleObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:108 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            console.error('Failed to generate video', response.message);
            //todo error response to view
          } else {
            compeleteResults.title = response.result.title;
            this.progressObserverSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteResults);
          }
        });

        this.postNewDescriptionObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:122 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            console.error('Failed to generate video', response.message);
            //todo error response to view
          } else {
            compeleteResults.description = response.result.description;
            this.progressObserverSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteResults);
          }
        });

        /**
         * we need a chained for loop to complete all of these synchronously
         */
        this.postNewScriptObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name,
          // point: Selection.point
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:136 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            console.error('Failed to generate video', response.message);
            //todo error response to view
          } else {
            compeleteResults.script = response.result.script;
            this.progressObserverSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteResults);
          }
        });

        this.postNewTagsObservable({
          summary: requestSummary,
          style: this.contentService.getCurrentVideoStyle().name
        }).subscribe((response) => {
          console.log("🚀 ~ file: gpt.service.ts:150 ~ GptService ~ generateVideoFromSources ~ response:", response)
          if (response.message !== 'success') {
            console.error('Failed to generate video', response.message);
            //todo error response to view
          } else {
            compeleteResults.tags = response.result.tags.split(',');
            this.progressObserverSubject.next(20);
            this.checkForCompleteResultsCompletion(compeleteResults);
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
  checkForCompleteResultsCompletion(completeResults: GptGeneratedVideo) {
    if (completeResults.id !== '' 
      && completeResults.title !== '' 
      && completeResults.description !== '' 
      && completeResults.script !== '' 
      && completeResults.tags.length > 0
      ) {
        console.log("🚀 ~ file: gpt.service.ts:206 ~ GptService ~ checkForCompleteResultsCompletion ~ generatedVideo:", completeResults)
        this.completeResultsObserverSubject.next(completeResults);
      }
  }

  getGptContent() {
    return this.generateVideoFromSources();
  }

  getScriptForDownload(): Observable<{ blob: Blob; filename: string }> {
    if (!this.generatedVideo || !this.generatedVideo.script) {
      return throwError('Script not available');
    }
    const blob = new Blob([this.generatedVideo.script], { type: 'text/plain' });
    return of({
      blob: blob,
      filename:
        this.generatedVideo.title
          .replace(' ', '_')
          .replace(':', '')
          .replace("'", '')
          .replace('"', '') + '.txt',
    });
  }
}
