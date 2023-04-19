import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { PosterService } from '../service/poster.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { saveAs } from 'file-saver';

@Component({
  selector: 'video-result',
  templateUrl: './videoresult.component.html',
  styleUrls: ['./videoresult.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class VideoResultComponent implements OnInit, AfterContentInit {
  
  gptResponse: string = 'Waiting for response...';

  isLinear: any;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    private posterService: PosterService,
    private _formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.posterService.getResultsObserver.subscribe((response: any) => {
        console.log("🚀 ~ file: videoresult.component.ts:40 ~ VideoResultComponent ~ this.posterService.getResultsObserver.subscribe ~ response:", response)
        this.gptResponse = response.generatedVideo.script;
    });

    this.firstFormGroup = this._formBuilder.group({
        subject: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
        selectedStyle: ['', Validators.required],
        selectedDuration: ['', Validators.required],
      });
      this.thirdFormGroup = this._formBuilder.group({
        selectedVoice: [''],
      });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
    this.posterService.getGptContent()
  }
  
  onReset() {
    this.posterService.backNavigation();
  }

  downloadTextFile() {
    this.posterService.getScriptForDownload().subscribe(blobItem => {
        saveAs(blobItem.blob, blobItem.filename) 
    });
  }

  onSchedule() {

  }
}
