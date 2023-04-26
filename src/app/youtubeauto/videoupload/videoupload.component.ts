import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavigationService } from '../service/navigation.service';
import { MediaService } from '../service/media.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { YoutubeService } from '../service/youtube.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'video-upload',
  templateUrl: './videoupload.component.html',
  styleUrls: ['./videoupload.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoUploadComponent implements OnInit, AfterContentInit {

  isLoading: false;

  resultsFormGroup: FormGroup;
  uploadFormGroup: FormGroup;

  videoUrlPath: SafeUrl;
  imageUrlPath: SafeUrl;
  audioUrlPath: SafeUrl;
  hasCompletedYoutubeAuth: any;

  publishVideoClick() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private videoService: MediaService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private youtubeService: YoutubeService
  ) {}

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      this.authService.login();

    //   // @ts-ignore
    //   google.accounts.id.initialize({
    //     client_id:
    //       '355466863083-g129ts2hdg72gl5r3jiqrmg9i588cvqm.apps.googleusercontent.com',
    //     callback: this.handleCredentialResponse.bind(this),
    //     auto_select: false,
    //     cancel_on_tap_outside: true,
    //   });
    //   const parent = document.getElementById('google-signin-button');
    //   //@ts-ignore
    //   google.accounts.id.renderButton(parent, { theme: 'outline' });
    //   // @ts-ignore
    //   // google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    };

    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    this.videoService.getLatest();
  }

  loginOnClick() {
    // console.log("🚀 ~ file: videoupload.component.ts:77 ~ VideoUploadComponent ~ loginOnClick ~ loginOnClick:", this.authService.getAuthCode())
    
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      script: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.uploadFormGroup = this._formBuilder.group({
      audioFile: ['', Validators.required],
      videoFile: ['', Validators.required],
      imageFile: ['', Validators.required],
      isMadeForKids: [false],
    });
  }

  setupObservers() {
    this.videoService.getContentObserver().subscribe((content) => {
      this.resultsFormGroup.setValue({
        title: content.title,
        description: content.description,
        script: content.script,
        tags: content.tags,
      });
    });
    this.videoService.getMediaObserver().subscribe((media) => {
      this.imageUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.image.file
      );
      this.videoUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.video.file
      );
      this.audioUrlPath = this.sanitizer.bypassSecurityTrustUrl(
        media.audio.file
      );
    });
  }

  onMadeForKidsClicked(isForKids: boolean) {
    this.uploadFormGroup.patchValue({
      isMadeForKids: isForKids,
    });
  }

  copyTitle() {
    throw new Error('Method not implemented.');
  }

  onResetMedia() {
    this.navigationService.navigateToResults();
  }
  
  onResetContent() {
    this.navigationService.navigateToCreateVideo();
  }

  handleCredentialResponse(credentialResponse: CredentialResponse) {
  console.log("🚀 ~ file: videoupload.component.ts:130 ~ VideoUploadComponent ~ handleCredentialResponse ~ credentialResponse:", credentialResponse)

    this.authService.initGisClient();
    // console.log(
    //   '🚀 ~ file: videolist.component.ts:60 ~ VideoListComponent ~ handleCredentialResponse ~ credentialResponse:',
    //   credentialResponse
    // );
    // this.youtubeService.initYouTubeApiClient().subscribe((response) => {
    //   console.log(
    //     '🚀 ~ file: videolist.component.ts:63 ~ VideoListComponent ~ this.youtubeService.initYouTubeApiClient ~ response:',
    //     response
    //   );
    //   this.youtubeService.getChannels(credentialResponse.credential)
    // });
  }
}
