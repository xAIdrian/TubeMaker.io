import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./views/youtubeauto/videolist/videolist.component";
import { VideoCreateComponent } from "./views/youtubeauto/videocreate/videocreate.component";
import { VideoDetailsComponent } from "./views/youtubeauto/videoresult/videodetails/videodetails.component";
import { VideoUploadComponent } from "./views/youtubeauto/videoupload/videoupload.component";

const routes: Routes = [
    {
        path: "youtubeauto",
        component: VideoListComponent,
        data: {
            title: "Videos"
        }
    },
    {
        path: "create",
        component: VideoCreateComponent,
        data: {
            title: "Create"
        }
    },
    {
        path: "details",
        component: VideoDetailsComponent,
        data: {
            title: "Details"
        }
    },
    {
        path: "upload",
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