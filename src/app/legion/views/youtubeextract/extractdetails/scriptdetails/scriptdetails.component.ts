import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GptService } from "src/app/legion/service/gpt.service";
import { YoutubeService } from "src/app/legion/service/youtube.service";


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
        private youtubeService: YoutubeService,
        private gptService: GptService,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }

    ngOnInit() {
        this.gptService.getErrorObserver().subscribe({
            next: (error) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", error)
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
        this.youtubeService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", sections)
                this.transcriptSections = sections;
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
        this.gptService.getScriptSectionObserver().subscribe({
            next: (sections) => {
            },
            complete: () => {
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    ngAfterContentInit() {
        this.youtubeService.getVideoTranscript();
        this.changeDetectorRef.detectChanges();
    }

    onImproveClick(prompt: string, section: { isLoading: boolean, section: string}, index: number) {
        this.toggleLoading(section);
        this.gptService.updateNewScriptSection(prompt, section.section, '', index);
        this.changeDetectorRef.detectChanges();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.transcriptSections, event.previousIndex, event.currentIndex);
    }

    onScriptSubmit() {

    }

    private toggleLoading(section: { isLoading: boolean, section: string }) {
        section.isLoading = !section.isLoading;
        this.dragIsEnabled = !this.dragIsEnabled;
        this.changeDetectorRef.detectChanges();
    }
}