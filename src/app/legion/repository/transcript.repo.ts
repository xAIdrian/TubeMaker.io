import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable, from, map } from 'rxjs';

// import { YOUTUBE_CLIENT_ID } from '../../appsecrets';

@Injectable({
  providedIn: 'root',
})
export class TranscriptRepository {

    constructor() { /** */ }

    getTranscript(videoId: string): Observable<{ message: string, result: { translation: string }}> {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: `http://localhost:3000/api/download/${videoId}`
        };
        return from(axios(config)).pipe(
            map((response) => {
                console.log("🚀 ~ file: transcript.repo.ts:22 ~ TranscriptRepository ~ map ~ response:", response)
                return response.data;
            })
        );
    }
}