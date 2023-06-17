import { Injectable } from '@angular/core';
import { VoiceRepository } from '../repository/voice.repo';
import { FirebaseStorageRepository } from '../repository/firebase/firestorage.repo';
import { Observable, Subject, map, concatMap } from 'rxjs';
import { ExtractContentRepository } from '../repository/content/extractcontent.repo';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private erroSubject = new Subject<string>();
  private voiceObserverSubject = new Subject<
    { name: string; sampleUrl: string }[]
  >();
  private textToSpeechObserverSubject = new Subject<string>();

  constructor(
    private firebaseRepository: FirebaseStorageRepository,
    private voiceRepository: VoiceRepository,
    //TODO this below will cause us problems if we work with 2 diff data sets
    private contentRepository: ExtractContentRepository
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
    this.firebaseRepository
      .getSampleVoices()
      .subscribe((samples: { name: string; sampleUrl: string }[]) => {
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
  generateTextToSpeech(name: string, completeScript: string): Observable<Blob> {
    return this.voiceRepository.getListOfVoices().pipe(
      map(
        (response: {
          message: string;
          result: { name: string; id: string }[];
        }) => {
          if (response.message !== 'success') {
            this.erroSubject.next('Error getting voices');
            return;
          }
          const voiceObj = response.result.find((voice) => {
            return voice.name === name;
          });
          return voiceObj?.id;
        }
      ),
      concatMap((voice) => {
        return this.voiceRepository.getTextToSpeechSteam(
          voice ?? '',
          completeScript
        );
      })
    );
  }
}
