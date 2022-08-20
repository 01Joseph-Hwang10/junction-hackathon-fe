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
/**==============> Utilities ================>*/
var clear = function () {
    document.querySelectorAll("section").forEach(function (section) {
        section.setAttribute("style", "display: none;");
    });
};
var show = function (selector) {
    document.querySelector(selector).setAttribute("style", "display: flex;");
};
var showBackButton = function (info) {
    document.querySelectorAll('#indicator .side').forEach(function (side) {
        side.setAttribute('style', 'display: block;');
    });
    document.querySelector('#indicator').removeAttribute('style');
    var backButton = document.querySelector('#indicator .back');
    backButton.onclick = function () { return registerSelectStatusUI(info); };
};
var hideBackButton = function () {
    document.querySelectorAll('#indicator .side').forEach(function (side) {
        side.setAttribute('style', 'display: none;');
    });
    document.querySelector('#indicator').setAttribute('style', 'justify-content: center;');
};
var setIndicator = function (statement) {
    var indicator = document.querySelector("#indicator .title");
    indicator.innerText = statement;
};
var getStatusStatement = function (crop) { return "".concat(crop, "\uC744 \uC2EC\uC740 \uB18D\uC9C0"); };
var getButtonCard = function () {
    return document.querySelector("#button-card");
};
var getOption = function () { return document.querySelector('#option'); };
/**<============== End Utilities <================*/
/**==============> Constants ================>*/
var cropSelection = {
    Japonica: "쌀",
    Tomato: "토마토",
    Corn: "옥수수"
};
var actions = {
    sow: "파종",
    irrigation: "관개",
    topdressing: "시비",
    plowing: "경운",
    harvest: "수확"
};
var sowMethod = {
    'direct': '직접',
    'indirect': '간접'
};
var sowGap = {
    'narrow': '좁게',
    'wide': '넓게'
};
/**<============== End Constants <================*/
/**==============> Appenders ================>*/
var appendButtonCards = function (items, to) {
    // Clear cards
    var cards = to.querySelectorAll(".card");
    cards.forEach(function (card) { return card.remove(); });
    // Attach cards
    var buttonCard = getButtonCard();
    for (var _i = 0, _a = Object.keys(items); _i < _a.length; _i++) {
        var card = _a[_i];
        var clone = document.importNode(buttonCard.content, true);
        var button = clone.querySelector(".card");
        button.setAttribute("to", card);
        button.setAttribute("style", "width: ".concat(100 / items.length, "%;"));
        var span = clone.querySelector("span");
        span.innerText = items[card];
        var cards_1 = to.querySelector(".cards");
        cards_1.appendChild(clone);
    }
    var buttons = [];
    to.querySelectorAll("button.card").forEach(function (button) {
        return buttons.push(button);
    });
    return buttons;
};
var appendOptions = function (options, to) {
    // Clear options
    var optionsElement = to.querySelectorAll("option");
    optionsElement.forEach(function (option, index) {
        if (index === 0) {
            option.selected = true;
        }
        else {
            option.remove();
        }
    });
    // Append options
    var optionTemplate = getOption();
    for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
        var item = _a[_i];
        var clone = document.importNode(optionTemplate.content, true);
        var span = clone.querySelector("span");
        span.innerText = options[item];
        var option = clone.querySelector("option");
        option.value = item;
        to.appendChild(clone);
    }
    var opts = [];
    to.querySelectorAll("option").forEach(function (opt) {
        return opts.push(opt);
    });
    return opts;
};
/**<============== End Appenders <================*/
/**==============> CropSelection ================>*/
var registerCropSelectionUI = function (range) {
    // Initialize UI
    clear();
    show("#select-crop");
    hideBackButton();
    // Indicator
    setIndicator("비어있는 농지");
    // Crop Selection
    var selectCrop = document.querySelector("#select-crop");
    var buttons = appendButtonCards(cropSelection, selectCrop);
    buttons.forEach(function (button) {
        button.onclick = function () {
            var crop = button.getAttribute("to");
            registerSelectStatusUI({
                crop: crop,
                range: range,
                progress: 0,
                id: Math.random().toString()
            });
        };
    });
};
/**<============== End CropSelection <================*/
/**==============> Select Status ================>*/
var registerSelectStatusUI = function (info) {
    // Initialize UI
    clear();
    show("#select-status");
    hideBackButton();
    // Title Statement
    setIndicator(getStatusStatement(cropSelection[info.crop]));
    // Progress
    var selectStatus = document.querySelector("#select-status");
    var progress = selectStatus.querySelector("progress");
    progress.value = info.progress * 100;
    // Actions
    var buttons = appendButtonCards(actions, selectStatus);
    var sowButton = buttons[0], irrigationButton = buttons[1], topDressingButton = buttons[2], plowingButton = buttons[3], harvestButton = buttons[4];
    sowButton.onclick = function () { return registerSelectSowUI(info); };
    irrigationButton.onclick = function () { };
    topDressingButton.onclick = function () { return registerSelectTopDressingUI(info); };
    plowingButton.onclick = function () { }; // Some Action when plowing
    harvestButton.onclick = function () { }; // Some Action when harvest
};
/**<============== End Select Status <================*/
/**==============> Select Sow ================>*/
var registerSelectSowUI = function (info) {
    // Initialize UI
    clear();
    show("#select-sow");
    showBackButton(info);
    var selectSow = document.querySelector("#select-sow");
    // Sow methods
    var sowMethodSelection = selectSow.querySelector('#sow-method');
    var sowMethodOptions = appendOptions(sowMethod, sowMethodSelection);
    // Sow Gap
    var sowGapSelection = selectSow.querySelector('#sow-gap');
    appendOptions(sowGap, sowGapSelection);
    var sowGapOptions = sowGapSelection.querySelectorAll("option");
    // Sow Degree
    var sowDegreeIndicator = selectSow.querySelector("#sow-degree span");
    var sowDegreeConfig = selectSow.querySelector('#sow-degree input');
    sowDegreeConfig.oninput = function (event) {
        var degree = event.target.value.toString();
        if (Number(event.target.value) < 10) {
            degree = '&nbsp;&nbsp;' + degree;
        }
        else if (Number(event.target.value) < 100) {
            degree = '&nbsp;' + degree;
        }
        else {
            // pass
        }
        sowDegreeIndicator.innerHTML = "\uD30C\uC885 \uAC01\uB3C4: ".concat(degree);
    };
    if (info.sow) {
        sowMethodOptions.forEach(function (option) {
            if (option.value === info.sow.method) {
                option.setAttribute("selected", "true");
            }
            else {
                option.removeAttribute("selected");
            }
        });
        sowGapOptions.forEach(function (option) {
            if (option.value === info.sow.gap) {
                option.setAttribute("selected", "true");
            }
            else {
                option.removeAttribute("selected");
            }
        });
        sowDegreeConfig.value = info.sow.degree.toString();
        sowDegreeIndicator.innerText = "\uD30C\uC885 \uAC01\uB3C4: ".concat(info.sow.degree);
    }
};
/**<============== End Select Sow <================*/
/**==============> Top Dressing ================>*/
var registerSelectTopDressingUI = function (info) { };
/**<============== End Top Dressing <================*/
/**==============> Plowing ================>*/
var registerSelectPlowingButtonUI = function (info) { };
/**<============== End Plowing <================*/
// Main
registerCropSelectionUI({
    x: [0, 10],
    y: [0, 10]
});
var getTimeDom = function () {
    return document.querySelector(".time-text");
};
var setTime = function (timeText) {
    var dom = getTimeDom();
    if (dom) {
        dom.innerHTML = timeText;
    }
};
