import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
    UtilitiesModule,
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
        MatStepperModule,
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
        DocsComponentsModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatButtonToggleModule
    ]
})
export class YoutubeAutoModule {/* */}
