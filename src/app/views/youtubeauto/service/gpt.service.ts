import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { ListVideo } from '../model/listvideo.model';
import { GptGeneratedVideo } from '../model/gptgeneratedvideo.model';
import { Router } from '@angular/router'; 
import { GptVideoReqBody } from '../model/gptvideoreqbody.model';
import { GptResponse} from '../model/gptresponse.model';

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
  //these need to come from our server
  private generativeVoices: String[] = ["fr-FR-Neural2-A", "fr-FR-Neural2-B", "fr-FR-Neural2-C", "fr-FR-Neural2-D", "fr-FR-Neural2-E", "fr-FR-Standard-A", "fr-FR-Standard-B", "fr-FR-Standard-C", "fr-FR-Standard-D", "fr-FR-Standard-E", "fr-FR-Wavenet-A", "fr-FR-Wavenet-B", "fr-FR-Wavenet-C", "fr-FR-Wavenet-D", "fr-FR-Wavenet-E"]

  private sourcesVideo: GptVideoReqBody;

  private generatedVideo: GptGeneratedVideo;
  private resultsObserverSubject = new Subject<GptGeneratedVideo>();

  constructor(private http: HttpClient, private router: Router) {}

  

  getVideoOptionsObserver(): Observable<String[]> {
    return of(this.videoStyleAndToneOptions);
  }

  getVoiceOptionsObserver(): Observable<String[]> {
    return of(this.generativeVoices);
  }

  getPromptResponseObserver(): Observable<GptGeneratedVideo> {
    return this.resultsObserverSubject.asObservable();
  }

  submitInputs(
    promptQuery: string,
    videoStyle: string,
    videoDuration: string,
    voice: string
  ) {
    this.sourcesVideo = {
      prompt: promptQuery,
      videoStyle: videoStyle,
      videoDuration: videoDuration,
      voice: voice
    }
  }

  generateVideoFromSources() {
    if (this.sourcesVideo === undefined) { return; }

    const requestBody = {
      prompt: this.sourcesVideo.prompt,
      style: this.sourcesVideo.videoStyle,
      duration: this.sourcesVideo.videoDuration,
      voice: this.sourcesVideo.voice
    };
    console.log("🚀 ~ file: video.service.ts:58 ~ VideoService ~ submitPrompt ~ requestBody:", requestBody)
    
    this.http
      .post<GptResponse>(
        'http://localhost:3000/api/openai',
        requestBody
      )
      .pipe(map((gptResponse) => {
        console.log("🚀 ~ file: video.service.ts:64 ~ VideoService ~ .pipe ~ gptResponse:", gptResponse)
        
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
