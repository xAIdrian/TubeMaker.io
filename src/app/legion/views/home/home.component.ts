import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ HomeService } from './home.service';
import { YoutubeVideoPage } from '../../model/youtubevideopage.model';
import { YoutubeVideo } from '../../model/video/youtubevideo.model';
import { match } from 'assert';
import { HumaneDateUtility } from '../../helper/humanedate.utility';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit, AfterContentInit, AfterViewInit {

    isLoading = true;

    videos: YoutubeVideoPage[] = [];
    youtubeVideos: YoutubeVideo[];
    
    constructor(
        private homeService: HomeService,
        private dateUtils: HumaneDateUtility,
        private changeDetectorRef: ChangeDetectorRef,
    ) { /** */ }

    ngOnInit() {
        this.homeService.getCompleteVideoListObserver().subscribe((response) => {
            console.log("🚀 ~ file: home.component.ts:27 ~ HomeComponent ~ this.homeService.getCompleteVideoListObserver ~ response:", response)
            this.isLoading = false
            this.videos = response;
            this.youtubeVideos = this.videos.map((videoPage) => {
                return {
                    id: videoPage.id ?? '',
                    title: videoPage.metadata?.title ?? '',
                    description: videoPage.metadata?.description ?? '',
                    thumbnailUrl: videoPage.youtubeVideo?.thumbnailUrl ?? 'https://i.ytimg.com/vi/kyV59RjHnCI/hqdefault.jpg',
                    channelTitle: videoPage.youtubeVideo?.channelTitle ?? 'you',
                    publishedAt: this.dateUtils.updateDateToHumanForm(videoPage.createdDate),
                } as YoutubeVideo
            });
            this.changeDetectorRef.detectChanges();
        });
        this.homeService.getErrorObserver().subscribe((response) => {
            this.isLoading = false
            alert(response);
        });
    }

    ngAfterContentInit() {
        this.homeService.getCompleteVideoList()
        this.changeDetectorRef.detectChanges();
    }

    ngAfterViewInit() {
        /** */
    }

    onItemSelectedEvent(video: YoutubeVideo) {
        console.log("🚀 ~ file: home.component.ts:51 ~ HomeComponent ~ onItemSelectedEvent ~ video:", video)
        // const matchingPage = this.videos.filter((videoPage) => { 
        //     console.log("🚀 ~ file: home.component.ts:52 ~ HomeComponent ~ matchingPage ~ videoPage:", videoPage)
        //     return videoPage.youtubeVideo.id === video.id 
        // } )[0];
        if (video !== undefined) {
            this.homeService.videoPageSelected(video.id ?? '');
        }
    }

    newCopyCat() {
        this.homeService.goToCopyCat();
    }

    newBrandNew() {
        this.homeService.goToAutoCreate();
    }
}
