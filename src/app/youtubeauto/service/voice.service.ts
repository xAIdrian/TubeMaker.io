import { Injectable } from '@angular/core';
import { VoiceRepository } from '../repository/voice.repo';
import { FirebaseRepository } from '../repository/firebase.repo';
import {
  Observable,
  throwError,
  Subject,
  catchError,
  map,
  concatMap,
  of,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class VoiceService {

  private erroSubject = new Subject<string>();
  private voiceObserverSubject = new Subject<{ name: string; sampleUrl: string }[]>();
  private textToSpeechObserverSubject = new Subject<string>();

  constructor(
    private firebaseRepository: FirebaseRepository,
    private voiceRepository: VoiceRepository
  ) {}

  getErrorObserver(): Observable<string> {
    return this.erroSubject.asObservable();
  }

  getVoiceSamplesObserver(): Observable<{ name: string; sampleUrl: string }[]> {
    return this.voiceObserverSubject.asObservable();
  }

  getTextToSpeechObserver(): Observable<string> {
    return this.textToSpeechObserverSubject.asObservable();
  }

  getVoices() {
    this.firebaseRepository.getSampleVoices().subscribe((samples: { name: string, sampleUrl: string }[]) => {
      console.log("🚀 ~ file: voice.service.ts:41 ~ VoiceService ~ map ~ urlMap:", samples)
      this.voiceObserverSubject.next(samples);
    });
  }

  /**
   * There will be two parts to this.
   * 1. Get the list of voices from eleven labs and make sure that what is 
   * selected is provided. Get is voice_id or show error.
   * 2. Generate text to speech. Ideally we stream it.
   * @param name 
   * @param scriptValue 
   */
  generateTextToSpeech(name: string, scriptValue: string): Observable<Blob> {
    return this.voiceRepository.getListOfVoices().pipe(
      map((response: { message: string, result: { name: string, id: string }[]}) => {
        console.log("🚀 ~ file: voice.service.ts:54 ~ VoiceService ~ this.voiceRepository.getListOfVoices ~ voices:", response)

        if (response.message !== 'success') {
          this.erroSubject.next('Error getting voices');
          return
        }

        const voiceObj = response.result.find((voice) => {
          return voice.name === name
        })
        return voiceObj?.id
      }),
      concatMap((voice) => {
        return this.voiceRepository.getTextToSpeechSteam(voice ?? '', scriptValue)
      })
    );
  }
}