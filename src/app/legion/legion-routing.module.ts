import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";
import { VideoCreateComponent } from "./views/youtubeauto/videocreate/videocreate.component";
import { VideoDetailsComponent } from "./views/youtubeauto/videoresult/videodetails.component";
import { VideoUploadComponent } from "./views/youtubeauto/videoupload/videoupload.component";
import { VideoCopyComponent } from "./views/youtubeextract/videocopy/videocopy.component";
import { ExtractDetailsComponent } from "./views/youtubeextract/extractdetails/extractdetails.component";
import { CanDeactivateGuard } from "./service/auth/deactivate.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "copycat",
        pathMatch: "prefix"
    },
    {
        path: "copycat",
        component: VideoCopyComponent,
        data: {
            title: "Copy Cat"
        },
    },
    {
        path: "copycat/details",
        component: ExtractDetailsComponent,
        data: {
            title: "Transcript"
        },
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: "list",
        component: HomeComponent,
        data: {
            title: "Your Videos"
        },
        pathMatch: "prefix"
    },
    {
        path: "auto",
        component: VideoCreateComponent,
        data: {
            title: "Create"
        }
    },
    {
        path: "auto/details",
        component: VideoDetailsComponent,
        data: {
            title: "Details"
        }
    },
    {
        path: "auto/upload",
        component: VideoUploadComponent,
        data: {
            title: "Upload"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegionRoutingModule { /* */ }
