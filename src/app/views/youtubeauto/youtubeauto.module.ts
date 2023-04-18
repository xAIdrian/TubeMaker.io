import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CollapseModule,
    DropdownModule,
    FormModule,
    GridModule,
    ListGroupModule,
    NavModule,
    PaginationModule,
    PlaceholderModule,
    PopoverModule,
    ProgressModule,
    SharedModule,
    SpinnerModule,
    TableModule,
    TabsModule,
    TooltipModule,
    UtilitiesModule
} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { YoutubeAutoRoutingModule } from './youtubeauto-routing.module';
import { VideoListComponent } from './videolist/videolist.component';
import { DocsComponentsModule } from "../../../components/docs-components.module";
import { DocsExampleComponent } from '@docs-components/docs-example/docs-example.component';
import { DocsCalloutComponent } from '@docs-components/docs-callout/docs-callout.component';

@NgModule({
    declarations: [
        VideoListComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        IconModule,
        ReactiveFormsModule,
        AccordionModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CardModule,
        CarouselModule,
        CollapseModule,
        DropdownModule,
        FormModule,
        GridModule,
        ListGroupModule,
        NavModule,
        PaginationModule,
        PlaceholderModule,
        PopoverModule,
        ProgressModule,
        SharedModule,
        SpinnerModule,
        TableModule,
        TabsModule,
        TooltipModule,
        UtilitiesModule,
        YoutubeAutoRoutingModule,
        DocsComponentsModule
    ]
})
export class YoutubeAutoModule {/* */}
