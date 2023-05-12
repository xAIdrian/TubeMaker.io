import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ VideoListService } from './videolist.service';
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
        private videoListService: VideoListService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.videoListService.getCompleteVideoListObserver().subscribe((response) => {
            this.videos = response;
            this.changeDetectorRef.detectChanges();
        });
        this.videoListService.getErrorObserver().subscribe((response) => {
            alert(response);
        });
    }

    ngAfterContentInit(): void {
        this.videoListService.getCompleteVideoList();
        this.changeDetectorRef.detectChanges();
    }
}
