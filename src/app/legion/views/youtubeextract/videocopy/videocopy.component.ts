import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ExtractContentRepository } from '../../../repository/content/extractcontent.repo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YoutubeVideo } from 'src/app/legion/model/video/youtubevideo.model';
import { VideoNiche } from '../../../model/autocreate/videoniche.model';
import { ExtractDetailsService } from '../extractdetails.service';

@Component({
  selector: 'video-copy',
  templateUrl: './videocopy.component.html',
  styleUrls: ['./videocopy.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
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
    value: '',
  };

  inputValue = '';

  constructor(
    private contentModel: ExtractContentRepository,
    private extractDetailsService: ExtractDetailsService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.extractDetailsService.clearCurrentVideoPage();
    this.contentModel.getDefaultVideoNiches();
    this.changeDetectorRef.detectChanges();
  }

  private setupObservers() {
    this.contentModel.getDefaultVideoNichesObserver().subscribe({
      next: (videoNiches: VideoNiche[]) => (this.videoNiches = videoNiches),
    });
    this.extractDetailsService.getErrorObserver().subscribe({
      next: (error: any) => {
        this.isLoading = false;
        this.showErrorState = true;
        this.errorText = error;
      },
    });
    this.extractDetailsService.getYoutubeVideosObserver().subscribe({
      next: (videos: YoutubeVideo[]) => {
        this.isLoading = false;
        this.youtubeVideos = videos;
      },
      complete: () => {
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  onVideoOptionSelected(niche: VideoNiche) {
    this.selectedVideoNiche = niche;
    this.isLoading = true;
    this.youtubeVideos = [];
    this.extractDetailsService.searchYoutubeVideos(niche.value);
  }

  onItemSelectedEvent(video: YoutubeVideo) {
    if (video !== undefined) {
      this.extractDetailsService.setCopyCatVideoId(video);
    }
  }

  private setupFormGroups() {
    this.nicheFormGroup = this._formBuilder.group({
      url: [''],
      selectedNiche: ['', Validators.required],
    });
  }

  onSearchClick() {
    const urlValue = this.nicheFormGroup.value.url;
    if (urlValue !== undefined && urlValue !== '') {
      this.isLoading = true;
      this.showErrorState = false;
      this.extractDetailsService.searchYoutubeVideos(urlValue);
    } else {
      this.showErrorState = true;
      this.errorText = 'Please input a url.';
    }
  }
}
