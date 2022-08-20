/*
농장에 작물이 없을때:
- #select-crop
농장에 작물이 있을때:
- #select-action
    - #select-sow
    - #select-irrigation
    - #select-topdressing
    - #select-plowing
    - #select-harvest
*/

import {
  ManageType,
  CropType,
  LandTileInfo,
  SowGap,
  SowMethod,
  ActionType,
  Action,
  IrrigationMethod,
  FertilizationMethod,
} from "./types";

/**==============> States ================>*/

let selectCropOpened = false;
let selectStatusOpened = false;
let selectSowOpened = false;
let selectIrrigationOpened = false;
let selectTopdressingOpened = false;
let selectPlowingOpened = false;
let selectHarvestOpened = false;

const clearState = () => {
  selectCropOpened = false;
  selectStatusOpened = false;
  selectSowOpened = false;
  selectIrrigationOpened = false;
  selectTopdressingOpened = false;
  selectPlowingOpened = false;
  selectHarvestOpened = false;
};

/**<============== End States <================*/

/**==============> Utilities ================>*/

const actionCreatorBottomModal = <T = any>(action: ActionType, payload: T) => {
  return {
    action,
    payload,
  };
};

const show = (selector: string) => {
  document.querySelector(selector).setAttribute("style", "display: flex;");
};

const clear = () => {
  document.querySelectorAll("section").forEach((section) => {
    section.setAttribute("style", "display: none;");
  });
};

const showBackButton = () => {
  document.querySelectorAll("#indicator .side").forEach((side) => {
    side.setAttribute("style", "display: block;");
  });
  document.querySelector("#indicator").removeAttribute("style");
  const backButton: HTMLHeadingElement =
    document.querySelector("#indicator .back");
  backButton.onclick = async () => {
    const currentTileInfo = await requestCurrentTileInfo();
    registerSelectStatusUI(currentTileInfo);
  };
};

const hideBackButton = () => {
  document.querySelectorAll("#indicator .side").forEach((side) => {
    side.setAttribute("style", "display: none;");
  });
};

const setIndicator = (statement: string) => {
  const indicator: HTMLHeadingElement =
    document.querySelector("#indicator .title");
  indicator.innerHTML = statement;
};

const setSubIndicator = (statement: string) => {
  const indicator: HTMLHeadingElement = document.querySelector(
    "#indicator .subtitle"
  );
  indicator.innerHTML = statement;
};

const getStatusStatement = (crop: string) =>
  `${crop}<normal>을 심은 농지</normal>`;

const getButtonCard = (): HTMLTemplateElement =>
  document.querySelector("#button-card");

const getOption = (): HTMLTemplateElement => document.querySelector("#option");

/**<============== End Utilities <================*/

/**==============> Constants ================>*/

const iconSelection: Record<CropType, string> = {
  Japonica: "https://d3yor8z393217.cloudfront.net/rice.svg",
  Tomato: "https://d3yor8z393217.cloudfront.net/tomato.svg",
  Corn: "https://d3yor8z393217.cloudfront.net/corn.svg",
};

const cropSelection: Record<CropType, string> = {
  Japonica: "쌀",
  Tomato: "토마토",
  Corn: "옥수수",
};

const actions: Record<ManageType, string> = {
  sow: "파종",
  irrigation: "관개",
  topdressing: "시비",
  plowing: "경운",
  harvest: "수확",
};

const descriptionActions: Record<ManageType, string> = {
  sow: "파종을 하면 작물을 심을 수 있습니다.",
  irrigation: "관개를 하면 작물을 물을 수 있습니다.",
  topdressing: "시비를 하면 작물에 비료를 줄 수 있습니다.",
  plowing: "경운을 하면 작물을 흙으로 뒤집을 수 있습니다.",
  harvest: "수확을 하면 작물을 수확할 수 있습니다.",
};

const sowMethod: Record<SowMethod, string> = {
  direct: "직접",
  indirect: "간접",
};

const sowGap: Record<SowGap, string> = {
  narrow: "좁게",
  wide: "넓게",
};

const irrigationMethod: Record<IrrigationMethod, string> = {
  Flood: "Flood",
  Sprinkler: "Sprinkler",
  Furrow: "Furrow",
};

const topDressingMethod: Record<FertilizationMethod, string> = {
  "applied-in-irrigation-water": "관개수식",
  "band-on-soil": "밴드식",
  "banded-on-beneath-surface": "묻는 방식",
};

/**<============== End Constants <================*/

/**==============> Appenders ================>*/

type AppendButtonType = "crop-selection" | "actions";

