import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentGenerationService } from '../../../../service/content/generation.service';
import { ExtractDetailsService } from '../../extractdetails.service';

@Component({
  selector: 'title-details',
  templateUrl: './titledetails.component.html',
  styleUrls: ['./titledetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TitleDetailsComponent implements OnInit, AfterContentInit {

  infoFormGroup: FormGroup;

  isTitleLoading: boolean = false;
  isDescLoading: boolean = false;
  isTagsLoading: boolean = false;

  constructor(
    private formGroupBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private extractDeatilsService: ExtractDetailsService
  ) {
    /** */
  }

  ngOnInit() {
    this.extractDeatilsService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.infoFormGroup.patchValue({ title: response.replace('"', '').trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.extractDeatilsService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.infoFormGroup.patchValue({ description: response.trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.extractDeatilsService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.infoFormGroup.patchValue({ tags: response.join(', ').trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.infoFormGroup = this.formGroupBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
    });
    this.extractDeatilsService.getVideoMetaData()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges();
  }

  onTitleImproveClick(prompt: string) {
    this.isTitleLoading = true;
    this.extractDeatilsService.updateTitle(
      prompt,
      this.infoFormGroup.value.title,
    );
  }

  onDescriptionImproveClick(prompt: string) {
    this.isDescLoading = true;
    this.extractDeatilsService.updateDescription(
      prompt,
      this.infoFormGroup.value.description,
    );
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.extractDeatilsService.updateTags()
  }

  onSubmitClick() {
    this.extractDeatilsService.submitInfos(
      this.infoFormGroup.value.title,
      this.infoFormGroup.value.description,
      this.infoFormGroup.value.tags,
    );
  }
}
