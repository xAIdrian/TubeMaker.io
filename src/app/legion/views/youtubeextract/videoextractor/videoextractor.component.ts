import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ContentRepository } from '../../../model/content.repo';
import { UserVideo } from '../../../model/video/uservideo.model';
import { Router } from '@angular/router';
import { NavigationService } from '../../../service/navigation.service';

@Component({
    selector: 'video-extractor',
    templateUrl: './videoextractor.component.html',
    styleUrls: ['./videoextractor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoExtractorComponent implements OnInit, AfterContentInit {

    videos: UserVideo[] = [];
    
    constructor(
        private router: Router,
        private contentRepo: ContentRepository,
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
        
    }
}