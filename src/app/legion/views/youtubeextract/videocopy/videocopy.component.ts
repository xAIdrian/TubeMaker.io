import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import{ ExtractContentRepository } from '../../../repository/content/extractcontent.repo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YoutubeVideo } from 'src/app/legion/model/video/youtubevideo.model';
import { VideoNiche } from '../../../model/autocreate/videoniche.model';
import { YoutubeExtractService } from '../youtubeextract.service';

@Component({
    selector: 'video-copy',
    templateUrl: './videocopy.component.html',
    styleUrls: ['./videocopy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoCopyComponent implements OnInit, AfterContentInit {

    isLoading = false;
    showErrorState = false;
    errorText = '';

    nicheFormGroup: FormGroup;

    youtubeVideos: YoutubeVideo[] = [];
    videoNiches: VideoNiche[] = [];
    selectedVideoNiche: VideoNiche = {
        name: '',
        header: '',
        description: '',
        value: ''
    }
    
    constructor(
        private contentModel: ExtractContentRepository,
        private extractService: YoutubeExtractService,
        private _formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.setupObservers();
        this.setupFormGroups();
    }

    ngAfterContentInit(): void {
        this.extractService.clearCurrentVideoPage()
        this.changeDetectorRef.detectChanges();
    }

    private setupObservers() {
        this.contentModel.getInitVideoNiche(
            'Welcome To Youtube Automation',
            'We\'re excited to have you join us on this journey of passive income with faceless youtube channels.  Just select a niche to the left of this text and we will present you will the most profitable videos on youtube this week.  You can then copy these videos and upload them to your own channel.  We will even provide you with the script to use for your video.  Just click the copy button and you\'re on your way to making money with youtube.'
        ).subscribe({
            next: (videoNiche: VideoNiche) => {
                this.selectedVideoNiche = videoNiche;
            }
        });
        this.contentModel.getDefaultVideoNichesObserver().subscribe({
            next: (videoNiches: VideoNiche[]) => this.videoNiches = videoNiches
        });
        this.extractService.getErrorObserver().subscribe({
            next: (error: any) => {
                this.isLoading = false;
                this.showErrorState = true;
                this.errorText = error;
            }
        });
        this.extractService.getYoutubeVideosObserver().subscribe({
            next: (videos: YoutubeVideo[]) => {
                this.isLoading = false;
                this.youtubeVideos = videos;
            },
            complete: () => {
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    onVideoOptionSelected(niche: VideoNiche) {
        this.selectedVideoNiche = niche;
        this.isLoading = true;
        this.youtubeVideos = [];
        this.extractService.searchYoutubeVideos(niche.value);
    }

    onItemSelectedEvent(video: YoutubeVideo) {
        if (video !== undefined) {
            this.extractService.setCopyCatVideoId(video);
        }
    }

    private setupFormGroups() {
        this.nicheFormGroup = this._formBuilder.group({
            url : [''],
            selectedNiche: ['', Validators.required]
        });
    }
}
