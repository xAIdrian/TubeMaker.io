import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from "@angular/core";
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
export class VideoScriptComponent implements OnInit, AfterContentInit {

  @Output() scriptFormGroupEvent = new EventEmitter<FormGroup>();
  
  isScriptLoading: boolean = false;
  scriptFormGroup: FormGroup;

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

  ngOnInit(): void {
    this.setupObservers();
    this.setupFormGroups();
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  setupObservers() {
    /**
     * This needs to be updated to use the new multiple sections that make up our script
     */
    this.gptService.getScriptSectionObserver().subscribe((response) => {
      this.isScriptLoading = false;
      
      switch (response.sectionControl) {
        case 'introduction':
          this.scriptFormGroup.patchValue({ introduction: response.scriptSection })
          break;
        case 'mainContent':
          this.scriptFormGroup.patchValue({ mainContent: response.scriptSection })
          break;
        case 'conclusion':
          this.scriptFormGroup.patchValue({ conclusion: response.scriptSection })
          break;
        case 'questions':
          this.scriptFormGroup.patchValue({ questions: response.scriptSection })
          break;
        case 'opinions':
          this.scriptFormGroup.patchValue({ opinions: response.scriptSection })
          break;
        case 'caseStudies':
          this.scriptFormGroup.patchValue({ caseStudies: response.scriptSection })
          break;
        case 'actionables':
          this.scriptFormGroup.patchValue({ actionables: response.scriptSection })
          break;
        default:
          console.log("🚀 ~ file: videoscript.component.ts:85 ~ VideoScriptComponent ~ this.gptService.getScriptSectionObserver ~ default:")
          break;
      }
    });
  }

  setupFormGroups() {
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

  onRerollSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.scriptFormGroup.patchValue({ controlName: 'Please wait...' })
    this.scriptFormGroupEvent.emit(this.scriptFormGroup);
  }

  onOptimizeSection(section: DurationSection) {
    section.isLoading = true;
    const controlName = section.controlName
    this.scriptFormGroup.patchValue({ controlName: 'Optimizing with AI..' })
    this.scriptFormGroupEvent.emit(this.scriptFormGroup);
  }
}

