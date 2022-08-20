/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import { ScriptPlayer, ScriptWidget } from "zep-script";
import type {
  Action,
  ActionType,
  LandTileInfo,
  UserStorage,
  UserTag,
} from "./src/types";

const landTileInfos: Record<string, LandTileInfo> = {};

const createLandTileInfo = (range: LandTileInfo['range']): void => {
  const id = Date.now().toString()
  landTileInfos[id] = {
    id,
    range,
    progress: 0,
    irrigation: {
      amount: 0
    },
    topdressing: {
      material: {
        nitro: 0,
        phosphorus: 0,
        cali: 0,
      },
      depth: 0,
    },
    inventory: {
      Japonica: 0,
      Tomato: 0,
      Corn: 0,
    }
  }
}

new Array(3).fill(0).map((_, i) => createLandTileInfo({
  x: [i * 10, (i + 1) * 10],
  y: [i * 10, (i + 1) * 10],
}))

const actionCreator = <T = any>(action: ActionType, payload: T) => {
  return {
    action,
    payload,
  };
};

const addListenerTo = (
  widget: ScriptWidget,
  callback: (widget: ScriptWidget, sender: ScriptPlayer, data: Action) => void
) => {
  // @ts-ignore
  widget.onMessage.Add((sender, data) => callback(widget, sender, data));
};

/**==============> Initializing ================>*/

const reducer = (
  widget: ScriptWidget,
  player: ScriptPlayer,
  action: Action
) => {
  switch (action.action) {
    case "add-irrigation":
      const storage: UserStorage = JSON.parse(player.storage);
      const tileInfo = getCurrentTile(storage);
      tileInfo.irrigation.amount++;
      storage.tileInfos[storage.currentTileId] = tileInfo;
      player.storage = JSON.stringify(storage);
      break;
    case "add-plowing":
      tileInfo.plowing++;
      storage.tileInfos[storage.currentTileId] = tileInfo;
      player.storage = JSON.stringify(storage);
      break;
    case "request-current-tile-info":
      const currentTile = getCurrentTile(JSON.parse(player.storage));
      widget.sendMessage(currentTile);
      break;
    default:
      break;
  }
};

// Add control panels and indicators
ScriptApp.onJoinPlayer.Add((player) => {
  // Declare widgets
  const topIndicator = player.showWidget(
    "bottom-modal.html",
    "bottom",
    1200,
    420
  );
  const bottomModal = player.showWidget("top-indicator.html", "top", 300, 50);
  const timeModal = player.showWidget("time-modal.html", "top", 350, 80);

  // Add listeners
  addListenerTo(bottomModal, reducer);
  addListenerTo(topIndicator, reducer);
  addListenerTo(timeModal, reducer);

  // Add widgets as tags
  player.tag = {
    topIndicator,
    bottomModal,
    timeModal,
  } as UserTag;

  // Initialize storage
  player.storage = JSON.stringify({
    /**@todo Initialize tile infos */
    tileInfos: landTileInfos,
    currentTileInfo: null,
  } as UserStorage);

  // Save
  player.save();
});

/**<============== End Initializing <================*/

const between = (x: number, min: number, max: number) => x >= min && x <= max;

const getCurrentTile = (storage: UserStorage) =>
  storage.tileInfos[storage.currentTileId];

// Add listeners for land tiles
const registerLandTileListener = ({
  id,
  range,
}: LandTileInfo) => {
  // Update current tile info when player touches the tile
  ScriptApp.onObjectTouched.Add((sender, x, y) => {
    const [xmin, xmax] = range.x;
    const [ymin, ymax] = range.y;
    if (between(x, xmin, xmax) && between(y, ymin, ymax)) {
      const storage: UserStorage = JSON.parse(sender.storage || "{}");
      storage.currentTileId = id;
      sender.storage = JSON.stringify(storage);
      sender.save();
      const currentTile = storage.tileInfos[id]
      const tag: UserTag = sender.tag;
      tag.bottomModal.sendMessage(
        actionCreator("show-crop-ui", currentTile)
      );
      tag.topIndicator.sendMessage(
        actionCreator("show-crop-ui", currentTile)
      );
    }
  });
};

Object.values(landTileInfos).map((tileInfo) => registerLandTileListener(tileInfo));

// 앱 시작시간
const app_start_date = new Date();

// 과거 시간 시작 시간
const start_date = new Date(2021, 1, 1);

// area 시간 1:N 비율(ms)
let area_date_multiply_value = 4;

const getAreaTimeWithStartDate = (startDate: Date | string) => {
  // area 생성 일시
  const area_start_date = new Date(startDate);

  // area 현재 시간
  const area_now_date = new Date();

  const area_gap = Number(area_now_date) - Number(area_start_date);
  const start_gap = Number(area_start_date) - Number(start_date);

  const date = new Date(
    Number(area_now_date) + area_gap * area_date_multiply_value - start_gap
  );

  return date;
};

ScriptApp.onJoinPlayer.Add((sender) => {
  setInterval(() => {
    const date = getAreaTimeWithStartDate(app_start_date);
    const realHours = date.getHours();
    const isPM = realHours > 12;
    const type = isPM ? "오후" : "오전";

    const years = date.getFullYear();
    const months = (date.getMonth() + 1).toString().padStart(2, "0");
    const days = date.getDate().toString().padStart(2, "0");
    const hours = (isPM ? realHours - 12 : realHours)
      .toString()
      .padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedDate = `${years}년 ${months}월 ${days}일 ${type} <span id="real-time">${hours}:${minutes}:${seconds}</span>`;
    const tag: UserTag = sender.tag;
    tag.timeModal.sendMessage(
      actionCreator("update-current-time", formattedDate)
    );
  }, 1000 / (area_date_multiply_value + 1));
});
