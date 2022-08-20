/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import type { LandTileInfo, UserStorage, UserTag } from "./src/types";

type Action = 'update-current-tile-info'

const actionCreator = <T = any>(action: Action, payload: T) => {
  return {
    action,
    payload,
  };
}

/**==============> Initializing ================>*/

// Add control panels and indicators
ScriptApp.onJoinPlayer.Add((player) => {
  player.tag = {
    topIndicator: player.showWidget("bottom-modal.html", "bottom", 500, 250),
    bottomModal: player.showWidget("top-indicator.html", "top", 300, 50),
  } as UserTag
  player.storage = JSON.stringify({
    tileInfos: {},
    currentTileInfo: null
  } as UserStorage);
  player.save();
});

/**<============== End Initializing <================*/

const between = (x: number, min: number, max: number) => x >= min && x <= max;

const getCurrentTile = (storage: UserStorage) => storage.tileInfos[storage.currentTileId]

// Add listeners for land tiles
const registerLandTileListener = ({
  id,
  range,
  crop,
  progress,
}: LandTileInfo) => {
  // Add initial tile info to player storage
  ScriptApp.onJoinPlayer.Add((player) => {
    const storage: UserStorage = JSON.parse(player.storage);
    storage.tileInfos[id] = {
      id,
      range,
      crop,
      progress,
    } as LandTileInfo;
    player.storage = JSON.stringify(storage);
    player.save();
  });

  // Update current tile info when player touches the tile
  ScriptApp.onObjectTouched.Add((sender, x, y) => {
    const [xmin, xmax] = range.x;
    const [ymin, ymax] = range.y;
    if (between(x, xmin, xmax) && between(y, ymin, ymax)) {
      const storage: UserStorage = JSON.parse(sender.storage || "{}");
      storage.currentTileId = id;
      sender.storage = JSON.stringify(storage);
      sender.save();
      const tag: UserTag = sender.tag
      tag.bottomModal.sendMessage(actionCreator("update-current-tile-info", getCurrentTile(storage)))
      tag.topIndicator.sendMessage(actionCreator('update-current-tile-info', getCurrentTile(storage)))
    }
  });
};
