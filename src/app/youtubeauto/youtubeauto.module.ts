import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';

import {
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupComponent,
    ButtonModule,
    CardModule,
    CarouselModule,
    CollapseModule,
    DropdownModule,
    FormModule,
    GridModule,
    ListGroupModule,
    ModalModule,
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
import { DocsComponentsModule } from "../../components/docs-components.module";
import { VideoCreateComponent } from './videocreate/videocreate.component';
import { VideoDetailsComponent } from './videoresult/videodetails/videodetails.component';
import { VideoUploadComponent } from './videoupload/videoupload.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './repository/cors.interceptor';
import { VideoScriptComponent } from './videoresult/videoscript/videoscript.component';
import { VideoMediaComponent } from './videoresult/videomedia/videomedia.component';
import { AudioDropdownComponent } from './videoresult/videomedia/audiodropdown/audiodropdown.component';

@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: CorsInterceptor,
        multi: true
    }],
    declarations: [
        VideoListComponent,
        VideoCreateComponent,
        VideoDetailsComponent,
        VideoUploadComponent,
        VideoScriptComponent,
        VideoMediaComponent,
        AudioDropdownComponent
    ],
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
        MatButtonToggleModule,
        ModalModule,
        ButtonGroupComponent,
        TranslateModule
    ]
})
export class YoutubeAutoModule {/* */}
