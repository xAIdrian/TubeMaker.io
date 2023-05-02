import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ContentRepository } from '../../repository/content.repo';
import { FormGroup } from '@angular/forms';
import { VoiceService } from '../../service/voice.service';
import { AudioDropdownComponent } from './audiodropdown/audiodropdown.component';
import * as saveAs from 'file-saver';
import { NavigationService } from '../../service/navigation.service';

@Component({
  selector: 'video-media',
  templateUrl: './videomedia.component.html',
  styleUrls: ['./videomedia.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoMediaComponent
  implements OnInit, AfterContentInit, OnChanges
{
  private audioDropdown: AudioDropdownComponent;

  @ViewChild('audiochild', { static: false }) set content(
    content: AudioDropdownComponent
  ) {
    if (content) {
      // initially setter gets called with undefined
      this.audioDropdown = content;
    }
  }

  audioFormGroup: FormGroup;

  generateAudioLoading = false;
  generatedAudioIsVisible = false;
  generatedAudio: string;

  voiceOptions: { name: string; sampleUrl: string }[] = [];
  selectedVoice: { name: string; sampleUrl: string };
  mediaOptions = ['Video', 'Thumbnail'];
  selectedMediaOption = 'Video';

  constructor(
    private contentRepo: ContentRepository,
    private voiceService: VoiceService,
    private navigationService: NavigationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.voiceService.getErrorObserver().subscribe((response) => {
      this.generateAudioLoading = false;
      alert(response);
    });
    this.voiceService.getVoiceSamplesObserver().subscribe((response) => {
      console.log("🚀 ~ file: videomedia.component.ts:59 ~ this.voiceService.getVoiceSamplesObserver ~ response:", response)
      this.audioDropdown.populateList(response);
      this.changeDetectorRef.detectChanges();
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      this.generateAudioLoading = false;
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }
  
  /**
   * Where we receive updates from our parent FormControl
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
  }

  ngAfterContentInit(): void {
    this.voiceService.getVoices();
    console.log(
      '🚀 ~ file: videomedia.component.ts:64 ~ VideoMediaComponent ~ ngAfterContentInit ~ ngAfterContentInit:'
    );
    this.changeDetectorRef.detectChanges();
  }

  onVoiceSelected(voice: { name: string, sampleUrl: string }) {
    this.selectedVoice = voice;
  }

  downloadTextFile() {
    this.contentRepo.getScriptForDownload().subscribe((blobItem) => {
      saveAs(blobItem.blob, blobItem.filename);
    });
  }

  generateTextToSpeech() {
    if (this.selectedVoice === null || this.selectedVoice === undefined) {
      alert('Please select a voice before generating audio');
      return;
    }

    const scriptValue = this.contentRepo.getCompleteScript();
    // if (scriptValue === null || scriptValue === '') {
    //   alert('Please enter a script before generating audio');
    //   return;
    // }

    this.generatedAudio = '';
    this.generatedAudioIsVisible = false;
    this.generateAudioLoading = true;

    this.voiceService.generateTextToSpeech(
      this.selectedVoice.name,
      scriptValue
    );
  }

  descriptButtonClicked() {
    ///https://media.play.ht/full_-NTbzfZeyW_-qJQLq4Wg.mp3?generation=1682150707643372&alt=media
    window.open('https://web.descript.com/', '_blank');
  }

  onMediaOptionSelected(option: string) {
    this.selectedMediaOption = option;
  }

  goToReview() {
    this.navigationService.navigateToUploadVideo();
  }
}
