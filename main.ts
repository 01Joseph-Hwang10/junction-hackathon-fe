/**
 * Copyright (c) 2022 ZEP Co., LTD
 */

import "zep-script";
import type { LandTileInfo, UserStorage, UserTag } from "./src/types";

type Action = "update-current-tile-info" | "update-current-time";

const actionCreator = <T = any>(action: Action, payload: T) => {
  return {
    action,
    payload,
  };
};

/**==============> Initializing ================>*/

// Add control panels and indicators
ScriptApp.onJoinPlayer.Add((player) => {
  player.tag = {
    topIndicator: player.showWidget("bottom-modal.html", "bottom", 500, 250),
    bottomModal: player.showWidget("top-indicator.html", "top", 300, 50),
    timeModal: player.showWidget("time-modal.html", "top", 350, 80),
  } as UserTag;
  player.storage = JSON.stringify({
    tileInfos: {},
    currentTileInfo: null,
  } as UserStorage);
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
      const tag: UserTag = sender.tag;
      tag.bottomModal.sendMessage(
        actionCreator("update-current-tile-info", getCurrentTile(storage))
      );
      tag.topIndicator.sendMessage(
        actionCreator("update-current-tile-info", getCurrentTile(storage))
      );
    }
  });
};

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
