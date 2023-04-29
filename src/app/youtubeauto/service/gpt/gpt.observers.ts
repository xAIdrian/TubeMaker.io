import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GptObservers {

  constructor(private http: HttpClient) {}

  postNewTopicObservable(): Observable<{ message: string; result: any }> {
    return this.http.get<{ message: string; result: any }>(
      'http://localhost:3000/api/openai/topic'
    );
  }

  getSummaryObservable(reqBody: {
    prompt: string;
  }): Observable<{ message: string; result: { id: string; summary: string } }> {
    return this.http.post<{
      message: string;
      result: { id: string; summary: string };
    }>('http://localhost:3000/api/openai/summary', reqBody);
  }

  postNewTitleObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { title: string } }> {
    return this.http.post<{ message: string; result: { title: string } }>(
      'http://localhost:3000/api/openai/new/title',
      reqBody
    );
  }

  postOptimizedTitleObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { title: string } }> {
    return this.http.post<{ message: string; result: { title: string } }>(
      'http://localhost:3000/api/openai/improve/title',
      reqBody
    );
  }

  postNewDescriptionObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { description: string } }> {
    return this.http.post<{ message: string; result: { description: string } }>(
      'http://localhost:3000/api/openai/new/description',
      reqBody
    );
  }

  postOptimizedDescriptionObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { description: string } }> {
    return this.http.post<{ message: string; result: { description: string } }>(
      'http://localhost:3000/api/openai/improve/description',
      reqBody
    );
  }

  postNewScriptSectionObservable(reqBody: { summary: string, style: string, point: string}): Observable<{ message: string, result: { script: string } }> {
    return this.http.post<{ message: string, result: { script: string } }>(
      'http://localhost:3000/api/openai/new/script',
      reqBody
    );
  }

  postOptimizeScriptSectionObservable(reqBody: { current: string }): Observable<{ message: string, result: { script: string } }> {
    return this.http.post<{ message: string, result: { script: string } }>(
      'http://localhost:3000/api/openai/improve/script',
      reqBody
    );
  }

  postNewTagsObservable(reqBody: {
    summary: string;
    style: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    return this.http.post<{ message: string; result: { tags: string } }>(
      'http://localhost:3000/api/openai/new/tags',
      reqBody
    );
  }

  postOptimizedTagsObservable(reqBody: {
    current: string;
  }): Observable<{ message: string; result: { tags: string } }> {
    return this.http.post<{ message: string; result: { tags: string } }>(
      'http://localhost:3000/api/openai/improve/tags',
      reqBody
    );
  }
}
