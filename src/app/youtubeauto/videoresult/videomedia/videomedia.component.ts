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
import { ContentService } from '../../service/content.service';
import { FormGroup } from '@angular/forms';
import { VoiceService } from '../../service/voice.service';
import { AudioDropdownComponent } from './audiodropdown/audiodropdown.component';

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
    console.log(
      '🚀 ~ file: videomedia.component.ts:17 ~ VideoMediaComponent ~ @ViewChild ~ content:',
      content
    );
    if (content) {
      // initially setter gets called with undefined
      this.audioDropdown = content;
    }
  }

  audioFormGroup: FormGroup;

  generatedAudioIsVisible = false;
  generatedAudio: string;

  voiceOptions: { name: string; sampleUrl: string }[] = [];
  selectedVoice: { name: string; sampleUrl: string };
  mediaOptions = ['Video', 'Thumbnail'];
  selectedMediaOption = 'Video';

  constructor(
    private contentService: ContentService,
    private voiceService: VoiceService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.voiceService.getVoiceOptionsObserver().subscribe((response) => {
      this.audioDropdown.populateList(response);
      this.changeDetectorRef.detectChanges();
    });
    this.voiceService.getTextToSpeechObserver().subscribe((response) => {
      if (response !== '') {
        this.generatedAudio = response;
        this.generatedAudioIsVisible = true;
      }
    });
  }
  //
  // this.changeDetector.detectChanges();
  /**
   * Where we receive updates from our parent FormControl
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['parentMediaFormGroup'] && this.parentMediaFormGroup) {
    //   console.log(
    //     '🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:',
    //     this.parentMediaFormGroup
    //   );
    //   this.parentMediaFormGroup
    //     .get('selectedVoice')
    //     ?.valueChanges.subscribe((value: string) => {
    //       /** */
    //     });
    // }
  }

  ngAfterContentInit(): void {
    this.voiceService.getVoiceOptions();
    console.log(
      '🚀 ~ file: videomedia.component.ts:64 ~ VideoMediaComponent ~ ngAfterContentInit ~ ngAfterContentInit:'
    );
    this.changeDetectorRef.detectChanges();
  }

  onVoiceSelected(voice: { name: string, sampleUrl: string }) {
    this.selectedVoice = voice;
  }

  downloadTextFile() {
    // this.gptService.getScriptForDownload().subscribe((blobItem) => {
    //   saveAs(blobItem.blob, blobItem.filename);
    // });
  }

  generateTextToSpeech() {
    if (this.selectedVoice === null || this.selectedVoice === undefined) {
      alert('Please select a voice before generating audio');
      return;
    }
    // const scriptValue = this.resultsFormGroup.get('script')?.value;
    const scriptValue = '';
    if (scriptValue === null || scriptValue === '') {
      alert('Please enter a script before generating audio');
      return;
    }

    this.generatedAudio = '';
    this.generatedAudioIsVisible = false;

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
    throw new Error('Method not implemented.');
  }
}
