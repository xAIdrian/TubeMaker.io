export interface Media {
    id: string;
    audio: {
        title: string;
        file: string;
    };
    video: {
        title: string;
        file: string;
    };
    image: {
        title: string;
        file:  string;
    };
}