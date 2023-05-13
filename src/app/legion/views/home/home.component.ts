import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ HomeService } from './home.service';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit, AfterContentInit {

    videos: YoutubeVideoPage[] = [];
    
    constructor(
        private homeService: HomeService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.homeService.getCompleteVideoListObserver().subscribe((response) => {
            this.videos = response;
            this.changeDetectorRef.detectChanges();
        });
        this.homeService.getErrorObserver().subscribe((response) => {
            alert(response);
        });
    }

    ngAfterContentInit(): void {
        this.homeService.getCompleteVideoList();
        this.changeDetectorRef.detectChanges();
    }
}
