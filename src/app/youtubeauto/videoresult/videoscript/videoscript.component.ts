import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { GptService } from "../../service/gpt/gpt.service";
import { ContentService } from "../../service/content.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DurationSection, VideoDuration } from "../../model/videoduration.model";

@Component({
  selector: 'video-script',
  templateUrl: './videoscript.component.html',
  styleUrls: ['./videoscript.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoScriptComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() parentFormGroup: FormGroup;
  childparentFormGroup: FormGroup;
  
  isScriptLoading: boolean = false;

  currentVideoDuration: VideoDuration = {
    name: 'please wait',
    header: "",
    description: "",
    sections: [
      {
        name: '',
        controlName: '',
        isLoading: false,
        isOptimizing: false,
        points: []
      }
    ]
  }

  constructor(
    private gptService: GptService,
    private contentService: ContentService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.currentVideoDuration = contentService.getCurrentVideoDuration();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("🚀 ~ file: videoscript.component.ts:44 ~ VideoScriptComponent ~ ngOnChanges ~ changes:", changes)
    if (changes["parentFormGroup"] && this.parentFormGroup) {
      console.log("🚀 ~ file: videoscript.component.ts:45 ~ VideoScriptComponent ~ ngOnChanges ~ parentFormGroup:", this.parentFormGroup)
      // Get the FormGroup data and update the child component's view
      

      // Update the child component's view with the FormGroup data
      // For example:
      // this.firstNameControl.setValue(firstName);
      // this.lastNameControl.setValue(lastName);
    }
  }

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    console.log("🚀 ~ file: videoscript.component.ts:66 ~ VideoScriptComponent ~ ngAfterContentInit ~ this.currentVideoDuration", this.parentFormGroup)
  }

  setupObservers() {
    
  }

  setupFormGroups() {
  }

  onRerollSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.parentFormGroup.patchValue({ controlName: 'Please wait...' })
  }

  onOptimizeSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.parentFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
  }
}

