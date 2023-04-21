import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, interval, Subject } from 'rxjs';
import { catchError, map, switchMap, takeWhile } from 'rxjs/operators';
import { Voice } from '../model/voice/voice.model';
import { ArticleStatus } from '../model/voice/articlestatus.model';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  
  private audioFile: Blob;

  private voiceObserverSubject = new Subject<{ name: string, sampleUrl: string }[]>();

  constructor(
    private http: HttpClient
  ) {}

  private baseUrl = 'http://localhost:3000';

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 5992824d1a1b4779a76e4176ca0d1d07',
    'X-USER-ID': 'Y0Yo31zn6ofKRyhNFyNj1gSxEJ63'
  });

  getVoiceOptionsObserver(): Observable<{ name: string, sampleUrl: string }[]> {
    return this.voiceObserverSubject.asObservable()
  }

  getVoiceOptions() {
    this.http.get<{ name: string, sample: string }[]>(`${this.baseUrl}/api/voice/voices`, { headers: this.headers })
      .subscribe((data) => {
        let displayVoices: { name: string, sampleUrl: string }[] = []
        data.forEach((voice) => {
          displayVoices.push({
            name: voice.name,
            sampleUrl: voice.sample
          })
        })
        this.voiceObserverSubject.next(displayVoices);
      })
  }

  updateAudioFile(file: File) {
    this.audioFile = file;
  }
}

/**
 * {
    value: 'fr-FR-YvesNeural',
    name: 'Yves',
    language: 'French',
    voiceType: 'Neural',
    languageCode: 'fr-FR',
    gender: 'Male',
    service: 'ms',
    sample: 'https://media.play.ht/voice-samples/fr-FR-YvesNeural.mp3',
    isNew: true
  }
 */