/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { CropType, LandTileInfo, UserStorage } from "./src/types";

/**==============> Initializing ================>*/

// Add control panels and indicators
ScriptApp.onJoinPlayer.Add((player) => {
  // Bottom Modal
  player.showWidget('bottom-modal.html', 'bottom', 500, 250)
  // Top Indicator
  player.showWidget('top-indicator.html', 'top', 300, 50)
  registerUIComponents();
  player.storage = JSON.stringify({
      tileInfos: {},
      assets: null,
  } as UserStorage)
  player.save()
})

/**<============== End Initializing <================*/

/**==============> UI Components ================>*/

const cropSelection: Record<CropType, string> = {
    'Japonica': '쌀',
    'Tomato': '토마토',
    'Corn': '옥수수',
}

const registerUIComponents = () => {
    const buttonCard: HTMLTemplateElement = document.querySelector('#button-card');

    // Add Crop Selection UI at empty crop section
    const emptyCrop = document.querySelector('#empty-crop');
    for (const crop of Object.keys(cropSelection)) {
        const clone = document.importNode(buttonCard.content, true);
        clone.querySelector('span').innerText = crop
        const cards = emptyCrop.querySelector('.cards')
        cards.appendChild(clone)
    }
}

/**<============== End UI Components <================*/

const between = (x: number, min: number, max: number) => x >= min && x <= max;

// Add listeners for land tiles
const registerLandTileListener = ({id, range, crop, progress}: LandTileInfo) => {
  // Add initial tile info to player storage
  ScriptApp.onJoinPlayer.Add((player) => {
    const storage: UserStorage = JSON.parse(player.storage)
    storage.tileInfos[id] = {
    id,
    range,
    crop,
    progress,
    } as LandTileInfo
    player.storage = JSON.stringify(storage)
    player.save()
  })

  // Update current tile info when player touches the tile
  ScriptApp.onObjectTouched.Add((sender, x, y, tileID) => {
    const [xmin, xmax]  = range.x;
    const [ymin, ymax] = range.y;
    if (between(x, xmin, xmax) && between(y, ymin, ymax)) {
        const storage: UserStorage = JSON.parse(sender.storage || "{}");
        window.localStorage.setItem('CurrentTileInfo', JSON.stringify(storage.tileInfos[id]));
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'CurrentTileInfo'
        }));
      }
  })
}

const updateComponents = (info: LandTileInfo) => {
  // Do HTML manipulation
}

window.onstorage = (e: StorageEvent) => {
  if (e.key === 'CurrentTileInfo') {
    const info: LandTileInfo = JSON.parse(window.localStorage.getItem('CurrentTileInfo'));
    updateComponents(info);
  }
}