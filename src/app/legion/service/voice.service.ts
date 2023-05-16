import { Injectable } from '@angular/core';
import { VoiceRepository } from '../repository/voice.repo';
import { FirebaseStorageRepository } from '../repository/firebase/firestorage.repo';
import {
  Observable,
  throwError,
  Subject,
  catchError,
  map,
  concatMap,
  of,
} from 'rxjs';
import { ExtractContentRepository } from '../repository/content/extractcontent.repo';

const TEXTX_TO_VOICE_MAX = 5400;

@Injectable({
  providedIn: 'root',
})
export class VoiceService {

  private erroSubject = new Subject<string>();
  private voiceObserverSubject = new Subject<{ name: string; sampleUrl: string }[]>();
  private textToSpeechObserverSubject = new Subject<string>();
  textTooLongErrorSubject: any;

  constructor(
    private firebaseRepository: FirebaseStorageRepository,
    private voiceRepository: VoiceRepository,
    private contentRepository: ExtractContentRepository
  ) {}

  getTextTooLongErrorObserver(): Observable<string> {
    return this.textTooLongErrorSubject.asObservable();
  }

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
  generateTextToSpeech(name: string): Observable<Blob> {
    let completeScript = ''

    return this.contentRepository.getCompleteScript().pipe(
      map((scriptValue) => {
        console.log("🚀 ~ file: voice.service.ts:61 ~ VoiceService ~ map ~ scriptValue:", scriptValue)
        if (scriptValue === null || scriptValue === '') {
          this.erroSubject.next('Script Is Empty.');
        } else if (scriptValue.length >= TEXTX_TO_VOICE_MAX) {
          this.textTooLongErrorSubject.next('Your script is too long to generate AI text.  Please contact sales if you would like to upgrade your account.');
          // throw new Error('Script Too Short.');
          return;
        } else {
          completeScript = scriptValue;
        }
      }),
      concatMap((_scriptValue) => this.voiceRepository.getListOfVoices()),
      map((response: { message: string, result: { name: string, id: string }[]}) => {
        console.log("🚀 ~ file: voice.service.ts:69 ~ VoiceService ~ map ~ response:", response)
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
        console.log("🚀 ~ file: voice.service.ts:80 ~ VoiceService ~ concatMap ~ voice:", voice)
        return this.voiceRepository.getTextToSpeechSteam(voice ?? '', completeScript)
      })
    );
  }
}
