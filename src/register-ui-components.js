"use strict";
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

var setIndicator = function (statement) {
    var indicator = document.querySelector('#indicator');
    indicator.innerText = statement;
};
var getStatusStatement = function (crop) { return "".concat(crop, "\uC744 \uC2EC\uC740 \uB18D\uC9C0"); };
var getButtonCard = function () { return document.querySelector('#button-card'); };
var cropSelection = [
    'japonica',
    'tomato',
    'corn'
];
var appendButtonCards = function (items, to) {
    var buttonCard = getButtonCard();
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var card = items_1[_i];
        var clone = document.importNode(buttonCard.content, true);
        var wrapper = clone.querySelector('.card');
        wrapper.setAttribute('style', "width: ".concat(100 / items.length, "%;"));
        var span = clone.querySelector('span');
        span.innerText = card;
        var cards = to.querySelector('.cards');
        cards.appendChild(clone);
    }
};
var registerCropSelectionUI = function () {
    // Indicator
    setIndicator('비어있는 농지');
    // Crop Selection
    var selectCrop = document.querySelector('#select-crop');
    appendButtonCards(cropSelection, selectCrop);
};
var actions = [
    'sow',
    'irrigation',
    'topdressing',
    'cultivation',
    'harvest'
];
var registerSelectStatusUI = function (info) {
    var selectStatus = document.querySelector('#select-status');
    // Title Statement
    var title = selectStatus.querySelector('h1');
    title.innerText = getStatusStatement(info.crop);
    // Progress
    var progress = selectStatus.querySelector('progress');
    progress.value = info.progress * 100;
    // Actions
    appendButtonCards(actions, selectStatus);
};
registerCropSelectionUI();
