import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AutoContentRepository } from '../../../model/youtubeauto/autocontent.repo';
import { ListVideo } from '../../../model/media/video/listvideo.model';
import { Router } from '@angular/router';
import { NavigationService } from '../../../service/navigation.service';
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