import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import { YoutubeService } from '../youtube.service';

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

  loadingCount = 0;

  constructor(
    private formGroupBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private youtubeService: YoutubeService,
    private clipboard: Clipboard
  ) {
    /** */
  }

  ngOnInit() {
    this.youtubeService.getTitleObserver().subscribe((response) => {
      this.loadingCount ++;
      this.isTitleLoading = false;
      this.titleFormGroup.patchValue({ title: response.replace('\"', '').trim() })
      this.changeDetectorRef.detectChanges();
    });
    
    this.youtubeService.getDescriptionObserver().subscribe((response) => {
      this.loadingCount ++;
      this.isDescLoading = false;
      this.titleFormGroup.patchValue({ description: response.trim() })
      this.changeDetectorRef.detectChanges();
    });

    this.youtubeService.getTagsObserver().subscribe((response) => {  
      this.loadingCount ++;
      this.isTagsLoading = false;
      this.titleFormGroup.patchValue({ tags: response.join(' #').trim() })
      this.changeDetectorRef.detectChanges();
    });

    this.titleFormGroup = this.formGroupBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
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
        if (this.parentVideoId === '') {
          this.youtubeService.getNewVideoMetaData();
        } else {
          this.youtubeService.getNewVideoMetaData();
        }
      }
    }
  }

  onTitleImproveClick(prompt: string) {
    this.isTitleLoading = true;
    this.youtubeService.updateTitle(
      prompt,
      this.titleFormGroup.value.title,
    );
  }

  onDescriptionImproveClick(prompt: string) {
    this.isDescLoading = true;
    this.youtubeService.updateDescription(
      prompt,
      this.titleFormGroup.value.description,
    );
  }

  rerollTags() {
    this.isTagsLoading = true;
    this.youtubeService.updateTags()
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
