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

import { ActionType, CropType, LandTileInfo } from "./types"

const clear = () => {
  document.querySelectorAll('section').forEach((section) => {
    section.setAttribute('style', 'display: none;')
  })
}

const show = (selector: string) => {
  document.querySelector(selector).setAttribute('style', 'display: flex;')
}

const setIndicator = (statement: string) => {
  const indicator: HTMLHeadingElement = document.querySelector('#indicator')
  indicator.innerText = statement
}

const getStatusStatement = (crop: string) => `${crop}을 심은 농지`

const getButtonCard = (): HTMLTemplateElement => document.querySelector('#button-card')

const cropSelection: Record<CropType, string> = {
  'Japonica': '쌀',
  'Tomato': '토마토',
  'Corn': '옥수수',
}

const appendButtonCards = <T extends string = string>(items: T[], to: Element): HTMLButtonElement[] => {
  const buttonCard = getButtonCard()
  for (const card of items) {
    const clone = document.importNode(buttonCard.content, true)
    const button: HTMLButtonElement = clone.querySelector('.card')
    button.setAttribute('to', card)
    button.setAttribute('style', `width: ${100 / items.length}%;`)
    const span = clone.querySelector('span')
    span.innerText = card
    const cards = to.querySelector('.cards')
    cards.appendChild(clone)
  }
  const buttons: HTMLButtonElement[] = []
  to.querySelectorAll('button.card').forEach((button: HTMLButtonElement) => buttons.push(button))
  return buttons
}

const registerCropSelectionUI = () => {
  // Initialize UI
  clear()
  show('#select-crop')

  // Indicator
  setIndicator('비어있는 농지')

  // Crop Selection
  const selectCrop = document.querySelector('#select-crop')
  const buttons = appendButtonCards(Object.keys(cropSelection), selectCrop)
  buttons.forEach((button) => {
    button.onclick = () => {
      const crop: CropType = button.getAttribute('to') as CropType
      registerSelectStatusUI({
        crop,
        progress: 0,
        range: {
          x: [0, 10],
          y: [0, 10],
        },
        id: Math.random().toString(),
      })
    }
  })
}

const actions: Record<ActionType, string> = {
  'sow': '파종',
  'irrigation': '관개',
  'topdressing': '시비',
  'plowing': '경운',
  'harvest': '수확',
}

const registerSelectStatusUI = (info: LandTileInfo) => {
  // Initialize UI
  clear()
  show('#select-status')
  
  // Title Statement
  setIndicator(getStatusStatement(info.crop))
  
  // Progress
  const selectStatus = document.querySelector('#select-status')
  const progress =  selectStatus.querySelector('progress')
  progress.value = info.progress * 100
  
  // Actions
  const buttons = appendButtonCards(Object.keys(actions), selectStatus)
  const [sowButton, irrigationButton, topDressingButton, plowingButton, harvestButton] = buttons
  sowButton.onclick = () => registerSelectSowUI(info)
}

const registerSelectSowUI = (info: LandTileInfo) => {}

registerCropSelectionUI()
