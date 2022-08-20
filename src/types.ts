export type CropType = 'japonica' | 'tomato' | 'corn';

export interface LandTileInfo {
    id: number;
    range: {
        x: number[];
        y: number[];
    };
    crop?: CropType;
    /**
    * 0 ~ 1
    */
    progress: number;
}

export interface UserStorage {
    tileInfos: Record<string, LandTileInfo>;
}