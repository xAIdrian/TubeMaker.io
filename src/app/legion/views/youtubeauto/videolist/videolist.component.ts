import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ AutoContentModel } from '../../../model/autocontent.model';
import { UserVideo } from '../../../model/video/uservideo.model';
import { Router } from '@angular/router';
import { NavigationService } from '../../../service/navigation.service';
@Component({
    selector: 'video-list',
    templateUrl: './videolist.component.html',
    styleUrls: ['./videolist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoListComponent implements OnInit, AfterContentInit {

    videos: UserVideo[] = [];
    
    constructor(
        private router: Router,
        private contentRepo: AutoContentModel,
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