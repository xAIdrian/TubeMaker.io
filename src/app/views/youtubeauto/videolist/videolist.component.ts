import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'video-list',
    templateUrl: './videolist.component.html',
    styleUrls: ['./videolist.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoListComponent implements AfterContentInit {
    
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: UntypedFormBuilder
    ) { }

    ngAfterContentInit(): void {
        this.changeDetectorRef.detectChanges();
    }

    checkBoxes = this.formBuilder.group({
        one: true,
        two: false,
        three: false,
        four: false
      });
    
      setValue(controlName: string) {
        const prevValue = this.checkBoxes.get(controlName)?.value;
        const value = this.checkBoxes.getRawValue();
        value[controlName] = !prevValue;
        this.checkBoxes.setValue(value);
      }
    
      logValue() {
        console.log(this.checkBoxes.value);
        this.checkBoxes.reset();
      }
    
      getValue(controlName: string) {
        return this.checkBoxes.get(controlName);
      }
}