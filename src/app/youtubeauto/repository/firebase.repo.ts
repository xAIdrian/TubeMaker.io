// Import the functions you need from the SDKs you need
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
  StorageReference,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { Injectable } from '@angular/core';
import { from, map, Observable, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class FirebaseRepository {
  // getVideos(): Observable<ListVideo[]> {
  //   return this.firebaseService.getVideos().subscribe((data: ListVideo[]) => {
  //     this.exampleVideos = data;
  //   }).then(() => {
  //     return of(this.exampleVideos);
  //   }
  // }

  // Initialize Firebase
  // private app = initializeApp(environment.firebaseConfig);
  // private analytics = getAnalytics(this.app);
  // // Get a reference to the storage service, which is used to create references in your storage bucket
  // private storageService = getStorage(this.app);
  // // Create a storage reference from our storage service
  // private rootRef = ref(this.storageService);
  // // Create a child reference
  // private voiceSamplesRef = ref(this.storageService, 'voice_samples');

  constructor(
    private translate: TranslateService,
    private storage: AngularFireStorage
  ) {}

  getSampleVoices(): Observable<{ name: string, sampleUrl: string }[]> {
    let voicesSampleRef = this.storage.ref('voice_samples');
    return from(voicesSampleRef.listAll()).pipe(
      map(list => {
        const urlMap: { name: string, sampleUrl: string }[] = [];
        list.items.forEach(itemRef => {
          itemRef.getDownloadURL().then(url => {
            urlMap.push({
              name: itemRef.name.replace('.mp3', ''), 
              sampleUrl: url
            });
          });
        });
        return urlMap;
      })
    );
  }

  getDownloadURL(ref: StorageReference): Observable<string> {
    return from(getDownloadURL(ref)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        return url;
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
          default:
            return 'Something went wrong getting url';
        }
        return '';
      }));
  }
}
