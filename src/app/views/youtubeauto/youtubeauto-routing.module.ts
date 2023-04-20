import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./videolist/videolist.component";
import { VideoCreateComponent } from "./videocreate/videocreate.component";
import { VideoResultComponent } from "./videoresult/videoresult.component";

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
        path: "result",
        component: VideoResultComponent,
        data: {
            title: "Results"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YoutubeAutoRoutingModule { /* */ }