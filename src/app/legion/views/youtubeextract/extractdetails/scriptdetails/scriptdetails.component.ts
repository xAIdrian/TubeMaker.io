import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AfterContentInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { YoutubeService } from "src/app/legion/service/youtube.service";


@Component({
    selector: 'script-details',
    templateUrl: './scriptdetails.component.html',
    styleUrls: ['./scriptdetails.component.scss']
}) export class ScriptDetailsComponent implements AfterContentInit, OnInit {

    @Input() parentIsLoading: boolean;

    transcriptSections: string[] = [];

    constructor(
        private youtubeService: YoutubeService,
        private changeDetectorRef: ChangeDetectorRef
    ) { /** */ }

    ngOnInit() {
        console.log("🚀 ~ file: scriptdetails.component.ts:20 ~ ngOnInit ~ ngOnInit:", 'ngOnInit')
        this.youtubeService.getVideoTranscriptObserver().subscribe({
            next: (sections) => {
                console.log("🚀 ~ file: extractdetails.component.ts:47 ~ ExtractDetailsComponent ~ this.youtubeService.getVideoTranscriptObserver ~ sections:", sections)
                this.transcriptSections = sections;
            },
            complete: () => {
                // this.transcriptIsLoading = false;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.youtubeService.getVideoTranscript();
    }

    ngAfterContentInit() {
        this.changeDetectorRef.detectChanges();
    }

    onImproveClick(prompt: string, section: string) {
        // this.youtubeService.openVideoInYoutubeStudio();
    }

    onDrop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.transcriptSections, event.previousIndex, event.currentIndex);
    }

    onScriptSubmit() {

    }
}