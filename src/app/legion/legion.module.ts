import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { AutosizeModule } from 'ngx-autosize';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { LegionRoutingModule } from './legion-routing.module';
import { VideoListComponent } from './views/youtubeauto/videolist/videolist.component';
import { DocsComponentsModule } from "../../components/docs-components.module";
import { VideoCreateComponent } from './views/youtubeauto/videocreate/videocreate.component';
import { VideoDetailsComponent } from './views/youtubeauto/videoresult/videodetails/videodetails.component';
import { VideoUploadComponent } from './views/youtubeauto/videoupload/videoupload.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './repository/cors.interceptor';
import { VideoScriptComponent } from './views/youtubeauto/videoresult/videoscript/videoscript.component';
import { VideoMediaComponent } from './views/youtubeauto/videoresult/videomedia/videomedia.component';
import { AudioDropdownComponent } from './views/youtubeauto/videoresult/videomedia/audiodropdown/audiodropdown.component';
import { VideoCopyComponent } from './views/youtubeextract/videocopy/videocopy.component'
import { ExtractDetailsComponent } from './views/youtubeextract/extractdetails/extractdetails.component';
import { ScriptDetailsComponent } from './views/youtubeextract/extractdetails/scriptdetails/scriptdetails.component';

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
        AudioDropdownComponent,
        VideoCopyComponent,
        ExtractDetailsComponent,
        ScriptDetailsComponent
    ],
    imports: [
        DragDropModule,
        AutosizeModule,
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
        LegionRoutingModule,
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
export class LegionModule {/* */}
