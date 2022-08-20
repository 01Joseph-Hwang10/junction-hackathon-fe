import { ScriptWidget } from 'zep-script';

export type ManageType = 'sow' | 'irrigation' | 'topdressing' | 'plowing' | 'harvest';

export type ActionType =
  | 'update-current-tile-info'
  | 'update-current-time'
  | 'request-current-tile-info'
  | 'response-current-tile-info'

  | 'show-crop-ui'
  | 'hide-crop-ui'

  | 'add-irrigation'
  | 'add-plowing'
  // Harvest
  | 'harvest'
  // Current Time
  | 'current-time'
  // Set land tile infos
  | 'set-crop'
  | 'set-sow'
  | 'set-irrigation'
  | 'set-topdressing'
  | 'set-plowing'
  | 'set-inventory'
  // Object control
  | 'overwrite-object'

export interface AppObject {
  x: number;
  y: number;
  /**
   * Start from `res`
   */
  filePath: string;
}

export interface Action<T = any> {
  action: ActionType;
  payload: T;
}

export type CropType = 'Japonica' | 'Tomato' | 'Corn';

export type IrrigationMethod = 'Furrow' | 'Flood' | 'Sprinkler';
export type FertilizationMethod = 'applied-in-irrigation-water' | 'band-on-soil' | 'banded-on-beneath-surface';

export type SowMethod = 'direct' | 'indirect';
export type SowGap =
  | 'narrow' // 한(64*32) 타일에 3개
  | 'wide'; // 한(64*32) 타일에 2개

export interface LandTileInfo {
  id: string;
  range: {
    x: [number, number];
    y: [number, number];
  };
  crop?: CropType;
  /**
   * 0 ~ 1
   */
  progress: number;
  sow?: {
    method: SowMethod;
    gap: SowGap;
    /**
     * 0 ~ 360 (no radian)
     */
    degree: number;
  };
  /**
   * 0 ~ 1 (강수량)
   */
  irrigation: {
    method?: IrrigationMethod;
    amount: number;
  };
  topdressing: {
    /**
     * 0 ~ 1 for each attribute (시비량)
     * 3 attribute should sum up as 0 or 1
     */
    material: {
      nitro: number;
      phosphorus: number;
      cali: number;
    };
    method?: FertilizationMethod;
    depth: number;
  };
  plowing?: number;
  inventory: {
    [key in CropType]: number;
  };
}

export interface UserStorage {
  tileInfos: Record<string, LandTileInfo>;
  currentTileId?: string;
}

export interface UserTag {
  bottomModal: ScriptWidget;
  timeModal: ScriptWidget;
}
