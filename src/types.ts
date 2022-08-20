import { ScriptWidget } from "zep-script";

export type ActionType =
  | "sow"
  | "irrigation"
  | "topdressing"
  | "plowing"
  | "harvest";

export type CropType = "Japonica" | "Tomato" | "Corn";

export type SowMethod = "direct" | "indirect";
export type SowGap =
  | "narrow" // 한(64*32) 타일에 3개
  | "wide"; // 한(64*32) 타일에 2개

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
  irrigation?: {
    method: any;
    /**
     * Unit: cm
     */
    depth: number;
  };
  topdressing?: {
    method: any;
    fertilizer: any;
    amount: number;
  };
  plowing?: any;
}

export interface UserStorage {
  tileInfos: Record<string, LandTileInfo>;
  currentTileId?: string;
}

export interface UserTag {
  bottomModal: ScriptWidget;
  topIndicator: ScriptWidget;
  timeModal: ScriptWidget;
}
