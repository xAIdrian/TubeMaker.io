import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoListComponent } from "./videolist/videolist.component";

const routes: Routes = [
    {
        path: "",
        component: VideoListComponent,
        data: {
            title: "Generate Videos"
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YoutubeAutoRoutingModule { /* */ }