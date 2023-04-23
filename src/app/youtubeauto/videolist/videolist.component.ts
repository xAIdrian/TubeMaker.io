import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { VideoService } from '../service/video.service';
import { ListVideo } from '../model/video/listvideo.model';
import { Router } from '@angular/router';
import { NavigationService } from '../service/navigation.service';

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
        private videoService: VideoService,
        private navigationService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
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
}