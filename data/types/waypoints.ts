export interface Waypoint {
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    category: Category;
}

export enum Category {
    'Cinematic' = 'Cinematic',
    'Freestyle' = 'Freestyle',
    'CameraDrone' = 'CameraDrone',
}