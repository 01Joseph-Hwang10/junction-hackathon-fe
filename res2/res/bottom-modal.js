'use strict';
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
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
/**==============> States ================>*/
var selectCropOpened = false;
var selectStatusOpened = false;
var selectSowOpened = false;
var selectIrrigationOpened = false;
var selectTopdressingOpened = false;
var selectPlowingOpened = false;
var selectHarvestOpened = false;
var clearState = function () {
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
var actionCreatorBottomModal = function (action, payload) {
  return {
    action: action,
    payload: payload,
  };
};
var show = function (selector) {
  document.querySelector(selector).setAttribute('style', 'display: flex;');
};
var clear = function () {
  document.querySelectorAll('section').forEach(function (section) {
    section.setAttribute('style', 'display: none;');
  });
};
var showBackButton = function () {
  document.querySelectorAll('#indicator .side').forEach(function (side) {
    side.setAttribute('style', 'display: block;');
  });
  document.querySelector('#indicator').removeAttribute('style');
  var backButton = document.querySelector('#indicator .back');
  backButton.onclick = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var currentTileInfo;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, requestCurrentTileInfo()];
          case 1:
            currentTileInfo = _a.sent();
            registerSelectStatusUI(currentTileInfo);
            return [2 /*return*/];
        }
      });
    });
  };
};
var hideBackButton = function () {
  document.querySelectorAll('#indicator .side').forEach(function (side) {
    side.setAttribute('style', 'display: none;');
  });
};
var setIndicator = function (statement) {
  var indicator = document.querySelector('#indicator .title');
  indicator.innerHTML = statement;
};
var setSubIndicator = function (statement) {
  var indicator = document.querySelector('#indicator .subtitle');
  indicator.innerHTML = statement;
};
var getStatusStatement = function (crop) {
  return ''.concat(crop, '<normal>\uC744 \uC2EC\uC740 \uB18D\uC9C0</normal>');
};
var getButtonCard = function () {
  return document.querySelector('#button-card');
};
var getOption = function () {
  return document.querySelector('#option');
};
/**<============== End Utilities <================*/
/**==============> Constants ================>*/
var iconSelection = {
  Japonica: 'https://d3yor8z393217.cloudfront.net/rice.svg',
  Tomato: 'https://d3yor8z393217.cloudfront.net/tomato.svg',
  Corn: 'https://d3yor8z393217.cloudfront.net/corn.svg',
};
var cropSelection = {
  Japonica: '쌀',
  Tomato: '토마토',
  Corn: '옥수수',
};
var actions = {
  sow: '파종',
  irrigation: '관개',
  topdressing: '시비',
  plowing: '경운',
  harvest: '수확',
};
var descriptionActions = {
  sow: '파종을 하면 작물을 심을 수 있습니다.',
  irrigation: '관개를 하면 작물을 물을 수 있습니다.',
  topdressing: '시비를 하면 작물에 비료를 줄 수 있습니다.',
  plowing: '경운을 하면 작물을 흙으로 뒤집을 수 있습니다.',
  harvest: '수확을 하면 작물을 수확할 수 있습니다.',
};
var sowMethod = {
  direct: '직접',
  indirect: '간접',
};
var sowGap = {
  narrow: '좁게',
  wide: '넓게',
};
var irrigationMethod = {
  Flood: 'Flood',
  Sprinkler: 'Sprinkler',
  Furrow: 'Furrow',
};
var topDressingMethod = {
  'applied-in-irrigation-water': '관개수식',
  'band-on-soil': '밴드식',
  'banded-on-beneath-surface': '묻는 방식',
};
var appendButtonCards = function (type, items, to) {
  // Clear cards
  var cards = to.querySelectorAll('.card');
  cards.forEach(function (card) {
    return card.remove();
  });
  // Attach cards
  var buttonCard = getButtonCard();
  for (var _i = 0, _a = Object.keys(items); _i < _a.length; _i++) {
    var card = _a[_i];
    var clone = document.importNode(buttonCard.content, true);
    var button = clone.querySelector('.card');
    button.setAttribute('to', card);
    button.setAttribute('style', 'width: '.concat(100 / items.length, '%;'));
    var span = clone.querySelector('span');
    span.innerHTML =
      type === 'crop-selection'
        ? '<div class="button-wrap"><img src="'
            .concat(iconSelection[card], '" /><span>')
            .concat(items[card], '</span></div>')
        : '<div class="button-wrap"><span>'
            .concat(items[card], '</span><div class="popup">')
            .concat(descriptionActions[card], '</div></div>');
    var cards_1 = to.querySelector('.cards');
    cards_1.appendChild(clone);
  }
  var buttons = [];
  to.querySelectorAll('button.card').forEach(function (button) {
    return buttons.push(button);
  });
  return buttons;
};
var appendOptions = function (options, to) {
  // Clear options
  var optionsElement = to.querySelectorAll('option');
  optionsElement.forEach(function (option, index) {
    if (index === 0) {
      option.selected = true;
    } else {
      option.remove();
    }
  });
  // Append options
  var optionTemplate = getOption();
  for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
    var item = _a[_i];
    var clone = document.importNode(optionTemplate.content, true);
    var span = clone.querySelector('span');
    span.innerText = options[item];
    var option = clone.querySelector('option');
    option.value = item;
    to.appendChild(clone);
  }
  var opts = [];
  to.querySelectorAll('option').forEach(function (opt) {
    return opts.push(opt);
  });
  return opts;
};
/**<============== End Appenders <================*/
/**==============> CropSelection ================>*/
var requestCurrentTileInfo = function () {
  return new Promise(function (resolve) {
    window.addEventListener('message', function (_a) {
      var data = _a.data;
      if (data.action === 'response-current-tile-info') {
        resolve(data.payload);
      }
    });
    window.postMessage(actionCreatorBottomModal('request-current-tile-info', null));
  });
};
var registerCropSelectionUI = function () {
  if (selectCropOpened) return;
  clearState();
  selectCropOpened = true;
  // Initialize UI
  clear();
  show('#select-crop');
  hideBackButton();
  // Indicator
  setIndicator('비어있는 농지');
  setSubIndicator('수확할 농작물을 선택해주세요.');
  // Crop Selection
  var selectCrop = document.querySelector('#select-crop');
  var buttons = appendButtonCards('crop-selection', cropSelection, selectCrop);
  buttons.forEach(function (button) {
    button.onclick = function () {
      return __awaiter(void 0, void 0, void 0, function () {
        var crop, currentTileInfo;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              crop = button.getAttribute('to');
              return [4 /*yield*/, requestCurrentTileInfo()];
            case 1:
              currentTileInfo = _a.sent();
              registerSelectStatusUI(__assign(__assign({}, currentTileInfo), { crop: crop }));
              return [2 /*return*/];
          }
        });
      });
    };
  });
};
/**<============== End CropSelection <================*/
/**==============> Select Status ================>*/
var registerSelectStatusUI = function (info) {
  if (selectStatusOpened) return;
  clearState();
  selectStatusOpened = true;
  // Initialize UI
  clear();
  show('#select-status');
  hideBackButton();
  // Title Statement
  setIndicator(getStatusStatement(cropSelection[info.crop]));
  setSubIndicator('<progress max="100" value="20" ></progress>');
  // Progress
  var selectStatus = document.querySelector('#select-status');
  var progress = selectStatus.querySelector('progress');
  progress.value = info.progress * 100;
  // Actions
  var buttons = appendButtonCards('actions', actions, selectStatus);
  var sowButton = buttons[0],
    irrigationButton = buttons[1],
    topDressingButton = buttons[2],
    plowingButton = buttons[3],
    harvestButton = buttons[4];
  sowButton.onclick = function () {
    return registerSelectSowUI(info);
  };
  irrigationButton.onclick = function () {
    return registerSelectIrrigationUI(info);
  };
  topDressingButton.onclick = function () {
    return registerSelectTopDressingUI(info);
  };
  plowingButton.onclick = function () {}; // Some Action when plowing
  harvestButton.onclick = function () {}; // Some Action when harvest
};
/**<============== End Select Status <================*/
var registerSelectSowUI = function (info) {
  if (selectSowOpened) return;
  clearState();
  selectSowOpened = true;
  // Initialize UI
  clear();
  show('#select-sow');
  showBackButton();
  var selectSow = document.querySelector('#select-sow');
  // Sow methods
  var sowMethodSelection = selectSow.querySelector('#sow-method');
  var sowMethodOptions = appendOptions(sowMethod, sowMethodSelection);
  // Sow Gap
  var sowGapSelection = selectSow.querySelector('#sow-gap');
  appendOptions(sowGap, sowGapSelection);
  var sowGapOptions = sowGapSelection.querySelectorAll('option');
  // Sow Degree
  var sowDegreeIndicator = selectSow.querySelector('#sow-degree span');
  var sowDegreeConfig = selectSow.querySelector('#sow-degree input');
  sowDegreeConfig.oninput = function (event) {
    var degree = event.target.value.toString();
    if (Number(event.target.value) < 10) {
      degree = '&nbsp;&nbsp;' + degree;
    } else if (Number(event.target.value) < 100) {
      degree = '&nbsp;' + degree;
    } else {
      // pass
    }
    sowDegreeIndicator.innerHTML = '\uD30C\uC885 \uAC01\uB3C4: '.concat(degree);
  };
  if (info.sow) {
    sowMethodOptions.forEach(function (option) {
      if (option.value === info.sow.method) {
        option.setAttribute('selected', 'true');
      } else {
        option.removeAttribute('selected');
      }
    });
    sowGapOptions.forEach(function (option) {
      if (option.value === info.sow.gap) {
        option.setAttribute('selected', 'true');
      } else {
        option.removeAttribute('selected');
      }
    });
    sowDegreeConfig.value = info.sow.degree.toString();
    sowDegreeIndicator.innerText = '\uD30C\uC885 \uAC01\uB3C4: '.concat(info.sow.degree);
  }
};
/**<============== End Select Sow <================*/
/**==============> Irrigation ================>*/
var registerSelectIrrigationUI = function (info) {
  if (selectIrrigationOpened) return;
  clearState();
  selectIrrigationOpened = true;
  // Initialize UI
  clear();
  show('#select-irrigation');
  showBackButton();
  var selectIrrigation = document.querySelector('#select-irrigation');
  // Irrigation methods
  var irrigationMethodSelection = selectIrrigation.querySelector('#sow-method');
  var irrigationMethodOptions = appendOptions(irrigationMethod, irrigationMethodSelection);
  // Add Irrigation
  var addIrrigationButton = selectIrrigation.querySelector('#add-irrigation button');
  addIrrigationButton.onclick = function () {
    window.postMessage(actionCreatorBottomModal('add-irrigation', null));
  };
  if (info.irrigation.method) {
    irrigationMethodOptions.forEach(function (option) {
      if (option.value === info.irrigation.method) {
        option.setAttribute('selected', 'true');
      } else {
        option.removeAttribute('selected');
      }
    });
  }
};
/**<============== End Irrigation <================*/
/**==============> Top Dressing ================>*/
var registerSelectTopDressingUI = function (info) {
  if (selectTopdressingOpened) return;
  clearState();
  selectTopdressingOpened = true;
  // Initialize UI
  clear();
  show('#select-topdressing');
  showBackButton();
  var selectTopDressing = document.querySelector('#select-topdressing');
  // Top Dressing methods
  var topDressingMethodSelection = selectTopDressing.querySelector('#topdressing-method');
  var topDressingMethodOptions = appendOptions(topDressingMethod, topDressingMethodSelection);
  // Material configuration
  var materialIndicators = selectTopDressing.querySelectorAll('#topdressing-material > div');
  materialIndicators.forEach(function (indicator) {
    var amountConfig = indicator.querySelector('input');
    amountConfig.oninput = function (event) {
      // Do some data stuff
    };
  });
  // Top Dressing Depth
  var topDressingDepthIndicator = selectTopDressing.querySelector('#topDressing-depth span');
  var topDressingDepthConfig = selectTopDressing.querySelector('#topDressing-depth input');
  topDressingDepthConfig.oninput = function (event) {
    var depth = event.target.value.toString();
    if (Number(event.target.value) < 10) {
      depth = '&nbsp;' + depth;
    }
    topDressingDepthIndicator.innerHTML = '\uC2DC\uBE44 \uAE4A\uC774: '.concat(depth);
  };
  if (info.topdressing.method) {
    topDressingMethodOptions.forEach(function (option) {
      if (option.value === info.topdressing.method) {
        option.setAttribute('selected', 'true');
      } else {
        option.removeAttribute('selected');
      }
    });
  }
  topDressingDepthConfig.value = info.topdressing.depth.toString();
  topDressingDepthIndicator.innerText = '\uC2DC\uBE44 \uAE4A\uC774: '.concat(info.topdressing.depth);
  materialIndicators.forEach(function (indicator) {
    var amountConfig = indicator.querySelector('input');
    amountConfig.value = info.topdressing.material[indicator.id.replace('topdressing-', '')].toString();
  });
};
/**<============== End Top Dressing <================*/
// Main
var isShowModal = false;
var getIsShowModal = function () {
  return isShowModal;
};
var setIsShowModal = function (isShowModal) {
  isShowModal = isShowModal;
};
var registerDefaultEventListener = function () {
  window.addEventListener('message', function (_a) {
    var data = _a.data;
    var root = document.querySelector('#modal-top-container');
    var isShowModal = getIsShowModal();
    if (isShowModal === false && data.action === 'show-crop-ui') {
      setIsShowModal(true);
      root.setAttribute('style', 'display: flex;');
      if (data.payload.crop) {
        registerSelectStatusUI(data.payload);
      } else {
        registerCropSelectionUI();
      }
    } else if (isShowModal === true && data.action === 'hide-crop-ui') {
      setIsShowModal(false);
      root.setAttribute('style', 'display: none;');
    }
  });
};
registerDefaultEventListener();
