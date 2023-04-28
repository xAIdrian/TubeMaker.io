import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./videolist/videolist.component";
import { VideoCreateComponent } from "./videocreate/videocreate.component";
import { VideoDetailsComponent } from "./videoresult/videodetails/videodetails.component";
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
export class YoutubeAutoRoutingModule { /* */ }