/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";

/**==============> Typedefs ================>*/

type CropType = 'japonica' | 'tomato' | 'corn';

interface LandTileInfo {
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

interface UserStorage {
    tileInfos: Record<string, LandTileInfo>;
}

/**<============== End Typedefs <================*/

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

const cropSelection: CropType[] = [
    'japonica',
    'tomato',
    'corn',
]

const registerUIComponents = () => {
    const buttonCard: HTMLTemplateElement = document.querySelector('#button-card');

    // Add Crop Selection UI at empty crop section
    const emptyCrop = document.querySelector('#empty-crop');
    for (const crop in cropSelection) {
        const clone = document.importNode(buttonCard.content, true);
        clone.querySelector('span').innerText = crop
        const cards = emptyCrop.querySelector('.cards')
        cards.appendChild(clone)
    }
}

/**<============== End UI Components <================*/


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
    if (range.x.includes(x) && range.y.includes(y)) {
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