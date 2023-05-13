import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable, from, map } from 'rxjs';

// import { YOUTUBE_CLIENT_ID } from '../../appsecrets';

@Injectable({
  providedIn: 'root',
})
export class TranscriptRepository {

    constructor(
        private translate: TranslateService
    ) { /** */ }

    getTranscript(videoId: string): Observable<{ message: string, result: { translation: string }}> {
        const language = this.translate.currentLang;
        const config: AxiosRequestConfig = {
            method: 'post',
            url: `http://localhost:3000/api/download/`,
            data: {
                'videoId': videoId,
                'language': language,
            }
        };
        return from(axios(config)).pipe(
            map((response) => {
                console.log("🚀 ~ file: transcript.repo.ts:22 ~ TranscriptRepository ~ map ~ response:", response)
                return response.data;
            })
        );
    }
}
