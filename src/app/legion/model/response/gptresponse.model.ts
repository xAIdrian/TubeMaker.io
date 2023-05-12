import { VideoMetadata } from "../video/videometadata.model";

export interface GptResponse {
    message: string,
    result: VideoMetadata
}