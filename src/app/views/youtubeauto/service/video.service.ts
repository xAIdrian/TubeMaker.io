import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, Subject } from 'rxjs';
import { ListVideo } from '../model/video/listvideo.model';
import { Router } from '@angular/router';
import { FirebaseService } from './domain/firebase.service';
import { VoiceService } from './voice.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  //this will need to be moved somewhere else
  exampleVideos: ListVideo[] = [];

  constructor(
    private http: HttpClient, 
    private firebaseService: FirebaseService,
    private voiceService: VoiceService
  ) {}

  // getVideos(): Observable<ListVideo[]> {
  //   return this.firebaseService.getVideos().subscribe((data: ListVideo[]) => {
  //     this.exampleVideos = data;
  //   }).then(() => {
  //     return of(this.exampleVideos);
  //   }
  // }

  configureDescriptButton() {
    const uploadFile = this.voiceService.audioFile;
    if (uploadFile === undefined) {
      alert('Please upload a file first');
      return;
    }
    this.firebaseService.uploadMp3(uploadFile.title, uploadFile.file, {}).subscribe((data) => {
      console.log(data);
    });
  }
}
