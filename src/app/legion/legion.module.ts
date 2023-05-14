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
import { HomeComponent } from './views/home/home.component';
import { DocsComponentsModule } from "../../components/docs-components.module";
import { VideoCreateComponent } from './views/youtubeauto/videocreate/videocreate.component';
import { VideoDetailsComponent } from './views/youtubeauto/videoresult/videodetails.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from './repository/cors.interceptor';
import { VideoScriptComponent } from './views/youtubeauto/videoresult/videoscript/videoscript.component';
import { AudioDropdownComponent } from './views/common/videomedia/audiodropdown/audiodropdown.component';
import { VideoCopyComponent } from './views/youtubeextract/videocopy/videocopy.component'
import { DetailsComponent } from './views/common/details/details.component';
import { ScriptDetailsComponent } from './views/youtubeextract/extractdetails/scriptdetails/scriptdetails.component';
import { VideoMediaComponent } from './views/common/videomedia/videomedia.component';
import { ConfirmationDialogComponent } from './views/dialogs/confirmationdialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VideoGridComponent } from './views/common/videogrid/videogrid.component';
import { StatsRowComponent } from './views/common/youtubestatsrow/statsrow.component';
import { ExtractDetailsComponent } from './views/youtubeextract/extractdetails/extractdetails.component';
import { TitleDetailsComponent } from './views/common/titledetails/titledetails.component';

@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: CorsInterceptor,
        multi: true
    }],
    declarations: [
        HomeComponent,
        DetailsComponent,
        VideoCreateComponent,
        VideoDetailsComponent,
        VideoScriptComponent,
        VideoMediaComponent,
        AudioDropdownComponent,
        VideoCopyComponent,
        DetailsComponent,
        ExtractDetailsComponent,
        ScriptDetailsComponent,
        TitleDetailsComponent,
        ConfirmationDialogComponent,
        VideoGridComponent,
        StatsRowComponent
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
        TranslateModule,
        MatDialogModule
    ]
})
export class LegionModule {/* */}
