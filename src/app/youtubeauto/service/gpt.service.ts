import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { GptVideoReqBody } from '../model/gpt/gptvideoreqbody.model';
import { GptResponse } from '../model/gpt/gptresponse.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GptService {
  
  //these need to come from our server
  private videoStyleAndToneOptions: String[] = [
    'ASMR (Autonomous Sensory Meridian Response)',
    'Gaming tutorials and playthroughs',
    'Cooking and Food',
    'DIY and crafting tutorials',
    'Educational',
    'Product reviews and unboxing videos',
    'Health and fitness tutorials and tips',
    'Beauty and fashion tutorials',
    'Financial advice and money management tutorials',
    'Motivational and self-help videos',
  ];
  private generatedVideo: GptGeneratedVideo = {
    id: '3u42o3ih23on',
    title: 'Sample title',
    description: 'here is another sample description',
    script: 'here is the very long way to say hello',
    tags: ['title', 'description', 'script'],
  };

  private sourcesVideo: GptVideoReqBody;

  private topicObserverSubject = new Subject<String>();
  private progressObserverSubject = new Subject<number>();
  private completeResultsObserverSubject = new Subject<GptGeneratedVideo>();

  constructor(private http: HttpClient) {}

  getTopicSubjectObserver() {
    return this.topicObserverSubject.asObservable();
  }

  getVideoOptionsObserver(): Observable<String[]> {
    return of(this.videoStyleAndToneOptions);
  }

  getProgressSubjectObserver(): Observable<number> {
    return this.progressObserverSubject.asObservable();
  }

  getCompleteResultsSubjectObserver(): Observable<GptGeneratedVideo> {
    return this.completeResultsObserverSubject.asObservable();
  }

  getTopicObservable(): Observable<{ message: string, result: any }> {
    return this.http.get<{ message: string, result: any }>('http://localhost:3000/api/openai/topic');
  }

  getIsolatedTopic() {
    this.getTopicObservable().subscribe((response) => {
      if (response.message !== 'success') {
        this.topicObserverSubject.next("How to make money with faceless youtube automation");
      }
      this.topicObserverSubject.next(response.result.topic);
    });
  }

  submitInputs(promptQuery: string, videoStyle: string, videoDuration: string) {
    this.sourcesVideo = {
      prompt: promptQuery,
      videoStyle: videoStyle,
      videoDuration: videoDuration,
    };
  }

  generateVideoFromSources(): void {
    if (this.sourcesVideo === undefined) {
      throw new Error('Sources video is undefined');
    }
    var compeleteResults: GptGeneratedVideo = {
      id: '',
      title: '',
      description: '',
      script: '',
      tags: [],
    };

    this.http.post<{ message: string, result: { id: string, summary: string } }>('http://localhost:3000/api/openai/summary', {
      prompt: this.sourcesVideo.prompt,
    }).subscribe((response) => {
      console.log("🚀 ~ file: gpt.service.ts:96 ~ GptService ~ generateVideoFromSources ~ response:", response)
      if (response.message !== 'success') {
        console.error('Failed to generate video', response.message);
        //todo error response to view
      } else {
        const requestSummary = response.result.summary;

        compeleteResults.id = response.result.id;
        this.progressObserverSubject.next(20);
  
        this.http.post<{ message: string, result: { title: string } }>('http://localhost:3000/api/openai/title', {
          summary: requestSummary 
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

        this.http.post<{ message: string, result: { description: string } }>('http://localhost:3000/api/openai/description', {
          summary: requestSummary 
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

        this.http.post<{ message: string, result: { script: string } }>('http://localhost:3000/api/openai/script', {
          summary: requestSummary 
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

        this.http.post<{ message: string, result: { tags: string } }>('http://localhost:3000/api/openai/tags', {
          summary: requestSummary 
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

    // const requestBody = {
    //   prompt: this.sourcesVideo.prompt,
    //   style: this.sourcesVideo.videoStyle,
    //   duration: this.sourcesVideo.videoDuration,
    // };

    // return this.http
    //   .post<GptResponse>('http://localhost:3000/api/openai', requestBody)
    //   .pipe(
    //     catchError((error) => {
    //       console.error('Failed to generate video', error);
    //       return throwError('Failed to generate video');
    //     }),
    //     map((gptResponse) => {
    //       return {
    //         id: gptResponse.result.id,
    //         title: gptResponse.result.title,
    //         description: gptResponse.result.description,
    //         script: gptResponse.result.script,
    //         tags: gptResponse.result.tags,
    //       };
    //     })
    //   )
    //   .subscribe((response) => {
    //     this.generatedVideo = response;
    //     this.completeResultsObserverSubject.next(response);
    //   });
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
        this.generatedVideo = completeResults;
        this.completeResultsObserverSubject.next(this.generatedVideo);
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
