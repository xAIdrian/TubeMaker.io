import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
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

  showTitleBadge = false;
  showDescriptionBadge = false;
  showTagsBadge = false;

  constructor(
    private formGroupBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private extractDeatilsService: ExtractDetailsService,
    private clipboard: Clipboard
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
      this.infoFormGroup.patchValue({ tags: response.join(' #').trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.infoFormGroup = this.formGroupBuilder.group({
      title: ["Chargement...", Validators.required],
      description: ["Chargement...", Validators.required],
      tags: ["Chargement...", Validators.required],
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

  copyTitle() { 
    this.showTitleBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.title);
    setTimeout(() => this.showTitleBadge = false, 1000);  
  }

  copyDescription() { 
    this.showDescriptionBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.description); 
    setTimeout(() => this.showDescriptionBadge = false, 1000); 
  }

  copyTags() { 
    this.showTagsBadge = true;
    this.clipboard.copy(this.infoFormGroup.value.tags); 
    setTimeout(() => this.showTagsBadge = false, 1000); 
  }
}
