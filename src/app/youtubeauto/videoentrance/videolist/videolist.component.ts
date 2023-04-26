import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MediaService } from '../../service/media.service';
import { ListVideo } from '../../model/media/video/listvideo.model';
import { Router } from '@angular/router';
import { NavigationService } from '../../service/navigation.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap'
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'video-list',
    templateUrl: './videolist.component.html',
    styleUrls: ['./videolist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoListComponent implements OnInit, AfterContentInit {

    videos: ListVideo[] = [];
    
    constructor(
        private router: Router,
        private videoService: MediaService,
        private authService: AuthService,
        private navigationService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        // @ts-ignore
        window.onGoogleLibraryLoad = () => {

            // @ts-ignore
            google.accounts.id.initialize({
                client_id: '355466863083-g129ts2hdg72gl5r3jiqrmg9i588cvqm.apps.googleusercontent.com',
                callback: this.handleCredentialResponse.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true,
            });
            const parent = document.getElementById('google-signin-button');
            // @ts-ignore
            google.accounts.id.renderButton(parent,
                { theme: 'outline', width: 240, height: 50 }
            );
            // @ts-ignore
            google.accounts.id.prompt((notification: PromptMomentNotification) => {
                console.log("🚀 ~ file: videolist.component.ts:46 ~ VideoListComponent ~ google.accounts.id.prompt ~ notification:", notification)
                // OPTIONAL: In my case I want to redirect the user to an specific path.
            });
        };
        // this.videoService.getVideos().subscribe(videos => {
        //     this.videos = videos;
        //     console.log("🚀 ~ file: videolist.component.ts:25 ~ VideoListComponent ~ ngOnInit ~ this.videos", this.videos)
        // });
    }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    newVideoOnClick() {
        this.navigationService.navigateToCreateVideo();
    }

    handleCredentialResponse(credentialResponse: CredentialResponse) {
        console.log("🚀 ~ file: videolist.component.ts:60 ~ VideoListComponent ~ handleCredentialResponse ~ credentialResponse:", credentialResponse)
        
        // this.authService.signInWithGoogle(credentialResponse.credential).subscribe((response) => {
            //additional work in this service function and in its response subscription
        // });
    }
}