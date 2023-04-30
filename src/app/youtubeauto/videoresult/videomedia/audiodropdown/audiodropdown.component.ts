import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

interface DropdownItem {
  id: number;
  name: string;
  description: string;
  audioUrl: string;
}

@Component({
  selector: 'audio-dropdown',
  templateUrl: './audio-dropdown.component.html',
  styleUrls: ['./audio-dropdown.component.scss'],
})
export class AudioDropdownComponent implements OnInit {
  
  isOpen = false;
  selectedItem: { name: string, sampleUrl: string };
  voiceOptions: { name: string, sampleUrl: string }[] = [];

    mediaFormGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    // Set the default selected item
    this.selectedItem = {
        name: 'Select a voice',
        sampleUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
    };
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: { name: string, sampleUrl: string }) {
    this.selectedItem = item;
    this.isOpen = false;

    this.mediaFormGroup.patchValue({
        selectedVoice: item.sampleUrl,
    });
  }

  populateList(response: { name: string; sampleUrl: string; }[]) {
    this.voiceOptions = response;
  }

  setMediaGroup(refMediaFormFroup: FormGroup) {
    this.mediaFormGroup = refMediaFormFroup
  }
}