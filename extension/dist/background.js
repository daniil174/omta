/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ({

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OptionsHelper = function () {
    function OptionsHelper() {
        _classCallCheck(this, OptionsHelper);

        this.LINKS_CHECKER_BLACK_LIST = 'links_checker_black_list';
        this.LINKS_CHECKER_TIMEOUT = 'links_checker_timeout';

        this.defaultOptions = {};
        this.defaultOptions[this.LINKS_CHECKER_BLACK_LIST] = [];
        this.defaultOptions[this.LINKS_CHECKER_TIMEOUT] = 30 * 1000;
    }

    _createClass(OptionsHelper, [{
        key: 'getAll',
        value: function getAll() {
            var $this = this;
            return new Promise(function (resolve) {
                chrome.storage.sync.get($this.defaultOptions, resolve);
            });
        }
    }, {
        key: 'setAll',
        value: function setAll(options) {
            return new Promise(function (resolve) {
                chrome.storage.sync.set(options, resolve);
            });
        }
    }]);

    return OptionsHelper;
}();

exports.default = OptionsHelper;

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(35);


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _BackgroundModule = __webpack_require__(36);

var _BackgroundModule2 = _interopRequireDefault(_BackgroundModule);

var _BackgroundModule3 = __webpack_require__(37);

var _BackgroundModule4 = _interopRequireDefault(_BackgroundModule3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var linksCheckerModule = new _BackgroundModule2.default();
var pageInfoModule = new _BackgroundModule4.default();

(function () {
    var connections = {};
    chrome.runtime.onConnect.addListener(function (port) {
        var extensionListener = function extensionListener(message, sender, sendResponse) {
            linksCheckerModule.handlePanelMessage(message, connections);

            switch (message.name) {
                case 'init':
                    connections[message.tabId] = port;
                    chrome.tabs.sendMessage(message.tabId, { name: 'init' });
                    break;
            }
        };

        port.onMessage.addListener(extensionListener);

        port.onDisconnect.addListener(function (port) {
            port.onMessage.removeListener(extensionListener);

            var tabs = Object.keys(connections);
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (connections[tabs[i]] === port) {
                    delete connections[tabs[i]];
                    break;
                }
            }
        });
    });

    chrome.runtime.onMessage.addListener(function (message, sender) {

        linksCheckerModule.handleContentMessage(message, sender, connections);
        pageInfoModule.handleContentMessage(message, sender, connections);

        return true;
    });
})();

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LinksChecker = __webpack_require__(8);

var _LinksChecker2 = _interopRequireDefault(_LinksChecker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BackgroundModule = function () {
    function BackgroundModule() {
        _classCallCheck(this, BackgroundModule);

        this.enableSession = false;
        this.sessionLinks = [];
        this.linksChecker = new _LinksChecker2.default();
    }

    _createClass(BackgroundModule, [{
        key: 'handlePanelMessage',
        value: function handlePanelMessage(message, connections) {
            switch (message.name) {
                case 'checkLinks':
                case 'stopCheckLinks':
                case 'rescanTimeoutLinks':
                    chrome.tabs.sendMessage(message.tabId, { name: message.name });
                    break;
                case 'startSession':
                    this.enableSession = true;
                    break;
                case 'stopSession':
                    this.enableSession = false;
                    this.sessionLinks = [];
                    break;

                case 'getSessionLinksCount':
                    connections[message.tabId].postMessage({
                        name: 'getSessionLinksCount',
                        count: Object.keys(this.sessionLinks).length
                    });
                    break;
            }
        }
    }, {
        key: 'handleContentMessage',
        value: function handleContentMessage(message, sender, connections) {
            var $this = this;
            switch (message.name) {
                case 'linksCount':
                    connections[sender.tab.id].postMessage(message);
                    break;
                case 'checkLink':
                    var resultLink = $this.sessionLinks[message.link];
                    if ($this.enableSession && resultLink && resultLink.httpStatus >= 200 && resultLink.httpStatus < 400) {
                        resultCallback(resultLink.requestTime, resultLink.httpStatus);
                    } else {
                        $this.linksChecker.checkOne(message.link, function (httpStatus, requestTime) {
                            if ($this.enableSession) {
                                $this.sessionLinks[message.link] = {
                                    requestTime: requestTime,
                                    httpStatus: httpStatus
                                };
                            }

                            resultCallback(requestTime, httpStatus);
                        });
                    }

                    break;
            }

            function resultCallback(requestTime, httpStatus) {
                chrome.tabs.sendMessage(sender.tab.id, {
                    name: 'checkingLinksCallback',
                    status: httpStatus,
                    requestTime: requestTime,
                    index: message.index
                });

                connections[sender.tab.id].postMessage({
                    name: 'checkedLink',
                    url: message.link,
                    requestTime: requestTime,
                    status: httpStatus
                });
            }
        }
    }]);

    return BackgroundModule;
}();

exports.default = BackgroundModule;

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageInfoModule = function () {
    function PageInfoModule() {
        _classCallCheck(this, PageInfoModule);
    }

    _createClass(PageInfoModule, [{
        key: 'handleContentMessage',
        value: function handleContentMessage(message, sender, connections) {
            switch (message.name) {
                case 'pageInfo':
                    if (sender.tab) {
                        var tabId = sender.tab.id;
                        if (tabId in connections) {
                            chrome.cookies.getAll({ url: message.pageInfo.url }, function (cookies) {
                                message.cookies = cookies;
                                connections[tabId].postMessage(message);
                            });
                        } else {
                            console.log('Tab not found in connection list.');
                        }
                    } else {
                        console.log('sender.tab not defined.');
                    }
                    break;
            }
        }
    }]);

    return PageInfoModule;
}();

exports.default = PageInfoModule;

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _OptionsHelper = __webpack_require__(3);

var _OptionsHelper2 = _interopRequireDefault(_OptionsHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinksChecker = function () {
    function LinksChecker() {
        _classCallCheck(this, LinksChecker);

        this.linksList = null;
        this.checkerIndex = null;
        this.optionsHelper = new _OptionsHelper2.default();
        this._options = null;
    }

    _createClass(LinksChecker, [{
        key: 'init',
        value: function init() {
            var $this = this;
            this._getOptions().then(function () {
                $this.linksList = $this._filterLinks($this._findLinks());
                chrome.runtime.sendMessage({
                    name: 'linksCount',
                    count: $this.linksList.length
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, {
        key: '_getOptions',
        value: function _getOptions() {
            var $this = this;
            return this.optionsHelper.getAll().then(function (options) {
                return $this._options = options;
            });
        }
    }, {
        key: 'getLinks',
        value: function getLinks() {
            return this.linksList;
        }
    }, {
        key: '_findLinks',
        value: function _findLinks() {
            var links = [];
            document.querySelectorAll('a').forEach(function (linkNode) {
                links.push({
                    domNode: linkNode,
                    status: null,
                    parsed_url: {
                        protocol: linkNode.protocol,
                        hostname: linkNode.hostname,
                        pathname: linkNode.pathname,
                        hash: linkNode.hash,
                        search: linkNode.search
                    }
                });
            });

            return links;
        }
    }, {
        key: '_filterLinks',
        value: function _filterLinks(links) {
            var $this = this;
            return links.filter(function (link) {
                return $this._options.links_checker_black_list.indexOf(link.domNode.href) === -1;
            });
        }
    }, {
        key: '_clearStyles',
        value: function _clearStyles() {
            this.linksList.forEach(function (link) {
                link.domNode.classList.remove('checker-link', 'checker-success', 'checker-error', 'checker-progress');
                link.domNode.classList.add('checker-link');
            });
        }
    }, {
        key: 'stopCheckLinks',
        value: function stopCheckLinks() {
            this.checkerIndex = null;
            console.log('Stop checking links.');
        }
    }, {
        key: 'checkLinks',
        value: function checkLinks() {
            var restart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (restart) {
                this.checkerIndex = 0;
                this._clearStyles();
                this.linksList.map(function (link) {
                    link.status = null;
                });
            }

            chrome.runtime.sendMessage({
                name: 'linksCount',
                count: this.linksList.length
            });

            var link = this.linksList[this.checkerIndex];
            if (link) {
                link.domNode.classList.add('checker-progress');
                chrome.runtime.sendMessage({
                    name: 'checkLink',
                    link: link.domNode.href,
                    index: this.checkerIndex
                });
                this.checkerIndex++;
            } else {
                console.log('Stop checking links.');
            }
        }
    }, {
        key: 'checkLinksCallback',
        value: function checkLinksCallback(message) {
            if (this.checkerIndex !== null) {
                var css = 'checker-error',
                    color = 'red';
                if (message.status >= 200 && message.status < 300) {
                    css = 'checker-success';
                    color = '';
                }
                this.linksList[message.index].domNode.classList.remove('checker-success', 'checker-error', 'checker-progress');
                this.linksList[message.index].domNode.classList.add(css);

                console.log('%c' + this.linksList[message.index].domNode.href + ' - ' + message.status + ' ' + message.requestTime + 'ms', 'color:' + color);

                if (this.linksList[message.index].status === null) {
                    this.checkLinks();
                }

                this.linksList[message.index].status = message.status;
            }
        }
    }, {
        key: 'rescanTimeoutLinks',
        value: function rescanTimeoutLinks() {
            console.log('Rechecking timeout links.');
            for (var key in this.linksList) {
                if (this.linksList[key].status === 0 || this.linksList[key].status === 504) {
                    this.checkerIndex = 0;
                    chrome.runtime.sendMessage({
                        name: 'checkLink',
                        link: this.linksList[key].domNode.href,
                        index: key
                    });
                }
            }
        }
    }, {
        key: 'checkOne',
        value: function checkOne(link, callback) {
            var xhr = new XMLHttpRequest();

            var startTime = new Date().getTime();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                    var requestTime = new Date().getTime() - startTime;
                    callback(xhr.status, requestTime);
                    xhr.abort();
                }
            };

            xhr.onerror = function () {
                var requestTime = new Date().getTime() - startTime;
                callback(xhr.status, requestTime);
                xhr.abort();
            };

            xhr.ontimeout = function () {
                var requestTime = new Date().getTime() - startTime;
                callback(0, requestTime);
                xhr.abort();
            };

            if (this._options) {
                xhr.timeout = this._options.links_checker_timeout;
                xhr.open('GET', link);
                xhr.send();
            } else {
                this.optionsHelper.getAll().then(function (options) {
                    xhr.timeout = options.links_checker_timeout;
                    xhr.open('GET', link);
                    xhr.send();
                });
            }
        }
    }]);

    return LinksChecker;
}();

exports.default = LinksChecker;

/***/ })

/******/ });