/*
농장에 작물이 없을때:
- #select-crop
농장에 작물이 있을때:
- #select-action
    - #select-sow
    - #select-irrigation
    - #select-topdressing
    - #select-cultivation
    - #select-harvest
*/

import { ActionType, CropType, LandTileInfo, SowGap, SowMethod } from "./types";

/**==============> Utilities ================>*/

const clear = () => {
  document.querySelectorAll("section").forEach((section) => {
    section.setAttribute("style", "display: none;");
  });
};

const show = (selector: string) => {
  document.querySelector(selector).setAttribute("style", "display: flex;");
};

const showBackButton = (info: LandTileInfo) => {
  document.querySelectorAll('#indicator .side').forEach((side) => {
    side.setAttribute('style', 'display: block;')
  })
  document.querySelector('#indicator').removeAttribute('style')
  const backButton: HTMLHeadingElement = document.querySelector('#indicator .back')
  backButton.onclick = () => registerSelectStatusUI(info)
}

const hideBackButton = () => {
  document.querySelectorAll('#indicator .side').forEach((side) => {
    side.setAttribute('style', 'display: none;')
  })
  document.querySelector('#indicator').setAttribute('style', 'justify-content: center;')
}

const setIndicator = (statement: string) => {
  const indicator: HTMLHeadingElement = document.querySelector("#indicator .title");
  indicator.innerText = statement;
};

const getStatusStatement = (crop: string) => `${crop}을 심은 농지`;

const getButtonCard = (): HTMLTemplateElement =>
  document.querySelector("#button-card");

const getOption = (): HTMLTemplateElement => document.querySelector('#option')

/**<============== End Utilities <================*/

/**==============> Constants ================>*/

const cropSelection: Record<CropType, string> = {
  Japonica: "쌀",
  Tomato: "토마토",
  Corn: "옥수수",
};

const actions: Record<ActionType, string> = {
  sow: "파종",
  irrigation: "관개",
  topdressing: "시비",
  plowing: "경운",
  harvest: "수확",
};

const sowMethod: Record<SowMethod, string> = {
  'direct': '직접',
  'indirect': '간접',
}

const sowGap: Record<SowGap, string> = {
  'narrow': '좁게',
  'wide': '넓게',
}

/**<============== End Constants <================*/

/**==============> Appenders ================>*/

const appendButtonCards = <T extends Record<any, any>>(
  items: T,
  to: Element
): HTMLButtonElement[] => {
  // Clear cards
  const cards = to.querySelectorAll(".card");
  cards.forEach(card => card.remove())

  // Attach cards
  const buttonCard = getButtonCard();
  for (const card of Object.keys(items)) {
    const clone = document.importNode(buttonCard.content, true);
    const button: HTMLButtonElement = clone.querySelector(".card");
    button.setAttribute("to", card);
    button.setAttribute("style", `width: ${100 / items.length}%;`);
    const span = clone.querySelector("span");
    span.innerText = items[card];
    const cards = to.querySelector(".cards");
    cards.appendChild(clone);
  }
  const buttons: HTMLButtonElement[] = [];
  to.querySelectorAll("button.card").forEach((button: HTMLButtonElement) =>
    buttons.push(button)
  );
  return buttons;
};


const appendOptions = <T extends Record<any, any>>(options: T, to: Element): HTMLOptionElement[] => {
  // Clear options
  const optionsElement = to.querySelectorAll("option");
  optionsElement.forEach((option, index) => {
    if (index === 0) {
      option.selected = true
    } else {
      option.remove()
    }
  })

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
  return opts
}

/**<============== End Appenders <================*/

/**==============> CropSelection ================>*/

const registerCropSelectionUI = (range: LandTileInfo['range']) => {
  // Initialize UI
  clear();
  show("#select-crop");
  hideBackButton()

  // Indicator
  setIndicator("비어있는 농지");

  // Crop Selection
  const selectCrop = document.querySelector("#select-crop");
  const buttons = appendButtonCards(cropSelection, selectCrop);
  buttons.forEach((button) => {
    button.onclick = () => {
      const crop: CropType = button.getAttribute("to") as CropType;
      registerSelectStatusUI({
        crop,
        range,
        progress: 0,
        id: Math.random().toString(),
      });
    };
  });
};

/**<============== End CropSelection <================*/

/**==============> Select Status ================>*/

const registerSelectStatusUI = (info: LandTileInfo) => {
  // Initialize UI
  clear();
  show("#select-status");
  hideBackButton()

  // Title Statement
  setIndicator(getStatusStatement(cropSelection[info.crop]));

  // Progress
  const selectStatus = document.querySelector("#select-status");
  const progress = selectStatus.querySelector("progress");
  progress.value = info.progress * 100;

  // Actions
  const buttons = appendButtonCards(actions, selectStatus)
  const [sowButton, irrigationButton, topDressingButton, plowingButton, harvestButton] = buttons
  sowButton.onclick = () => registerSelectSowUI(info)
  irrigationButton.onclick = () => {}
  topDressingButton.onclick = () => registerSelectTopDressingUI(info)
  plowingButton.onclick = () => {} // Some Action when plowing
  harvestButton.onclick = () => {} // Some Action when harvest
}

/**<============== End Select Status <================*/

/**==============> Select Sow ================>*/

const registerSelectSowUI = (info: LandTileInfo) => {
  // Initialize UI
  clear();
  show("#select-sow");
  showBackButton(info)

  const selectSow = document.querySelector("#select-sow");
  // Sow methods
  const sowMethodSelection = selectSow.querySelector('#sow-method');
  const sowMethodOptions = appendOptions(sowMethod, sowMethodSelection);

  // Sow Gap
  const sowGapSelection = selectSow.querySelector('#sow-gap');
  appendOptions(sowGap, sowGapSelection);
  const sowGapOptions = sowGapSelection.querySelectorAll("option");

  // Sow Degree
  const sowDegreeIndicator: HTMLSpanElement = selectSow.querySelector("#sow-degree span");
  const sowDegreeConfig: HTMLInputElement = selectSow.querySelector('#sow-degree input')
  sowDegreeConfig.oninput = (event: any) => {
    let degree = event.target.value.toString();
    if (Number(event.target.value) < 10) {
      degree = '&nbsp;&nbsp;' + degree
    } else if (Number(event.target.value) < 100) {
      degree = '&nbsp;' + degree
    } else {
      // pass
    }
    sowDegreeIndicator.innerHTML = `파종 각도: ${degree}`;
  }

  if (info.sow) {
    sowMethodOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.sow.method) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    })
    sowGapOptions.forEach((option: HTMLOptionElement) => {
      if (option.value === info.sow.gap) {
        option.setAttribute("selected", "true");
      } else {
        option.removeAttribute("selected");
      }
    })
    sowDegreeConfig.value = info.sow.degree.toString();
    sowDegreeIndicator.innerText = `파종 각도: ${info.sow.degree}`;
  }
};

/**<============== End Select Sow <================*/

/**==============> Top Dressing ================>*/

const registerSelectTopDressingUI = (info: LandTileInfo) => {}

/**<============== End Top Dressing <================*/

/**==============> Plowing ================>*/

const registerSelectPlowingButtonUI = (info: LandTileInfo) => {}

/**<============== End Plowing <================*/

// Main

registerCropSelectionUI({
  x: [0, 10],
  y: [0, 10],
});

const getTimeDom = () => {
  return document.querySelector(".time-text");
};

export const setTime = (timeText: string) => {
  const dom = getTimeDom();
  if (dom) {
    dom.innerHTML = timeText;
  }
};
