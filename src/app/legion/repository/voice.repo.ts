import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import {
  Observable,
  of,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class VoiceRepository {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { /** */ }

  getListOfVoices(): Observable<{ message: string, result: { name: string, id: string }[]}> {
    return this.http.get<{ message: string, result: { name: string, id: string }[]}>(
      `${environment.apiUrl}/api/voices`
    );
  }

  getTextToSpeechSteam(
    myVoiceId: string,
    scriptValue: string
  ): Observable<Blob> {
    if (myVoiceId === null || myVoiceId === undefined || myVoiceId === '') {
      console.log("🚀 ~ file: voice.repo.ts:29 ~ VoiceRepository ~ myVoiceId === null:", myVoiceId === null)
      return of(new Blob())
    }
    const currLang = this.translate.currentLang;
    const reqBody = {
      'voiceId': myVoiceId,
      'language': currLang,
      'text': scriptValue
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    });
    const options = {
      headers: headers,
      responseType: 'blob' as const
    }
    return this.http.post(
      `${environment.apiUrl}/api/voices/`,
      reqBody,
      options
    );
  }
}
