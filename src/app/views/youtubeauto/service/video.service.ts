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
  exampleVideos: Video[] = [
    {
      id: '1',
      title:
        'How to Make a Delicious Chocolate Cake With Lady Gaga- Easy Recipe for Beginners',
      description:
        'Learn how to make a delicious chocolate cake with this easy recipe for beginners. This cake is moist, rich, and chocolatey, and is sure to be a hit with your friends and family. Watch this video to learn how to make it step by step.',
      channelTitle: 'Clever Celebertiy News',
      publishedAt: '2020-01-01',
    },
    {
      id: '2',
      title:
        '10 Minute Yoga Routine for Stress Relief - Easy and Gentle Yoga Poses',
      description:
        'This 10 minute yoga routine is perfect for stress relief and relaxation. The gentle and easy yoga poses are perfect for beginners and are designed to help you release tension and calm your mind. Watch this video to follow along and start feeling more relaxed today.',
      channelTitle: 'Keep Productive & Earn',
      publishedAt: '2020-01-02',
    },
    {
      id: '3',
      title: "Trevor Noah's Guide To Europe",
      description:
        'Planning a trip to Europe and not sure where to go? Check out this list of the top 10 places to visit in Europe, featuring the best destinations for travel. From stunning cities to beautiful beaches, Europe has it all. Watch this video to get inspired for your next trip.',
      channelTitle: 'Clever Celebrity News',
      publishedAt: '2020-01-03',
    },
  ];

  private gptGenerative = new Subject<GptGenerative>();

  constructor(private http: HttpClient, private router: Router) {}

  getVideos(): Observable<Video[]> {
    return of(this.exampleVideos);
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
        'http://localhost:4200/api/openai',
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
