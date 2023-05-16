import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface DropdownItem {
  id: number;
  name: string;
  description: string;
  audioUrl: string;
}

@Component({
  selector: 'audio-dropdown',
  templateUrl: './audiodropdown.component.html',
  styleUrls: ['./audiodropdown.component.scss'],
})
export class AudioDropdownComponent implements OnInit {
  @Output() voiceSelected = new EventEmitter<{ name: string; sampleUrl: string }>();

  isOpen = false;
  selectedItem: { name: string; sampleUrl: string };
  voiceOptions: { name: string; sampleUrl: string }[] = [];

  currentPlayingAudio: HTMLAudioElement;

  constructor(
    private translate: TranslateService
  ) {
    /** */
  }

  ngOnInit() {
    // Set the default selected item
    this.selectedItem = {
      name: this.translate.instant('extract.select_voice'),
      sampleUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
    };
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.currentPlayingAudio?.pause();
    }
  }

  onItemSelect(event: Event, item: { name: string; sampleUrl: string }) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedItem = item;
    this.isOpen = false;
    this.voiceSelected.emit(item);

    // this.mediaFormGroup.patchValue({
    //     selectedVoice: item.sampleUrl,
    // });
  }

  onItemPlay(audioPlayer: HTMLAudioElement) {
    this.currentPlayingAudio?.pause();
    
    this.currentPlayingAudio = audioPlayer;
    audioPlayer.play();
  }

  populateList(response: { name: string; sampleUrl: string }[]) {
    this.voiceOptions = response;
  }
}
