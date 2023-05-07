import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GptService } from '../../../../service/gpt.service';

@Component({
  selector: 'title-details',
  templateUrl: './titledetails.component.html',
  styleUrls: ['./titledetails.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TitleDetailsComponent implements OnInit, AfterContentInit {

  infoFormGroup: FormGroup;
  isTitleLoading: boolean = false;
  isTitleOptimizing: boolean = false;
  isDescLoading: boolean = false;
  isDescOptimizing: boolean = false;
  isTagsLoading: boolean = false;
  isTagsOptimizing: boolean = false;

  constructor(
    private formGroupBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private gptService: GptService
  ) {
    /** */
  }

  ngOnInit() {
    // this.gptService.getTitleInfoOserver().subscribe({
    //   GptGeneratedMetaData
    //   this.infoFormGroup.setValue({
    //     title: response.meta.title.replace('"', '').trim(),
    //     description: response.meta.description.trim(),
    //     tags: response.meta.tags.join(', ').trim(),
    //   });
    // })
    this.gptService.getTitleObserver().subscribe((response) => {
      this.isTitleLoading = false;
      this.isTitleOptimizing = false;
      this.infoFormGroup.patchValue({ title: response.replace('"', '').trim() })
    });
    this.gptService.getDescriptionObserver().subscribe((response) => {
      this.isDescLoading = false;
      this.isDescOptimizing = false;
      this.infoFormGroup.patchValue({ description: response.trim() })
    });
    this.gptService.getTagsObserver().subscribe((response) => {  
      this.isTagsLoading = false;
      this.isTagsOptimizing = false;
      this.infoFormGroup.patchValue({ tags: response.join(', ').trim() })
    });
    this.infoFormGroup = this.formGroupBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tags: ['', Validators.required],
    });
    // this.gptService().generateTitleInfoFromYoutube()
  }

  ngAfterContentInit() {
    this.changeDetectorRef.detectChanges();
  }

  updateTitle(prompt: string) {
    this.isTitleLoading = true;
    this.gptService.updateNewTitle();
  }

  updateDescription(prompt: string) {
    this.isDescLoading = true;
    this.gptService.updateNewDescription();
  }

  updateTags(prompt: string) {
    this.isTagsLoading = true;
    this.gptService.updateNewTags();
  }

  onTitleSubmitClick() {
    // this.contentRepo.submitInfos(
    //   this.infoFormGroup.value.title,
    //   this.infoFormGroup.value.description,
    //   this.infoFormGroup.value.tags,
    // );
  }
}
