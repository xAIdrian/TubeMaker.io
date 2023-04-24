import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from '../model/media/media.model';
import { ListVideo } from '../model/media/video/listvideo.model';
import { Router } from '@angular/router';
import { FirebaseService } from './domain/firebase.service';
import { VoiceService } from './voice.service';
import { YoutubeVideo } from '../model/media/video/youtubevideo.model';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { GptService } from './gpt.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {

  contentSubjectObserver = new Subject<GptGeneratedVideo>();
  mediaSubjectObserver = new Subject<Media>();
  
  //this will need to be moved somewhere else
  exampleVideos: ListVideo[] = [];
  
  mediaholder: Media = {
    id: '',
    audio: {
      title: '',
      file: undefined
    },
    video: {
      title: '',
      file: undefined
    },
    image: {
      title: '',
      file: undefined
    }
  };

  contentHolder: GptGeneratedVideo;

  constructor(
    private http: HttpClient, 
    private firebaseService: FirebaseService,
    private voiceService: VoiceService,
    private gptService: GptService
  ) {}

  // getVideos(): Observable<ListVideo[]> {
  //   return this.firebaseService.getVideos().subscribe((data: ListVideo[]) => {
  //     this.exampleVideos = data;
  //   }).then(() => {
  //     return of(this.exampleVideos);
  //   }
  // }

  getContentObserver(): Observable<GptGeneratedVideo> {
    return this.contentSubjectObserver.asObservable();
  }

  getMediaObserver(): Observable<Media> {
    return this.mediaSubjectObserver.asObservable();
  }

  updateAudioFile(file: File) {
    this.mediaholder.audio.file = file;
    this.mediaholder.audio.title = file.name;
  }

  updateVideoFile(file: File) {
    this.mediaholder.video.file = file;
    this.mediaholder.video.title = file.name;
  }

  updateImageFile(file: File) {
    this.mediaholder.image.file = file;
    this.mediaholder.image.title = file.name;
  }

  getLatest() {
    this.contentHolder = this.gptService.generatedVideo
    this.contentSubjectObserver.next(this.contentHolder);
    this.mediaSubjectObserver.next(this.mediaholder);
  }  
}
