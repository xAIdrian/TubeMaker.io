import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AfterContentInit, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ContentGenerationService } from "../../../../service/contentgeneration.service";
import { ExtractDetailsService } from "../../extractdetails.service";

@Component({
    selector: 'script-details',
    templateUrl: './scriptdetails.component.html',
    styleUrls: ['./scriptdetails.component.scss']
}) export class ScriptDetailsComponent implements AfterContentInit, OnInit {

    @Input() parentIsLoading: boolean;

    transcriptSections: { isLoading: boolean, section: string }[] = [];

    dragIsEnabled = true;
    showErrorToast = false;
    errorToastText = ''

    constructor(
        private extractDetailsService: ExtractDetailsService,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }

    ngOnInit() {
        this.extractDetailsService.getErrorObserver().subscribe({
            next: (error) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", error)
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractDetailsService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", sections)
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
                    isLoading: false,
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
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngAfterContentInit() {
        this.extractDetailsService.getVideoTranscript();
        this.changeDetectorRef.detectChanges();
    }

    onImproveClick(prompt: string, section: { isLoading: boolean, section: string}, index: number) {
        this.toggleLoading(section);
        this.extractDetailsService.updateNewScriptIndex(prompt, section.section, index);
        this.changeDetectorRef.detectChanges();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.transcriptSections, event.previousIndex, event.currentIndex);
    }

    onScriptSubmit() {
        this.extractDetailsService.submitScript(this.transcriptSections);
    }

    private toggleLoading(section: { isLoading: boolean, section: string }) {
        section.isLoading = !section.isLoading;
        this.dragIsEnabled = !this.dragIsEnabled;
        this.changeDetectorRef.detectChanges();
    }
}