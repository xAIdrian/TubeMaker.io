import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { VideoService } from '../service/video.service';
import { Video } from '../service/video.model';
import { Router } from '@angular/router';

@Component({
    selector: 'video-create',
    templateUrl: './videocreate.component.html',
    styleUrls: ['./videocreate.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoCreateComponent implements OnInit, AfterContentInit {

    // private video: Video;
    
    constructor(
        private router: Router,
        private videoService: VideoService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        
    }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }
}