const cropSelection = [
  'japonica',
  'tomato',
  'corn'
]

/*
농장에 작물이 없을때:
- #select-crop
농장에 작물이 있을때:
- #

*/
const registerUIComponents = () => {
  const buttonCard = document.querySelector('#button-card')
  /** ==============> Crop Selection ================> */
  const emptyCrop = document.querySelector('#empty-crop')
  // Buttons
  for (const crop of cropSelection) {
    const clone = document.importNode(buttonCard.content, true)
    const wrapper = clone.querySelector('.card')
    wrapper.style = 'width: ' + (100 / cropSelection.length) + '%;'
    const span = clone.querySelector('span')
    span.innerText = crop
    const cards = emptyCrop.querySelector('.cards')
    cards.appendChild(clone)
  }

  /** <============== End Crop Selection <================ */
}

registerUIComponents()
