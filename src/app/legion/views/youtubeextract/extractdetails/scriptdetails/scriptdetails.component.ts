import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AfterContentInit, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { YoutubeService } from "../../../common/youtube.service";
import { YoutubeExtractService } from "../../youtubeextract.service";

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

    constructor(
        private extractService: YoutubeExtractService,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }

    ngOnInit() {
        this.extractService.getErrorObserver().subscribe({
            next: (error) => {
                this.showErrorToast = true;
                this.errorToastText = error;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", sections)
                this.transcriptSections = sections;
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
        this.extractService.getScriptSectionObserver().subscribe({
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
                this.extractService.updateScript(this.transcriptSections);
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
                    this.extractService.getNewVideoTranscript();
                } else {
                    this.extractService.getVideoTranscript();
                }
            }
        }
    }

    onImproveClick(prompt: string, section: { isLoading: boolean, section: string}, index: number) {
        this.toggleLoading(section);
        this.extractService.updateNewScriptIndex(prompt, section.section, index);
        this.changeDetectorRef.detectChanges();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.transcriptSections, event.previousIndex, event.currentIndex);
        this.extractService.updateScript(this.transcriptSections);
    }

    private toggleLoading(section: { isLoading: boolean, section: string }) {
        section.isLoading = !section.isLoading;
        this.dragIsEnabled = !this.dragIsEnabled;
        this.changeDetectorRef.detectChanges();
    }
}
