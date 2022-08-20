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

import { CropType, LandTileInfo } from "./types"

const setIndicator = (statement: string) => {
  const indicator: HTMLHeadingElement = document.querySelector('#indicator')
  indicator.innerText = statement
}

const getStatusStatement = (crop: string) => `${crop}을 심은 농지`

const getButtonCard = (): HTMLTemplateElement => document.querySelector('#button-card')

const cropSelection: CropType[] = [
  'japonica',
  'tomato',
  'corn'
]

const appendButtonCards = <T extends string = string>(items: T[], to: Element) => {
  const buttonCard = getButtonCard()
  for (const card of items) {
    const clone = document.importNode(buttonCard.content, true)
    const wrapper: HTMLDivElement = clone.querySelector('.card')
    wrapper.setAttribute('style', `width: ${100 / items.length}%;`)
    const span = clone.querySelector('span')
    span.innerText = card
    const cards = to.querySelector('.cards')
    cards.appendChild(clone)
  }
}

const registerCropSelectionUI = () => {
  // Indicator
  setIndicator('비어있는 농지')

  // Crop Selection
  const selectCrop = document.querySelector('#select-crop')
  appendButtonCards(cropSelection, selectCrop)
}

const actions = [
  'sow',
  'irrigation',
  'topdressing',
  'cultivation',
  'harvest'
]

const registerSelectStatusUI = (info: LandTileInfo) => {
  const selectStatus = document.querySelector('#select-status')
  // Title Statement
  const title = selectStatus.querySelector('h1')
  title.innerText = getStatusStatement(info.crop)

  // Progress
  const progress =  selectStatus.querySelector('progress')
  progress.value = info.progress * 100

  // Actions
  appendButtonCards(actions, selectStatus)
}

registerCropSelectionUI()
