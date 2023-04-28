import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Media } from '../model/media/media.model';
import { ListVideo } from '../model/media/video/listvideo.model';
import { Router } from '@angular/router';
import { VoiceService } from './voice.service';
import { defaultVideoStyles, VideoStyle } from '../model/videostyle.model';
import { defaultVideoDurations, VideoDuration } from '../model/videoduration.model';
import { GptGeneratedVideo } from '../model/gpt/gptgeneratedvideo.model';
import { GptService } from './gpt.service';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  contentSubjectObserver = new Subject<GptGeneratedVideo>();
  mediaSubjectObserver = new Subject<Media>();
  
  exampleVideos: ListVideo[] = [];

  private youtubeVideoStyles = defaultVideoStyles;
  private youtubeVideoDurations = defaultVideoDurations;
  
  mediaholder: Media = {
    id: '',
    audio: {
      title: '',
      file: ''
    },
    video: {
      title: '',
      file: ''
    },
    image: {
      title: '',
      file: ''
    }
  };

  contentHolder: GptGeneratedVideo;

  constructor(
    private http: HttpClient, 
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

  getVideoOptionsObserver(): Observable<VideoStyle[]> {
    return of(this.youtubeVideoStyles);
  }

  getDurationOptionsObserver(): Observable<VideoDuration[]> {
    return of(this.youtubeVideoDurations);
  }

  getContentObserver(): Observable<GptGeneratedVideo> {
    return this.contentSubjectObserver.asObservable();
  }

  getMediaObserver(): Observable<Media> {
    return this.mediaSubjectObserver.asObservable();
  }

  updateAudioFile(audio: File) {
    this.mediaholder.audio.file = URL.createObjectURL(audio);
    this.mediaholder.audio.title = audio.name;
  }

  updateVideoFile(video: File) {
    if (!video.type.match(/video\/*/) || !['mp4', 'webm', 'mov'].includes(video.type.split('/')[1])) {
      console.log("🚀 ~ file: media.service.ts:143 ~ MediaService ~ updateVideoFile ~ video.type:", video.type)
      console.error('Invalid video format.');
      return;
    }
    console.log("🚀 ~ file: media.service.ts:143 ~ MediaService ~ updateVideoFile ~ video.type:", video.type)
    const videoBlob = new Blob([video], { type: video.type });
    this.mediaholder.video.file = URL.createObjectURL(videoBlob);
    this.mediaholder.video.title = video.name;
  }

  updateImageFile(image: File) {
    this.mediaholder.image.file = URL.createObjectURL(image);
    this.mediaholder.image.title = image.name;
  }

  getLatest() {
    this.contentHolder = this.gptService.generatedVideo
    this.contentSubjectObserver.next(this.contentHolder);
    this.mediaSubjectObserver.next(this.mediaholder);
  }  
}