const appendButtonCards = <T extends Record<any, any>>(
  type: AppendButtonType,
  items: T,
  to: Element
): HTMLButtonElement[] => {
  // Clear cards
  const cards = to.querySelectorAll(".card");
  cards.forEach((card) => card.remove());

  // Attach cards
  const buttonCard = getButtonCard();
  for (const card of Object.keys(items)) {
    const clone = document.importNode(buttonCard.content, true);
    const button: HTMLButtonElement = clone.querySelector(".card");
    button.setAttribute("to", card);
    button.setAttribute("style", `width: ${100 / items.length}%;`);
    const span = clone.querySelector("span");
    span.innerHTML =
      type === "crop-selection"
        ? `<div class="button-wrap"><img src="${iconSelection[card]}" /><span>${items[card]}</span></div>`
        : `<div class="button-wrap"><span>${items[card]}</span><div class="popup">${descriptionActions[card]}</div></div>`;
    const cards = to.querySelector(".cards");
    cards.appendChild(clone);
  }
  const buttons: HTMLButtonElement[] = [];
  to.querySelectorAll("button.card").forEach((button: HTMLButtonElement) =>
    buttons.push(button)
  );
  return buttons;
};

const appendOptions = <T extends Record<any, any>>(
  options: T,
  to: Element
): HTMLOptionElement[] => {
  // Clear options
  const optionsElement = to.querySelectorAll("option");
  optionsElement.forEach((option, index) => {
    if (index === 0) {
      option.selected = true;
    } else {
      option.remove();
    }
  });

  // Append options
  const optionTemplate = getOption();
  for (const item of Object.keys(options)) {
    const clone = document.importNode(optionTemplate.content, true);
    const span = clone.querySelector("span");
    span.innerText = options[item];
    const option = clone.querySelector("option");
    option.value = item;
    to.appendChild(clone);
  }
  const opts: HTMLOptionElement[] = [];
  to.querySelectorAll("option").forEach((opt: HTMLOptionElement) =>
    opts.push(opt)
  );
  return opts;
};

/**<============== End Appenders <================*/

/**==============> CropSelection ================>*/

const requestCurrentTileInfo = (): Promise<LandTileInfo> => {
  return new Promise((resolve) => {
    window.addEventListener("message", ({ data }: { data: Action }) => {
      if (data.action === "response-current-tile-info") {
        resolve(data.payload);
      }
    });
    window.postMessage(
      actionCreatorBottomModal("request-current-tile-info", null)
    );
  });
};

const registerCropSelectionUI = () => {
  if (selectCropOpened) return;
  clearState();
  selectCropOpened = true;
  // Initialize UI
  clear();
  show("#select-crop");
  hideBackButton();

  // Indicator
  setIndicator("비어있는 농지");
  setSubIndicator("수확할 농작물을 선택해주세요.");

  // Crop Selection
  const selectCrop = document.querySelector("#select-crop");
  const buttons = appendButtonCards(
    "crop-selection",
    cropSelection,
    selectCrop
  );
  buttons.forEach((button) => {
    button.onclick = async () => {
      const crop: CropType = button.getAttribute("to") as CropType;
      const currentTileInfo: LandTileInfo = await requestCurrentTileInfo();
      registerSelectStatusUI({
        ...currentTileInfo,
        crop,
      });
    };
  });
};

/**<============== End CropSelection <================*/

/**==============> Select Status ================>*/

const registerSelectStatusUI = (info: LandTileInfo) => {
  if (selectStatusOpened) return;
  clearState();
  selectStatusOpened = true;
  // Initialize UI
  clear();
  show("#select-status");
  hideBackButton();

  // Title Statement
  setIndicator(getStatusStatement(cropSelection[info.crop]));
  setSubIndicator(`<progress max="100" value="20" ></progress>`);

  // Progress
  const selectStatus = document.querySelector("#select-status");
  const progress = selectStatus.querySelector("progress");
  progress.value = info.progress * 100;

  // Actions
  const buttons = appendButtonCards("actions", actions, selectStatus);
  const [
    sowButton,
    irrigationButton,
    topDressingButton,
    plowingButton,
    harvestButton,
  ] = buttons;
  sowButton.onclick = () => registerSelectSowUI(info);
  irrigationButton.onclick = () => registerSelectIrrigationUI(info);
  topDressingButton.onclick = () => registerSelectTopDressingUI(info);
  plowingButton.onclick = () => {}; // Some Action when plowing
  harvestButton.onclick = () => {}; // Some Action when harvest
};

/**<============== End Select Status <================*/

