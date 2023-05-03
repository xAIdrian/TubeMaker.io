import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'video-media',
  templateUrl: './videomedia.component.html',
  styleUrls: ['./videomedia.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoMediaComponent implements OnInit, AfterContentInit {

  @ViewChild('audioPlayer', {static: false}) audioPlayer: ElementRef;
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
  generatedAudioUrl: string;

  voiceOptions: { name: string; sampleUrl: string }[] = [];
  selectedVoice: { name: string; sampleUrl: string };
  mediaOptions = ['Video', 'Thumbnail'];
  selectedMediaOption = 'Video';

  constructor(
    private contentRepo: ContentRepository,
    private voiceService: VoiceService,
    private navigationService: NavigationService,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.voiceService.getErrorObserver().subscribe((response) => {
      this.generateAudioLoading = false;
      alert(response);
    });
    this.voiceService.getVoiceSamplesObserver().subscribe((response) => {
      this.audioDropdown.populateList(response);
      this.changeDetectorRef.detectChanges();
    });
    this.translate.onLangChange.subscribe(() => {
      this.voiceService.getVoices();
    });
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
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }

    this.generatedAudioIsVisible = false;
    this.generateAudioLoading = true;

    this.voiceService.generateTextToSpeech(
      this.selectedVoice.name,
      scriptValue
    ).subscribe({
      next: (response) => {
        console.log(response)
        this.generatedAudioIsVisible = true;
        this.generatedAudioUrl = URL.createObjectURL(response);

        this.audioPlayer.nativeElement.load();
        this.audioPlayer.nativeElement.play();
      },
      error: (error) => {
        console.log('error', error)
      },
      complete: () => {
        console.log('complete')
        this.generateAudioLoading = false;
      }
    });
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
