export interface Media {
    id: string;
    audio: {
        title: string;
        file: File | undefined;
    };
    video: {
        title: string;
        file: File | undefined;
    };
    image: {
        title: string;
        file: File | undefined;
    };
}