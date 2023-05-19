import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./views/home/home.component";
import { VideoCreateComponent } from "./views/youtubeauto/videocreate/videocreate.component";
import { VideoDetailsComponent } from "./views/youtubeauto/videoresult/videodetails.component";
import { VideoCopyComponent } from "./views/youtubeextract/videocopy/videocopy.component";
import { ExtractDetailsComponent } from "./views/youtubeextract/extractdetails/extractdetails.component";
import { CanDeactivateGuard } from "./service/auth/deactivate.guard";
import { CanNavigateForwardGuard } from "./service/auth/navforward.guard";

const routes: Routes = [
    {
        path: "",
        redirectTo: "copycat",
        pathMatch: "prefix"
    },
    {
        path: "copycat",
        component: VideoCopyComponent
    },
    {
        path: "copycat/details",
        component: ExtractDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
    },
    {
        path: "copycat/details/:id",
        component: ExtractDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
    },
    {
        path: "list",
        component: HomeComponent,
        pathMatch: "prefix",
        // canDeactivate: [CanNavigateForwardGuard],
    },
    {
        path: "auto",
        component: VideoCreateComponent
    },
    {
        path: "auto/details",
        component: VideoDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
    },
    {
        path: "auto/details/:id",
        component: VideoDetailsComponent,
        canDeactivate: [CanDeactivateGuard],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LegionRoutingModule { /* */ }
