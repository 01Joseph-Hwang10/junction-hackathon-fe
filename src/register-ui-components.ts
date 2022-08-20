import { CropType } from "./types";

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