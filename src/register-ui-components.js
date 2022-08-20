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

var clear = function () {
    document.querySelectorAll('section').forEach(function (section) {
        section.setAttribute('style', 'display: none;');
    });
};
var show = function (selector) {
    document.querySelector(selector).setAttribute('style', 'display: flex;');
};
var setIndicator = function (statement) {
    var indicator = document.querySelector('#indicator');
    indicator.innerText = statement;
};
var getStatusStatement = function (crop) { return "".concat(crop, "\uC744 \uC2EC\uC740 \uB18D\uC9C0"); };
var getButtonCard = function () { return document.querySelector('#button-card'); };
var cropSelection = {
    'Japonica': '쌀',
    'Tomato': '토마토',
    'Corn': '옥수수'
};
var appendButtonCards = function (items, to) {
    var buttonCard = getButtonCard();
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var card = items_1[_i];
        var clone = document.importNode(buttonCard.content, true);
        var button = clone.querySelector('.card');
        button.setAttribute('to', card);
        button.setAttribute('style', "width: ".concat(100 / items.length, "%;"));
        var span = clone.querySelector('span');
        span.innerText = card;
        var cards = to.querySelector('.cards');
        cards.appendChild(clone);
    }
    var buttons = [];
    to.querySelectorAll('button.card').forEach(function (button) { return buttons.push(button); });
    return buttons;
};
var registerCropSelectionUI = function () {
    // Initialize UI
    clear();
    show('#select-crop');
    // Indicator
    setIndicator('비어있는 농지');
    // Crop Selection
    var selectCrop = document.querySelector('#select-crop');
    var buttons = appendButtonCards(Object.keys(cropSelection), selectCrop);
    buttons.forEach(function (button) {
        button.onclick = function () {
            var crop = button.getAttribute('to');
            registerSelectStatusUI({
                crop: crop,
                progress: 0,
                range: {
                    x: [0, 10],
                    y: [0, 10]
                },
                id: Math.random().toString()
            });
        };
    });
};
var actions = {
    'sow': '파종',
    'irrigation': '관개',
    'topdressing': '시비',
    'plowing': '경운',
    'harvest': '수확'
};
var registerSelectStatusUI = function (info) {
    // Initialize UI
    clear();
    show('#select-status');
    // Title Statement
    setIndicator(getStatusStatement(info.crop));
    // Progress
    var selectStatus = document.querySelector('#select-status');
    var progress = selectStatus.querySelector('progress');
    progress.value = info.progress * 100;
    // Actions
    var buttons = appendButtonCards(Object.keys(actions), selectStatus);
    var sowButton = buttons[0], irrigationButton = buttons[1], topDressingButton = buttons[2], plowingButton = buttons[3], harvestButton = buttons[4];
    sowButton.onclick = function () { return registerSelectSowUI(info); };
};
var registerSelectSowUI = function (info) { };
registerCropSelectionUI();
