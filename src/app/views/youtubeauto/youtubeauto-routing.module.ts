import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./videolist/videolist.component";
import { VideoCreateComponent } from "./videocreate/videocreate.component";

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YoutubeAutoRoutingModule { /* */ }