import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoService } from './video.service';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { GptGeneratedVideo } from '../model/gptgeneratedvideo.model';

@Injectable({
  providedIn: 'root',
})
export class PosterService {
  
  private generatedVideo: GptGeneratedVideo;
  getResultsObserver: Subject<GptGeneratedVideo>;

  constructor(
    private http: HttpClient,
    private videoService: VideoService,
    private router: Router
  ) {
    this.getResultsObserver = this.videoService.gptGenerative;
  }

  getGptContent() {
    return this.videoService.generateVideoFromSources();
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

  backNavigation() {
    this.router.navigate(['/youtubeauto/create']);
  }
}
