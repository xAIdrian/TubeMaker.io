import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ExtractDetailsService } from "../../extractdetails.service";
import { ExtractContentRepository } from "src/app/legion/repository/content/extractcontent.repo";

@Component({
    selector: 'script-details',
    templateUrl: './scriptdetails.component.html',
    styleUrls: ['./scriptdetails.component.scss']
}) export class ScriptDetailsComponent implements AfterContentInit, OnInit, OnChanges {

    @Input() parentIsLoading: boolean;
    @Input() parentVideoId: string;

    transcriptSections: { isLoading: boolean, section: string }[] = [];

    dragIsEnabled = true;
    showErrorToast = false;
    errorToastText = ''
    showScriptBadge = false;

    constructor(
        private contentRepo: ExtractContentRepository,
        private extractDetailsService: ExtractDetailsService,
        private clipboard: Clipboard,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }

    ngOnInit() {
        this.extractDetailsService.getErrorObserver().subscribe({
            next: (error) => {
                this.showErrorToast = true;
                this.errorToastText = error;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractDetailsService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                console.log("🚀 ~ file: extractdetails.component.ts:40 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", sections)
                this.transcriptSections = sections;
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractDetailsService.getScriptSectionObserver().subscribe({
            next: (section) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", section)
                const updateElement = {
                    isLoading: true,
                    section: section.scriptSection
                }
                if (section.sectionIndex < 0) {
                    this.showErrorToast = true;
                    this.errorToastText = 'Error: Section index is less than 0';
                    this.toggleLoading(updateElement);
                    return;
                }
                this.transcriptSections[section.sectionIndex] = updateElement;
                this.toggleLoading(updateElement);
                this.changeDetectorRef.detectChanges();
                this.extractDetailsService.updateScript(this.transcriptSections);
            }
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
                    this.extractDetailsService.getNewVideoTranscript();
                } else {
                    this.extractDetailsService.getVideoTranscript();
                }
            }
        }
    }

    onImproveClick(prompt: string, section: { isLoading: boolean, section: string}, index: number) {
        for (let i = 0; i < this.transcriptSections.length; i++) {
            this.toggleLoading(section);
            this.extractDetailsService.updateNewScriptIndex(prompt, section.section, index);
            this.changeDetectorRef.detectChanges();
        }
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.transcriptSections, event.previousIndex, event.currentIndex);
        this.extractDetailsService.updateScript(this.transcriptSections);
    }

    private toggleLoading(section: { isLoading: boolean, section: string }) {
        section.isLoading = !section.isLoading;
        this.dragIsEnabled = !this.dragIsEnabled;
        this.changeDetectorRef.detectChanges();
    }

    copyScript() {
        this.contentRepo
          .getScriptForDownload('auto-content-file')
          .subscribe((blobItem) => {
            this.clipboard.copy(blobItem);
            this.showScriptBadge = true;
            setTimeout(() => (this.showScriptBadge = false), 1000);
          });
      }
}
