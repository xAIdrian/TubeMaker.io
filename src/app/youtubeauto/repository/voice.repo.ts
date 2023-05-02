import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  throwError,
  Subject,
  catchError,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class VoiceRepository {

  constructor(
    private http: HttpClient
    ) { /** */ }

  getListOfVoices(): Observable<{ message: string, result: { name: string, id: string }[]}> {
    return this.http.get<{ message: string, result: { name: string, id: string }[]}>(
      `http://localhost:3000/api/voices`
    );
  }
}