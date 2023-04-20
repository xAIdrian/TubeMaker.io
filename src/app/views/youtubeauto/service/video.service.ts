import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { ListVideo } from '../model/video/listvideo.model';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { Router } from '@angular/router';
import { GptVideoReqBody } from '../model/gpt/gptvideoreqbody.model';
import { GptResponse } from '../model/gpt/gptresponse.model';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  //this will need to be moved somewhere else
  exampleVideos: ListVideo[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getVideos(): Observable<ListVideo[]> {
    return of(this.exampleVideos);
  }
}
