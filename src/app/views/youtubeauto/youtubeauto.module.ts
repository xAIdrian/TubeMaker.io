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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';
import { YoutubeAutoRoutingModule } from './youtubeauto-routing.module';
import { VideoListComponent } from './videolist/videolist.component';
import { DocsComponentsModule } from "../../../components/docs-components.module";
import { VideoCreateComponent } from './videocreate/videocreate.component';

@NgModule({
    declarations: [
        VideoListComponent,
        VideoCreateComponent
    ],
    exports: [],
    imports: [
        CommonModule,
        IconModule,
        ReactiveFormsModule,
        FormsModule,
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
