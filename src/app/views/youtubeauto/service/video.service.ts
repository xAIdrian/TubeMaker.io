import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { Video } from './video.model';
import { GptGenerative } from './gptgenerative.model';
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private readonly API_URL = 'https://your-api-url/videos';
  exampleVideos: Video[] = [];

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

  generativeVoices: String[] = ["fr-FR-Neural2-A", "fr-FR-Neural2-B", "fr-FR-Neural2-C", "fr-FR-Neural2-D", "fr-FR-Neural2-E", "fr-FR-Standard-A", "fr-FR-Standard-B", "fr-FR-Standard-C", "fr-FR-Standard-D", "fr-FR-Standard-E", "fr-FR-Wavenet-A", "fr-FR-Wavenet-B", "fr-FR-Wavenet-C", "fr-FR-Wavenet-D", "fr-FR-Wavenet-E"]

  private gptGenerative = new Subject<GptGenerative>();

  constructor(private http: HttpClient, private router: Router) {}

  getVideos(): Observable<Video[]> {
    return of(this.exampleVideos);
  }

  getVideoOptionsObserver(): Observable<String[]> {
    return of(this.videoStyleAndToneOptions);
  }

  getVoiceOptionsObserver(): Observable<String[]> {
    return of(this.generativeVoices);
  }

  getPromptResponseObserver(): Observable<GptGenerative> {
    return this.gptGenerative.asObservable();
  }

  submitPrompt(promptQuery: any) {
    const requestBody = {
      prompt: promptQuery,
    };
    console.log("🚀 ~ file: video.service.ts:58 ~ VideoService ~ submitPrompt ~ requestBody:", requestBody)
    
    this.http
      .post<{ message: string; result: any }>(
        'http://localhost:3000/api/openai',
        requestBody
      )
      .pipe(map((gptResponse) => {
        console.log("🚀 ~ file: video.service.ts:64 ~ VideoService ~ .pipe ~ gptResponse:", gptResponse)
        
        return {
          id: gptResponse.result.id,
          prompt: gptResponse.result.prompt,
          bulkText: gptResponse.result.bulkText,
      };
    }))
      .subscribe((response) => {
        console.log(
          '🚀 ~ file: video.service.ts:54 ~ VideoService ~ submitPrompt ~ response',
          response
        );
        this.gptGenerative.next(response);
      });
  }
}
