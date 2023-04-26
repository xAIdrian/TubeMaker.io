import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./videoentrance/videolist/videolist.component";
import { VideoCreateComponent } from "./videocreate/videocreate.component";
import { VideoResultComponent } from "./videoresult/videoresult.component";
import { VideoUploadComponent } from "./videoupload/videoupload.component";

const routes: Routes = [
    {
        path: "",
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
        path: "results",
        component: VideoResultComponent,
        data: {
            title: "Results"
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
export class YoutubeAutoRoutingModule { /* */ }