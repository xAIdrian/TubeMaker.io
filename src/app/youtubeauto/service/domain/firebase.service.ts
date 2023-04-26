// Import the functions you need from the SDKs you need
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import * as path from 'path';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ListVideo } from '../../model/media/video/listvideo.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  // Initialize Firebase
  private app = initializeApp(environment.firebaseConfig);
  private analytics = getAnalytics(this.app);
  // Get a reference to the storage service, which is used to create references in your storage bucket
  private storage = getStorage(this.app);
  // Create a storage reference from our storage service
  private storageRef = ref(this.storage);
  // Create a child reference
  private speechRef = ref(this.storage, 'mp3');

  constructor() {}

  getStorage() {
    return getStorage();
  }

  getRef(storage: any, path: string) {
    return ref(storage, path);
  }

  uploadMp3(fileTitle: string, file: any, sumitmetadata: any): Observable<string> {
    const finalPath = ref(this.speechRef, fileTitle + '.mp3');
    try {
      // create file metadata
      const metadata = {
        contentType: 'audio/mpeg',
        metadata: sumitmetadata,
      };

      uploadBytes(this.speechRef, file, metadata).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        return of('Successful Upload');
      });
    } catch (error) {
      console.log(
        '🚀 ~ file: firebase.service.ts:64 ~ FirebaseService ~ uploadMp3 ~ error:',
        error
      );
      return of('Failed Upload');
    }
    return of('Failed Upload')
  }

  downloadFileForUrl(fileTitle: string): Observable<string> {
    try {
      const fileRef = ref(
        this.speechRef,
        fileTitle + '.mp3'
      );
      getDownloadURL(fileRef).then((url) => {
        return of(url);
      });
    } catch (error) {
      console.error(error);
      return of('Failed Download')
    }
    return of('Failed Download')
  }

  getDownloadURL(fileRef: FirebaseStorage) {
    getDownloadURL(ref(fileRef))
      .then((url) => {
        return url;
        // This can be downloaded directly:
        // const xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = (event) => {
        //   const blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();

        // // Or inserted into an <img> element
        // const img = document.getElementById('myimg');
        // img.setAttribute('src', url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  getVideos(): Observable<ListVideo[]> {
    throw new Error('Method not implemented.');
  }
}
