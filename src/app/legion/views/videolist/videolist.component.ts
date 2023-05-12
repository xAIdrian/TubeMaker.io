import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ AutoContentRepository } from '../../repository/content/autocontent.repo';
import { Router } from '@angular/router';
import { NavigationService } from '../../service/navigation.service';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';

@Component({
    selector: 'video-list',
    templateUrl: './videolist.component.html',
    styleUrls: ['./videolist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoListComponent implements OnInit, AfterContentInit {

    videos: YoutubeVideoPage[] = [];
    
    constructor(
        private router: Router,
        private contentRepo: AutoContentRepository,
        private navigationService: NavigationService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
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
