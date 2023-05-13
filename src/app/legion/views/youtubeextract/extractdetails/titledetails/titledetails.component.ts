import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { ExtractDetailsService } from '../../extractdetails.service';

@Component({
  selector: 'title-details',
  templateUrl: './titledetails.component.html',
  styleUrls: ['./titledetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TitleDetailsComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() parentVideoId: string;
  
  titleFormGroup: FormGroup;

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
      this.titleFormGroup.patchValue({ title: response.replace('"', '').trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.extractDeatilsService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.titleFormGroup.patchValue({ description: response.trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.extractDeatilsService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.titleFormGroup.patchValue({ tags: response.join(' #').trim() })
      this.changeDetectorRef.detectChanges();
    });
    this.titleFormGroup = this.formGroupBuilder.group({
      title: ["Chargement...", Validators.required],
      description: ["Chargement...", Validators.required],
      tags: ["Chargement...", Validators.required],
    });
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['parentVideoId']) {
      this.parentVideoId = changes['parentVideoId'].currentValue;
      if (this.parentVideoId !== undefined && this.parentVideoId !== null) {
        if (this.parentVideoId == '') {
          this.extractDeatilsService.getNewVideoMetaData();
        } else {
          this.extractDeatilsService.getVideoMetaData();
        }
      }
    }
  }

  onTitleImproveClick(prompt: string) {
    this.isTitleLoading = true;
    this.extractDeatilsService.updateTitle(
      prompt,
      this.titleFormGroup.value.title,
    );
  }

  onDescriptionImproveClick(prompt: string) {
    this.isDescLoading = true;
    this.extractDeatilsService.updateDescription(
      prompt,
      this.titleFormGroup.value.description,
    );
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.extractDeatilsService.updateTags()
  }

  copyTitle() { 
    this.showTitleBadge = true;
    this.clipboard.copy(this.titleFormGroup.value.title);
    setTimeout(() => this.showTitleBadge = false, 1000);  
  }

  copyDescription() { 
    this.showDescriptionBadge = true;
    this.clipboard.copy(this.titleFormGroup.value.description); 
    setTimeout(() => this.showDescriptionBadge = false, 1000); 
  }

  copyTags() { 
    this.showTagsBadge = true;
    this.clipboard.copy(this.titleFormGroup.value.tags); 
    setTimeout(() => this.showTagsBadge = false, 1000); 
  }
}
