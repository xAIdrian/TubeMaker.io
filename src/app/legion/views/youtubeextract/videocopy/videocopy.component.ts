import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import{ ExtractContentModel } from '../../../model/extractcontent.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YoutubeVideo } from 'src/app/legion/model/video/youtubevideo.model';
import { VideoNiche } from '../../../model/autocreate/videoniche.model';
import { ExtractDetailsService } from '../extractdetails.service';

@Component({
    selector: 'video-copy',
    templateUrl: './videocopy.component.html',
    styleUrls: ['./videocopy.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoCopyComponent implements OnInit, AfterContentInit {

    isLoading = false;
    showErrorState = false;
    nicheFormGroup: FormGroup;

    videoNiches: VideoNiche[] = [];
    searchVideos: YoutubeVideo[] = [];
    selectedVideoNiche: VideoNiche = {
        name: '',
        header: '',
        description: '',
    }
    
    constructor(
        private contentModel: ExtractContentModel,
        private extractDetailsService: ExtractDetailsService,
        private _formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.setupObservers();
        this.setupFormGroups();
    }

    ngAfterContentInit(): void {
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
        this.extractDetailsService.getErrorObserver().subscribe({
            next: (error: any) => {
                this.isLoading = false;
                this.showErrorState = true;
            }
        });
        this.extractDetailsService.getYoutubeVideosObserver().subscribe({
            next: (videos: YoutubeVideo[]) => {
                console.log(videos);
                this.isLoading = false;
                this.searchVideos = videos;
            },
            complete: () => {
                this.isLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    private setupFormGroups() {
        this.nicheFormGroup = this._formBuilder.group({
            selectedNiche: ['', Validators.required]
        });
    }

    onVideoOptionSelected(niche: VideoNiche) {
        this.selectedVideoNiche = niche;
        this.searchVideos = [ /** */ ];
        this.isLoading = true;
        this.extractDetailsService.searchYoutubeVideos(niche.name);
    }

    onCopyCatClick(video: YoutubeVideo) {
        this.extractDetailsService.setCopyCatVideoId(video);
    }
}