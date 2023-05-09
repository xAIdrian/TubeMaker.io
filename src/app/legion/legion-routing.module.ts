import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./views/youtubeauto/videolist/videolist.component";
import { VideoCreateComponent } from "./views/youtubeauto/videocreate/videocreate.component";
import { VideoDetailsComponent } from "./views/youtubeauto/videoresult/videodetails.component";
import { VideoUploadComponent } from "./views/youtubeauto/videoupload/videoupload.component";
import { VideoCopyComponent } from "./views/youtubeextract/videocopy/videocopy.component";
import { ExtractDetailsComponent } from "./views/youtubeextract/extractdetails/extractdetails.component";
import { TitleDetailsComponent } from "./views/youtubeextract/extractdetails/titledetails/titledetails.component";

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
        }
    },
    {
        path: "copycat/titles",
        component: TitleDetailsComponent,
        data: {
            title: "Listing"
        }
    },
    {
        path: "autos",
        component: VideoListComponent,
        data: {
            title: "Your Videos"
        },
        pathMatch: "prefix"
    },
    {
        path: "autos/create",
        component: VideoCreateComponent,
        data: {
            title: "Create"
        }
    },
    {
        path: "autos/details",
        component: VideoDetailsComponent,
        data: {
            title: "Details"
        }
    },
    {
        path: "autos/upload",
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