const registerSelectSowUI = (info: LandTileInfo) => {
  if (selectSowOpened) return;
  clearState();
  selectSowOpened = true;
  // Initialize UI
  clear();
  show("#select-sow");
  showBackButton();

  const selectSow = document.querySelector("#select-sow");
  // Sow methods
  const sowMethodSelection = selectSow.querySelector("#sow-method");
  const sowMethodOptions = appendOptions(sowMethod, sowMethodSelection);

  // Sow Gap
  const sowGapSelection = selectSow.querySelector("#sow-gap");
  appendOptions(sowGap, sowGapSelection);
  const sowGapOptions = sowGapSelection.querySelectorAll("option");

  // Sow Degree
  const sowDegreeIndicator: HTMLSpanElement =
    selectSow.querySelector("#sow-degree span");
  const sowDegreeConfig: HTMLInputElement =
    selectSow.querySelector("#sow-degree input");
  sowDegreeConfig.oninput = (event: any) => {
    let degree = event.target.value.toString();
    if (Number(event.target.value) < 10) {
      degree = "&nbsp;&nbsp;" + degree;
    } else if (Number(event.target.value) < 100) {
      degree = "&nbsp;" + degree;
    } else {
      // pass
    }
    sowDegreeIndicator.innerHTML = `파종 각도: ${degree}`;
  };

  if (info.sow) {
    sowMethodOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.sow.method) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    });
    sowGapOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.sow.gap) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    });
    sowDegreeConfig.value = info.sow.degree.toString();
    sowDegreeIndicator.innerText = `파종 각도: ${info.sow.degree}`;
  }
};

/**<============== End Select Sow <================*/

/**==============> Irrigation ================>*/

const registerSelectIrrigationUI = (info: LandTileInfo) => {
  if (selectIrrigationOpened) return;
  clearState();
  selectIrrigationOpened = true;
  // Initialize UI
  clear();
  show("#select-irrigation");
  showBackButton();

  const selectIrrigation = document.querySelector("#select-irrigation");
  // Irrigation methods
  const irrigationMethodSelection =
    selectIrrigation.querySelector("#sow-method");
  const irrigationMethodOptions = appendOptions(
    irrigationMethod,
    irrigationMethodSelection
  );

  // Add Irrigation
  const addIrrigationButton: HTMLButtonElement = selectIrrigation.querySelector(
    "#add-irrigation button"
  );
  addIrrigationButton.onclick = () => {
    window.postMessage(actionCreatorBottomModal("add-irrigation", null));
  };

  if (info.irrigation.method) {
    irrigationMethodOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.irrigation.method) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    });
  }
};

/**<============== End Irrigation <================*/

/**==============> Top Dressing ================>*/

const registerSelectTopDressingUI = (info: LandTileInfo) => {
  if (selectTopdressingOpened) return;
  clearState();
  selectTopdressingOpened = true;
  // Initialize UI
  clear();
  show("#select-topdressing");
  showBackButton();

  const selectTopDressing = document.querySelector("#select-topdressing");
  // Top Dressing methods
  const topDressingMethodSelection = selectTopDressing.querySelector(
    "#topdressing-method"
  );
  const topDressingMethodOptions = appendOptions(
    topDressingMethod,
    topDressingMethodSelection
  );

  // Material configuration
  const materialIndicators: NodeListOf<HTMLDivElement> =
    selectTopDressing.querySelectorAll("#topdressing-material > div");
  materialIndicators.forEach((indicator: HTMLDivElement) => {
    const amountConfig: HTMLInputElement = indicator.querySelector("input");
    amountConfig.oninput = (event: any) => {
      // Do some data stuff
    };
  });

  // Top Dressing Depth
  const topDressingDepthIndicator: HTMLSpanElement =
    selectTopDressing.querySelector("#topDressing-depth span");
  const topDressingDepthConfig: HTMLInputElement =
    selectTopDressing.querySelector("#topDressing-depth input");
  topDressingDepthConfig.oninput = (event: any) => {
    let depth = event.target.value.toString();
    if (Number(event.target.value) < 10) {
      depth = "&nbsp;" + depth;
    }
    topDressingDepthIndicator.innerHTML = `시비 깊이: ${depth}`;
  };

  if (info.topdressing.method) {
    topDressingMethodOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.topdressing.method) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    });
  }
  topDressingDepthConfig.value = info.topdressing.depth.toString();
  topDressingDepthIndicator.innerText = `시비 깊이: ${info.topdressing.depth}`;
  materialIndicators.forEach((indicator: HTMLDivElement) => {
    const amountConfig: HTMLInputElement = indicator.querySelector("input");
    amountConfig.value =
      info.topdressing.material[
        indicator.id.replace("topdressing-", "")
      ].toString();
  });
};

/**<============== End Top Dressing <================*/

// Main

let isShowModal = false;

const getIsShowModal = () => {
  return isShowModal;
};

const setIsShowModal = (isShowModal: boolean) => {
  isShowModal = isShowModal;
};

const registerDefaultEventListener = () => {
  window.addEventListener(
    "message",
    ({ data }: { data: Action<LandTileInfo> }) => {
      const root = document.querySelector("#modal-top-container");
      const isShowModal = getIsShowModal();
      if (isShowModal === false && data.action === "show-crop-ui") {
        setIsShowModal(true);
        root.setAttribute("style", "display: flex;");
        if (data.payload.crop) {
          registerSelectStatusUI(data.payload);
        } else {
          registerCropSelectionUI();
        }
      } else if (isShowModal === true && data.action === "hide-crop-ui") {
        setIsShowModal(false);
        root.setAttribute("style", "display: none;");
      }
    }
  );
};

registerDefaultEventListener();
