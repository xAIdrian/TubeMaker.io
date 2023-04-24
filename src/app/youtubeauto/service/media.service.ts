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
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  contentSubjectObserver = new Subject<GptGeneratedVideo>();
  mediaSubjectObserver = new Subject<Media>();
  
  exampleVideos: ListVideo[] = [];

  private youtubeVideoStyles: { name: string, header: string, description: string }[] = [
    {
      name: 'Tutorial',
      header: 'Tutorial',
      description: 'A tutorial is a method of transferring knowledge and may be used as a part of a learning process. More specifically, a tutorial is an instructional method based on giving assistance to, and providing guided practice, to the learner. Tutorials are often used in conjunction with e-learning, or e-learning modules. Tutorials are also used in distance education, where they are used to support the learning process in a virtual classroom environment. Tutorials are also used in computer programming, where they are used to help programmers learn the basics of a programming language.'
    },
    {
      name: 'How To',
      header: 'How To',
      description: 'A how-to or a how to is an informal, often short, description of how to accomplish some specific task. A how-to is usually meant to help non-experts, may leave out details that are only important to experts, and may also be greatly simplified from an overall discussion of the topic.'
    },
    {
      name: 'Review',
      header: 'Niche Review',
      description: 'A review is a form of literary criticism in which a book, play, film, or other work is analyzed, evaluated, and critiqued. A review can consider a work\'s plot, characters, theme, setting, style, symbolism, and other literary devices, as well as the work\'s reception by critics and audiences. Reviews are most often published in newspapers, magazines, and academic journals. They are also broadcast on radio and television.'
    },
    {
      name: 'News',
      header: 'Breaking News',
      description: 'News is information about current events. This may be provided through many different media: word of mouth, printing, postal systems, broadcasting, electronic communication, and also on the testimony of observers and witnesses to events. It is also used as a platform to manufacture opinion for the population. Common topics for news reports include war, government, politics, education, health, the environment, economy, business, fashion, and entertainment, as well as athletic events, quirky or unusual events. '
    },
    {
      name: 'Vlog',
      header: 'Personal Vlog',
      description: 'A vlog is a form of video blogging. Vlogs are similar to blogs, but they are usually more personal and often include video footage of the blogger'
    },
    {
      name: 'Listicle',
      header: 'Listicle',
      description: 'A listicle is a type of written or spoken discourse consisting of a series of items presented in a list format. The term was coined in 2006 by the American journalist Ben Zimmer, who described it as "a short piece of writing, often humorous, that uses numbered or bulleted points to make a point". Listicles are often used in jokes'
    },
    {
      name: 'Podcast',
      header: 'Podcast',
      description: 'A podcast is an episodic series of digital audio or video files which a user can download and listen to. The word is a neologism derived from "iPod" and "broadcast". The user subscribes to the podcast by using a client application to manage the transfer of files, either by downloading them manually or automatically. The podcast client application then transfers the files to the user\'s computer or portable media player. Podcasts are usually free.'
    }
  ];
  private youtubeVideoDurations: { name: string, header: string, description: string }[] = [
    {
      name: 'Extra Short',
      header: 'Extra Short',
      description: 'Extra short videos are videos that are 1 minute or less in length. They are often used to promote a product or service, or to provide a quick overview of a topic. They are also used to provide a quick overview of a topic.'
    },
    {
      name: 'Short',
      header: 'Short',
      description: 'Short videos are videos that are 3 minutes or less in length. They are often used to promote a product or service, or to provide a quick overview of a topic. They are also used to provide a quick overview of a topic.'
    },
    {
      name: 'Medium',
      header: 'Medium',
      description: 'Medium videos are videos that are 3 to 10 minutes in length. They are often used to promote a product or service, or to provide a quick overview of a topic. They are also used to provide a quick overview of a topic.'
    },
    {
      name: 'Long',
      header: 'Long',
      description: 'Long videos are videos that are 10 minutes or more in length. They are often used to promote a product or service, or to provide a quick overview of a topic. They are also used to provide a quick overview of a topic.'
    },
    {
      name: 'Extra Long',
      header: 'Extra Long',
      description: 'Extra long videos are videos that are 20 minutes or more in length. They are often used to promote a product or service, or to provide a quick overview of a topic. They are also used to provide a quick overview of a topic.'
    }
  ];
  
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

  getVideoOptionsObserver(): Observable<{ name: string, header: string, description: string }[]> {
    return of(this.youtubeVideoStyles);
  }

  getDurationOptionsObserver(): Observable<{ name: string, header: string, description: string }[]> {
    return of(this.youtubeVideoDurations);
  }

  getContentObserver(): Observable<GptGeneratedVideo> {
    return this.contentSubjectObserver.asObservable();
  }

  getMediaObserver(): Observable<Media> {
    return this.mediaSubjectObserver.asObservable();
  }

  updateAudioFile(file: File) {
    this.mediaholder.audio.file = URL.createObjectURL(file);
    this.mediaholder.audio.title = file.name;
  }

  updateVideoFile(file: File) {
    this.mediaholder.video.file = URL.createObjectURL(file);
    this.mediaholder.video.title = file.name;
  }

  updateImageFile(file: File) {
    this.mediaholder.image.file = URL.createObjectURL(file);
    this.mediaholder.image.title = file.name;
  }

  getLatest() {
    this.contentHolder = this.gptService.generatedVideo
    this.contentSubjectObserver.next(this.contentHolder);
    this.mediaSubjectObserver.next(this.mediaholder);
  }  
}