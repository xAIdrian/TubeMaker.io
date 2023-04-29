import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { VoiceService } from '../../service/voice.service';
import { NavigationService } from '../../service/navigation.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';

import { GptGeneratedMetaData } from '../../model/gpt/gptgeneratedvideo.model';
import { GptService } from '../../service/gpt/gpt.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService } from '../../service/content.service';
import { VideoDuration } from '../../model/videoduration.model';
import { VideoScriptComponent } from '../videoscript/videoscript.component';

@Component({
  selector: 'video-result',
  templateUrl: './videodetails.component.html',
  styleUrls: ['./videodetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoDetailsComponent implements OnInit, AfterContentInit {

  @ViewChild('video-script') videoScriptStep: VideoScriptComponent
  
  scriptFormGroup: FormGroup;
  currentVideoDuration: VideoDuration;

  //debug variable to be removed
  isInDebugMode: boolean = false;
  ////////////////////////////

  progressValue: number = 0;
  progressLabel: string = 'Searching the web...';

  isLinear: any;
  isLoading: boolean = !this.isInDebugMode //should be set to true in production;

  isTitleLoading: boolean = false;
  isTitleOptimizing: boolean = false;

  isDescLoading: boolean = false;
  isDescOptimizing: boolean = false;

  isScriptLoading: boolean = false;
  isScriptOptimizing: boolean = false;

  isTagsLoading: boolean = false;
  isTagsOptimizing: boolean = false;

  resultsFormGroup: FormGroup;
  audioFormGroup: FormGroup;
  videoFormGroup: FormGroup;

  voiceOptions: { name: string, sampleUrl: string }[] = [];

  gptResponseTitle: string = 'Waiting for title...';
  gptResponseDescription: string = 'Waiting for desc...';
  gptResponseScript: string = 'Waiting for script...';
  gptResponseTags: string = 'Waiting for tags...';

  generatedAudio: string;
  generatedAudioIsVisible = false;

  audioFileName: string;
  videoFileName: string;
  imageFileName: string;

  constructor(
    private gptService: GptService,
    private voiceService: VoiceService,
    private contentService: ContentService,
    private navigationService: NavigationService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.contentService.getCurrentTopic() === undefined) {
      this.navigationService.navigateToCreateVideo();
      return
    }

    this.setupObservers();
    this.setupFormGroups();
    
    if (!this.isInDebugMode) { this.voiceService.getVoiceOptions() }
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    
    if (!this.isInDebugMode) { this.gptService.generateVideoContentWithAI(); }
  }

  setupObservers() {
    this.gptService.getProgressObserver().subscribe((response) => {
      this.progressValue = this.progressValue + response;
      if (this.progressValue === 20) {
        this.progressLabel = 'Researching the competition...';
      } else if (this.progressValue === 40) {
        this.progressLabel = 'Analyzing the market...';
      } else if (this.progressValue === 60) {
        this.progressLabel = 'Predicting trends...';
      } else if (this.progressValue === 80) {
        this.progressLabel = 'Writing the script...';
      } else if (this.progressValue === 100) {
        this.progressLabel = 'Done!';
      }
    });
    this.gptService.getCompleteResultsObserver().subscribe(
      (response: { meta: GptGeneratedMetaData }) => setTimeout(() => {
        this.isLoading = false;

        console.log(
          '🚀 ~ file: videoresult.component.ts:40 ~ VideoDetailsComponent ~ this.posterService.getResultsObserver.subscribe ~ response:',
          response
        );
        this.resultsFormGroup.setValue({
          title: response.meta.title.replace('"', '').trim(),
          description: response.meta.description.trim(),
          tags: response.meta.tags.join(', ').trim(),
        });
      }, 1000)
    );
    this.gptService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.isTitleOptimizing = false;
      this.resultsFormGroup.patchValue({ title: response.replace('"', '').trim() })
    });
    this.gptService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.isDescOptimizing = false;
      this.resultsFormGroup.patchValue({ description: response.trim() })
    });
    this.gptService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.isTagsOptimizing = false;
      this.resultsFormGroup.patchValue({ tags: response.join(', ').trim() })
    });

    this.voiceService.getVoiceOptionsObserver().subscribe((response) => {
      this.voiceOptions = response;
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }

  setupFormGroups() {
    this.resultsFormGroup = this._formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.audioFormGroup = this._formBuilder.group({
      selectedVoice: [''],
      audioFile: ['']
    });
    //TODO we will neeed this to be updated for our uploaded files held across services
    this.videoFormGroup = this._formBuilder.group({ 
      videoFile: ['', Validators.required],
      imageFile: ['', Validators.required],
     });
     this.scriptFormGroup = this._formBuilder.group({
      introduction: ['', Validators.required],
      mainContent: ['', Validators.required],
      conclusion: ['', Validators.required],
      questions: [''],
      opinions: [''],
      caseStudies: [''],
      actionables: [''],
    });
  }

  onScriptFormGroupChange(childFormGroup: FormGroup) {
    this.scriptFormGroup = childFormGroup;
  }

  rerollTitle() {
    this.isTitleLoading = true;
    this.resultsFormGroup.patchValue({ title: 'Please wait...' })
    this.gptService.updateNewTitle();
  }

  optimizeTitle() {
    if (this.resultsFormGroup.value.title === '') {
      this.resultsFormGroup.patchValue({ title: 'Please input a value to optimize' })
      return
    }
    this.isTitleOptimizing = true;
    this.gptService.optimizeTitle(
      this.resultsFormGroup.value.title,
    );
    this.resultsFormGroup.patchValue({ title: 'Please wait...' })
  }

  rerollDescription() {
    this.isDescLoading = true;
    this.resultsFormGroup.patchValue({ description: 'Please wait...' })
    this.gptService.updateNewDescription();
  }
  
  optimizeDesc() {
    if (this.resultsFormGroup.value.description === '') {
      this.resultsFormGroup.patchValue({ description: 'Please input a value to optimize' })
      return
    }
    this.isDescOptimizing = true;
    this.gptService.optimizeDescription(
      this.resultsFormGroup.value.description,
    );
    this.resultsFormGroup.patchValue({ description: 'Please wait...' })
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.resultsFormGroup.patchValue({ tags: 'Please wait...' })
    this.gptService.updateNewTags();
  }

  optimizeTags() {
    if (this.resultsFormGroup.value.tags === '') {
      this.resultsFormGroup.patchValue({ tags: 'Please input a value to optimize' })
      return
    }
    this.isTagsOptimizing = true;
    this.gptService.optimizeTags(
      this.resultsFormGroup.value.tags,
    );
    this.resultsFormGroup.patchValue({ tags: 'Please wait...' })
  }

  downloadTextFile() {
    // this.gptService.getScriptForDownload().subscribe((blobItem) => {
    //   saveAs(blobItem.blob, blobItem.filename);
    // });
  }
  
  onAudioPicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.audioFormGroup.patchValue({ audioFile: file.name });
        this.audioFileName = file.name;
        this.contentService.updateAudioFile(file);
      }
    }
  }  

  onVideoPicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.videoFormGroup.patchValue({ videoFile: file.name });
        this.videoFileName = file.name;
        this.contentService.updateVideoFile(file);
      }
    }
  }

  onImagePicked(event: Event) {
    const htmlTarget = (event?.target as HTMLInputElement)
    if (htmlTarget !== null) {
      if (htmlTarget.files !== null && htmlTarget.files.length > 0) {
        const file = htmlTarget.files[0]
        this.videoFormGroup.patchValue({ imageFile: file.name });
        this.imageFileName = file.name;
        this.contentService.updateImageFile(file);
      }
    }
  }

  generateTextToSpeech() {
    const scriptValue = this.resultsFormGroup.get('script')?.value;
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }
    this.generatedAudio = "";
    this.generatedAudioIsVisible = false;

    const selectedVoiceControl = this.audioFormGroup.get('selectedVoice')?.value;
    this.voiceService.generateTextToSpeech(
      selectedVoiceControl.value, 
      scriptValue
    );
  }

  descriptButtonClicked() {
    ///https://media.play.ht/full_-NTbzfZeyW_-qJQLq4Wg.mp3?generation=1682150707643372&alt=media
    window.open('https://web.descript.com/', '_blank');
  }

  goToReview() {
    this.navigationService.navigateToUploadVideo();
  }

  onReset() {
    this.navigationService.navigateToCreateVideo();
  }
}
