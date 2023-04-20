import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { Router } from '@angular/router'; 
import { GptVideoReqBody } from '../model/gpt/gptvideoreqbody.model';
import { GptResponse} from '../model/gpt/gptresponse.model';

@Injectable({
  providedIn: 'root',
})
export class GptService {
  
  //these need to come from our server
  videoStyleAndToneOptions: String[] = [
    "ASMR (Autonomous Sensory Meridian Response)",
    "Gaming tutorials and playthroughs",
    "Cooking and Food",
    "DIY and crafting tutorials",
    "Educational",
    "Product reviews and unboxing videos",
    "Health and fitness tutorials and tips",
    "Beauty and fashion tutorials",
    "Financial advice and money management tutorials",
    "Motivational and self-help videos"
  ]

  private sourcesVideo: GptVideoReqBody;

  private generatedVideo: GptGeneratedVideo;
  private resultsObserverSubject = new Subject<GptGeneratedVideo>();

  constructor(private http: HttpClient, private router: Router) {}

  

  getVideoOptionsObserver(): Observable<String[]> {
    return of(this.videoStyleAndToneOptions);
  }

  getPromptResponseObserver(): Observable<GptGeneratedVideo> {
    return this.resultsObserverSubject.asObservable();
  }

  submitInputs(
    promptQuery: string,
    videoStyle: string,
    videoDuration: string
  ) {
    this.sourcesVideo = {
      prompt: promptQuery,
      videoStyle: videoStyle,
      videoDuration: videoDuration
    }
  }

  generateVideoFromSources() {
    if (this.sourcesVideo === undefined) { return; }

    const requestBody = {
      prompt: this.sourcesVideo.prompt,
      style: this.sourcesVideo.videoStyle,
      duration: this.sourcesVideo.videoDuration
    };
    console.log("🚀 ~ file: video.service.ts:58 ~ VideoService ~ submitPrompt ~ requestBody:", requestBody)
    
    this.http
      .post<GptResponse>(
        'http://localhost:3000/api/openai',
        requestBody
      )
      .pipe(map((gptResponse) => {
        
        return {
          id: gptResponse.result.id,
          title: gptResponse.result.title,
          description: gptResponse.result.description,
          script: gptResponse.result.script,
          tags: gptResponse.result.tags,
      };
    }))
      .subscribe((response) => {
        console.log(
          '🚀 ~ file: video.service.ts:54 ~ VideoService ~ submitPrompt ~ response',
          response
        );
        this.generatedVideo = response;
        this.resultsObserverSubject.next(response);
      });
  }

  getGptContent() {
    return this.generateVideoFromSources();
  }

  getScriptForDownload(): Observable<{ blob: Blob; filename: string }> {
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
