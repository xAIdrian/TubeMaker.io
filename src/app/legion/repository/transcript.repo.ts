import { Injectable } from '@angular/core';
import { TextSplitUtility } from '../helper/textsplit.utility';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable, from, map } from 'rxjs';

// import { YOUTUBE_CLIENT_ID } from '../../appsecrets';

@Injectable({
  providedIn: 'root',
})
export class TranscriptRepository {

    constructor(
        private textSplitter: TextSplitUtility,
    ) { /** */ }

    getTranscript(videoId: string): Observable<{ message: string, result: { translation: string[] }}> {
        const config: AxiosRequestConfig = {
            method: 'get',
            url: `http://localhost:3000/api/download/${videoId}`
        };
        return from(axios(config)).pipe(
            map((response) => {
                console.log("🚀 ~ file: transcript.repo.ts:22 ~ TranscriptRepository ~ map ~ response:", response)
                if (response.data.message === 'success') {
                    return {
                        message: response.data.message,
                        result: {
                            translation: this.textSplitter.splitIntoParagraphs(response.data.result.translation)
                        }
                    }
                } else {
                    return response.data
                }
            })
        );
    }
}