﻿//AdBlock Protector Core Library
"use strict";

//=====Declaration=====
/**
 * Get a description string of this library.
 * @function
 * @returns {string} A description string of this library.
 */
const a = function () {
    return "AdBlock Protector Core Library " + a.VERSION;
};
/**
 * The version of this library.
 * @const {string}
 */
a.VERSION = "1.1";

//=====Initializer=====
/**
 * Initialize constants, protect functions, and activate mods.
 * @function
 * @param {Array.<string>} excludedDomCmp - The list of domains to exclude, a.domCmp() will be used to compare this.
 * @param {Array.<string>} excludedDomInc - The list of domains to exclude, a.domInc() will be used to compare this.
 */
a.init = function (excludedDomCmp, excludedDomInc) {
    //Load jQuery and Color plug-in
    a.$ = jQueryFactory(a.win, true);
    //The Color plug-in is never used, to enable it, uncomment the following line and @require the line after in metadata
    //jQueryColorLoader(a.$);
    //https://github.com/X01X012013/AdBlockProtector/raw/master/jQuery/Color.Loader.2.1.2.min.js
    //Load configurations
    a.config();
    a.config.domExcluded = a.domCmp(excludedDomCmp, true) || a.domInc(excludedDomInc, true);
    //Log excluded or protect functions
    if (a.config.domExcluded) {
        a.out.warn("This domain is in excluded list. ");
    }
    //Apply mods
    a.mods();
    //Set menu commands
    GM_registerMenuCommand("AdBlock Protector Settings Page", function () {
        GM_openInTab(a.c.settingsPage);
    });
    GM_registerMenuCommand("AdBlock Protector Home Page", function () {
        GM_openInTab(a.c.homePage);
    });
    GM_registerMenuCommand("AdBlock Protector Support Page", function () {
        GM_openInTab(a.c.supportPage);
    });
    //Home page installation test
    if (a.domCmp(["x01x012013.github.io"], true) && a.doc.location.href.includes("x01x012013.github.io/AdBlockProtector")) {
        a.win.AdBlock_Protector_Script = true;
    }
    //Settings page
    if (a.domCmp(["x01x012013.github.io"], true) && a.doc.location.href.includes("x01x012013.github.io/AdBlockProtector/settings.html")) {
        a.on("load", function () {
            a.win.init([a.config.debugMode, a.config.allowExperimental, a.mods.Facebook_JumpToTop, a.mods.Facebook_HidePeopleYouMayKnow, a.mods.Blogspot_AutoNCR,
a.mods.NoAutoplay], a.config.update);
        });
    }
    //Log domain
    a.out.warn("Domain: " + a.dom);
};

//=====Configurations=====
/**
 * Load configurations, includes mods configurations.
 * @function
 */
a.config = function () {
    //Configuration
    a.config.debugMode = GM_getValue("config_debugMode", a.config.debugMode);
    a.config.allowExperimental = GM_getValue("config_allowExperimental", a.config.allowExperimental);
    //Mods
    a.mods.Facebook_JumpToTop = GM_getValue("mods_Facebook_JumpToTop", a.mods.Facebook_JumpToTop);
    a.mods.Facebook_HidePeopleYouMayKnow = GM_getValue("mods_Facebook_HidePeopleYouMayKnow", a.mods.Facebook_HidePeopleYouMayKnow);
    a.mods.Blogspot_AutoNCR = GM_getValue("mods_Blogspot_AutoNCR", a.mods.Blogspot_AutoNCR);
    a.mods.NoAutoplay = GM_getValue("mods_NoAutoplay", a.mods.NoAutoplay);
};
/**
 * Update a configuration.
 * @function
 * @param {integer} id - The ID of the configuration.
 * @param {bool} val - The value of the configuration.
 */
a.config.update = function (id, val) {
    const names = ["config_debugMode", "config_allowExperimental", "mods_Facebook_JumpToTop", "mods_Facebook_HidePeopleYouMayKnow", "mods_Blogspot_AutoNCR", "mods_NoAutoplay"];
    GM_setValue(names[id], val);
}
/**
 * Whether debug strings should be logged.
 * The default value is true.
 * @const {bool}
 */
a.config.debugMode = true;
/**
 * Whether generic protectors should run.
 * This settings is currently not exposed to the user.
 * This settings can be overwritten by a rule.
 * @var {bool}
 */
a.config.allowGeneric = true;
/**
 * Whether experimental features should run.
 * If it is a rule, the user will be asked before it runs.
 * The default value is true.
 * @const {bool}
 */
a.config.allowExperimental = true;
/**
 * Whether current domain is "excluded".
 * How this will be treated depends on the rules.
 * Generic protectors will not run if this is true.
 * Will be assigned in a.init()
 * @const {bool}
 */
a.config.domExcluded = null;

//=====Shortcuts and jQuery=====
/**
 * The unsafeWindow.
 * @const {Object}
 */
a.win = unsafeWindow;
/**
 * The document of unsafeWindow.
 * @const {Object}
 */
a.doc = a.win.document;
/**
 * The console of unsafeWindow.
 * @const {Object}
 */
a.out = a.win.console;
/**
 * The domain of current document.
 * @const {string}
 */
a.dom = a.doc.domain;
/**
 * The addEventListener of unsafeWindow.
 * We must wrap it like this or it will throw errors.
 * @const {Function}
 */
a.on = function (event, func) {
    a.win.addEventListener(event, func);
};
/**
 * jQuery with Color plug-in, will be available after a.init() is called.
 * @const {Object}
 */
a.$ = null;

//=====Constants=====
a.c = {};
/**
 * The generic error message.
 * @const {string}
 */
a.c.errMsg = "Uncaught AdBlock Error: AdBlocker detectors are not allowed on this device! ";
/**
 * The settings page of this project.
 * @const {string}
 */
a.c.settingsPage = "https://x01x012013.github.io/AdBlockProtector/settings.html";
/**
 * The home page of this project.
 * @const {string}
 */
a.c.homePage = "https://x01x012013.github.io/AdBlockProtector/";
/**
 * The support (issues) page of this project.
 * @const {string}
 */
a.c.supportPage = "https://github.com/X01X012013/AdBlockProtector/issues";
/**
 * A string that will crash any JavaScript by syntax error when added to anywhere of its code.
 * @const {string}
 */
a.c.syntaxBreaker = "])}\"'`])} \n\r \r\n */ ])}";
/**
 * Whether this script is running on the top frame.
 * @const {boolean}
 */
a.c.topFrame = (function () {
    try {
        return a.win.self === a.win.top;
    } catch (err) {
        //a.win.top was not accessible due to security policies (means we are not top frame)
        return false;
    }
})();

//=====Mods=====
/**
 * Apply all mods.
 * @function
 */
a.mods = function () {
    //===Facebook mods===
    if (a.domCmp(["facebook.com"], true)) {
        //Add Jump To Top button
        const addJumpToTop = function () {
            //Stop if the button already exist, this shouldn't be needed, but just to be sure
            if (a.$("#AdBlock_Protector_FBMod_JumpToTop").length > 0) {
                return;
            }
            //Check if the nav bar is there
            const navBar = a.$("div[role='navigation']");
            if (navBar.length > 0) {
                //Present, insert button
                navBar.append(`<div class="_4kny _2s24" id="AdBlock_Protector_FBMod_JumpToTop"><div class="_4q39"><a class="_2s25" href="javascript: void(0);">Top</a></div></div>`);
                a.$("#AdBlock_Protector_FBMod_JumpToTop").click(function () {
                    a.win.scrollTo(a.win.scrollX, 0);
                });
            } else {
                //Wait a little bit for the window to load, for some reason load event isn't working
                a.win.setTimeout(addJumpToTop, 1000);
            }
        };
        //Hide People You May Know
        const hidePeopleYouMayKnow = function () {
            a.observe("insert", function (node) {
                if (node.querySelector && node.querySelector("a[href^='/friends/requests/']")) {
                    node.remove();
                }
            });
        };
        //Check configurations
        if (a.mods.Facebook_JumpToTop) {
            addJumpToTop();
        }
        if (a.mods.Facebook_HidePeopleYouMayKnow) {
            hidePeopleYouMayKnow();
        }
    }
    //===Blogspot mods===
    if (a.c.topFrame && a.mods.Blogspot_AutoNCR && a.domInc(["blogspot"], true) && !a.domCmp(["blogspot.com"], true)) {
        //Auto NCR (No Country Redirect)
        const name = a.dom.replace("www.", "").split(".")[0];
        const path = a.win.location.href.split("/").slice(3).join("/");
        a.win.location.href = "http://" + name + ".blogspot.com/ncr/" + path;
    }
    //===No autoplay mods===
    if (a.mods.NoAutoplay) {
        if (a.domCmp(["x-link.pl"], true)) {
            //Watch video tag insertion
            a.observe("insert", function (node) {
                if (node.tagName === "VIDEO") {
                    node.onplay = (function () {
                        //We need to pause twice
                        let playCount = 2;
                        return function () {
                            playCount--;
                            this.pause();
                            if (playCount === 0) {
                                //Paused twice, detach event handler
                                this.onplay = null;
                            }
                        };
                    })();
                }
            });
        }
        if (a.domCmp(["komputerswiat.pl"], true)) {
            let token = a.win.setInterval(function () {
                if (a.$("video").length > 0) {
                    //Get element
                    const player = a.$("video").first();
                    //Block play
                    player[0].onplay = function () {
                        this.pause();
                    };
                    //Replace player
                    player.parents().eq(5).after(a.nativePlayer(player.attr("src"))).remove();
                    a.win.clearInterval(token);
                }
            }, 1000);
        }
    }
};
/**
 * Whether a Jump To Top button should be added to Facebook.
 * The default value is true.
 * @const {bool}
 */
a.mods.Facebook_JumpToTop = true;
/**
 * Whether People You May Know should be hidden from Facebook.
 * The default value is true.
 * @const {bool}
 */
a.mods.Facebook_HidePeopleYouMayKnow = true;
/**
 * Whether blogspot blogs should be automatically redirected to NCR (No Country Redirect) version.
 * The default value is true.
 * Does not work if the blog is not top frame.
 * @const {bool}
 */
a.mods.Blogspot_AutoNCR = true;
/**
 * Whether autoplay should be disabled on supported websites.
 * The default value is true.
 * @const {bool}
 */
a.mods.NoAutoplay = true;

//=====Common Functions=====
/**
 * Write generic error message to console.
 * @function
 */
a.err = function () {
    a.out.error(a.c.errMsg);
};
/**
 * Check if current domain ends with one of the domains in the list.
 * Example: "google.com" will match "google.com" and domains ending with ".google.com"
 * @function
 * @param {Array.<string>} domList - The list of domains to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @returns {boolean} True if current domain is in the list, false otherwise.
 */
a.domCmp = function (domList, noErr) {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom === domList[i] || a.dom.endsWith("." + domList[i])) {
            if (!noErr) {
                //Show error message when matched
                a.err();
            }
            return true;
        }
    }
    return false;
};
/**
 * Check if current domain includes one of the strings that is in the list.
 * Example: "google" will match domains starting with "google." and domains that include ".google."
 * @function
 * @param {Array.<string>} domList - The list of strings to compare.
 * @param {boolean} [noErr=false] - Set to true to prevent showing error message.
 * @returns {boolean} True if current domain is in the list, false otherwise.
 */
a.domInc = function (domList, noErr) {
    //Loop though each element
    for (let i = 0; i < domList.length; i++) {
        //Check if current domain is exactly listed or ends with it
        if (a.dom.startsWith(domList[i] + ".") || a.dom.includes("." + domList[i] + ".")) {
            if (!noErr) {
                //Show error message when matched
                a.err();
            }
            return true;
        }
    }
    return false;
};
/**
 * Replace Function.prototype.toString() in order to prevent protected functions from being detected.
 * This function should be called from rules once if needed.
 * @function
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.protectFunc = function () {
    //Update flag
    a.protectFunc.enabled = true;
    //The original function
    const original = a.win.Function.prototype.toString;
    //New function
    const newFunc = function () {
        //Check if function "this" is in the protected list
        const index = a.protectFunc.pointers.indexOf(this);
        if (index === -1) {
            //Not protected, use original function to proceed
            return original.apply(this);
        } else {
            //Protected, return the mask string
            return a.protectFunc.masks[index];
        }
    };
    //Try to replace toString()
    try {
        a.win.Function.prototype.toString = newFunc;
        //Protect this function as well
        a.protectFunc.pointers.push(newFunc);
        a.protectFunc.masks.push(original.toString());
        //Log when activated
        a.out.warn("Functions protected. ");
    } catch (err) {
        //Failed to protect
        a.out.error("AdBlock Protector failed to protect functions! ");
        return false;
    }
    return true;
};
/**
 * Whether protect functions is enabled.
 * @var {bool}
 */
a.protectFunc.enabled = false;
/**
 * Pointers to protected functions.
 * @var {Array.<Function>}
 */
a.protectFunc.pointers = [];
/**
 * Mask of protected functions.
 * @var {Array.<string>}
 */
a.protectFunc.masks = [];
/**
 * Adds a filter to another function so arguments with forbidden keywords are not allowed.
 * Use RegExp to combine filters, do not activate filter multiple times on the same function.
 * @function
 * @param {string} func - The name of the function to filter, use "." to separate multiple layers, max 2 layers.
 * @param {RegExp} [filter=/[\S\s]/] - Filter to apply, block everything if this argument is missing.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.filter = function (func, filter) {
    //Check parameters
    filter = filter || /[\S\s]/;
    //The original function, will be set later
    let original;
    //The function names array, will be set later if there is more than one layer
    let fNames;
    //The function with filters
    const newFunc = function () {
        //Debug - Log when called
        if (a.config.debugMode) {
            a.out.warn(func + " is called with these arguments: ");
            for (let i = 0; i < arguments.length; i++) {
                a.out.warn(arguments[i].toString());
            }
        }
        //Apply filter
        for (let i = 0; i < arguments.length; i++) {
            if (filter.test(arguments[i].toString())) {
                //Not allowed
                a.err();
                return;
            }
        }
        //Debug - Log when passed
        if (a.config.debugMode) {
            a.out.info("Tests passed. ");
        }
        //Allowed
        if (typeof fNames === "object") {
            //Two layers
            return original.apply(a.win[fNames[0]], arguments);
        } else {
            //One layer
            return original.apply(a.win, arguments);
        }
    };
    //Try to replace the function
    try {
        if (func.includes(".")) {
            //Two layers
            fNames = func.split(".");
            original = a.win[fNames[0]][fNames[1]];
            a.win[fNames[0]][fNames[1]] = newFunc;
        } else {
            //One layer
            original = a.win[func];
            a.win[func] = newFunc;
        }
        //Add this filter to protection list
        if (a.protectFunc.enabled) {
            a.protectFunc.pointers.push(newFunc);
            a.protectFunc.masks.push(original.toString());
        }
        //Log when activated
        a.out.warn("Filter activated on " + func);
    } catch (err) {
        //Failed to activate
        a.out.error("AdBlock Protector failed to activate filter on " + func + "! ");
        return false;
    }
    return true;
};
/**
 * Patch the HTML, this must be ran on document-start.
 * Warning: This breaks uBlock Origin element picker.
 * @function
 * @param {Function} patcher - A function that patches the HTML, it must return the patched HTML.
 */
a.patchHTML = function (patcher) {
    //Stop loading
    a.win.stop();
    //Get content
    GM_xmlhttpRequest({
        method: "GET",
        url: a.doc.location.href,
        synchronous: true,
        headers: {
            "Referer": a.doc.referrer
        },
        onload: function (result) {
            //Apply patched content
            a.doc.write(patcher(result.responseText));
        }
    });
};
/**
 * Replace a sample of code by syntax breaker.
 * Warning: This breaks uBlock Origin element picker.
 * This is the easiest way to break "stand alone" in-line JavaScript.
 * Can only crash one in-line block.
 * @function
 * @param {string} sample - A sample of code.
 */
a.crashScript = function (sample) {
    a.patchHTML(function (html) {
        return html.replace(sample, a.c.syntaxBreaker);
    });
};
/**
 * Defines a read-only property to unsafeWindow.
 * @function
 * @param {string} name - The name of the property to define, use "." to separate multiple layers, max 2 layers.
 * @param {*} val - The value to set.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.readOnly = function (name, val) {
    try {
        if (name.includes(".")) {
            //Two layers
            let nameArray = name.split(".");
            a.win.Object.defineProperty(a.win[nameArray[0]], nameArray[1], {
                configurable: false,
                set: function () { },
                get: function () {
                    return val;
                }
            });
        } else {
            //One layer
            a.win.Object.defineProperty(a.win, name, {
                configurable: false,
                set: function () { },
                get: function () {
                    return val;
                }
            });
        }
    } catch (err) {
        //Failed to define property
        a.out.error("AdBlock Protector failed to define read-only property " + name + "! ");
        return false;
    }
    return true;
};
/**
 * Defines a property to unsafeWindow that (tries to) crash scripts who access it.
 * @function
 * @param {string} name - The name of the property to define, use "." to separate multiple layers, max 2 layers.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.noAccess = function (name) {
    try {
        if (name.includes(".")) {
            //Two layers
            let nameArray = name.split(".");
            a.win.Object.defineProperty(a.win[nameArray[0]], nameArray[1], {
                configurable: false,
                set: function () {
                    throw a.c.errMsg;
                },
                get: function () {
                    throw a.c.errMsg;
                }
            });
        } else {
            //One layer
            a.win.Object.defineProperty(a.win, name, {
                configurable: false,
                set: function () {
                    throw a.c.errMsg;
                },
                get: function () {
                    throw a.c.errMsg;
                }
            });
        }
    } catch (err) {
        //Failed to define property
        a.out.error("AdBlock Protector failed to define non-accessible property " + name + "! ");
        return false;
    }
    return true;
};
/**
 * Inject CSS into HTML.
 * @function
 * @param {string} str - The CSS to inject, !important will be added automatically.
 */
a.css = function (str) {
    //Add !important
    let temp = str.split(";");
    for (let i = 0; i < temp.length - 1; i++) {
        if (!temp[i].endsWith("!important")) {
            temp[i] += " !important";
        }
    }
    //Inject CSS
    GM_addStyle(temp.join(";"));
};
/**
 * Add a bait element.
 * @function
 * @param {string} type - The type of the element, example: div.
 * @param {string} identifier - The class or id, example: .test (class) #test (id).
 */
a.bait = function (type, identifier) {
    //Create element
    let elem = a.$("<" + type + ">");
    //Add identifier
    if (identifier.startsWith("#")) {
        elem.attr("id", identifier.substr(1));
    } else if (identifier.startsWith(".")) {
        elem.addClass(identifier.substr(1));
    }
    //Add content and append to HTML
    elem.html("<br>").appendTo("html");
};
/**
 * Set or get a cookie.
 * @function
 * @param {string} key - The key of the cookie.
 * @param {string} [val=undefined] - The value to set, omit this to get the cookie.
 * @param {string} [time=31536000000] - In how many milliseconds will it expire, defaults to 1 year.
 * @param {string} [path=/] - The path to set.
 * @returns {string} The value of the cookie, null will be returned if the cookie doesn't exist, and undefined will be returned in set mode.
 */
a.cookie = function (key, val, time, path) {
    if (val === "undefined") {
        //Get mode
        //http://stackoverflow.com/questions/10730362/get-cookie-by-name
        const value = "; " + a.doc.cookie;
        let parts = value.split("; " + key + "=");
        if (parts.length == 2) {
            return parts.pop().split(";").shift();
        } else {
            return null;
        }
    } else {
        //Set mode
        let expire = new a.win.Date();
        expire.setTime((new a.win.Date()).getTime() + (time || 31536000000));
        a.doc.cookie = key + "=" + a.win.encodeURIComponent(val) + ";expires=" + expire.toGMTString() + ";path=" + (path || "/");
    }
};
/**
 * Serialize an object.
 * http://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-parameters
 * @function
 * @param {Object} obj - The object to serialize.
 * @returns {string} The serialized string.
 */
a.serialize = function (obj) {
    var str = "";
    for (var key in obj) {
        if (str !== "") {
            str += "&";
        }
        str += key + "=" + a.win.encodeURIComponent(obj[key]);
    }
    return str;
};
/**
 * Generate a native HTML5 player with controls but not autoplay.
 * @function
 * @param {string} source - The source of the video.
 * @param {string} [typeIn=Auto Detect] - The type of the video, will be automatically detected if not supplied, and defaults to MP4 if detection failed.
 * @param {string} [widthIn="100%"] - The width of the player.
 * @param {string} [heightIn="auto"] - The height of the player.
 * @returns {string} An HTML string of the video player.
 */
a.nativePlayer = function (source, typeIn, widthIn, heightIn) {
    //Detect type
    let type;
    if (typeIn) {
        type = typeIn;
    } else {
        const temp = source.split(".");
        switch (temp[temp.length - 1]) {
            case "webm":
                type = "video/webm";
                break;
            case "mp4":
                type = "video/mp4";
                break;
            case "ogg":
                type = "video/ogg";
                break;
            default:
                //Defaults to MP4
                type = "video/mp4";
                break;
        }
    }
    //Assign width and height
    const width = widthIn || "100%";
    const height = heightIn || "auto";
    //Construct HTML string
    return `<video width='${width}' height='${height}' controls><source src='${source}' type='${type}'></video>`;
};
/**
 * Generate a videoJS 5.4.6 player with controls but not autoplay.
 * Don't forget to call a.videoJS.init()
 * Parameters sources and types must be parallel arrays. Unlike native player, all parameters must be supplied.
 * @function
 * @param {Array.<string>} sources - The sources of the video.
 * @param {Array.<string>} types - The types of the video.
 * @param {string} width - The width of the player.
 * @param {string} height - The height of the player.
 * @returns {string} An HTML string of the video player.
 */
a.videoJS = function (sources, types, width, height) {
    //Build HTML string
    let html = `<video id="AdBlock_Protector_Video_Player" class="video-js vjs-default-skin" controls preload="auto" width="${width}" height="${height}" data-setup="{}">`;
    for (let i = 0; i < sources.length; i++) {
        html += `<source src="${sources[i]}" type="${types[i]}">`;
    }
    html += `</video>`;
    return html;
};
/**
 * Initialize videoJS 5.4.6.
 * Do not call this function multiple times.
 * @function
 */
a.videoJS.init = function () {
    //Disable telemetry
    try {
        a.win.HELP_IMPROVE_VIDEOJS = false;
    } catch (err) { }
    //Load components
    a.$("head").append(`<link href="//vjs.zencdn.net/5.4.6/video-js.min.css" rel="stylesheet"><script src="//vjs.zencdn.net/5.4.6/video.min.js"></script>`);
};
/**
 * Run function that is passed in on document-start, document-idle, and document-end.
 * @function
 * @param {Function} func - The function to run.
 */
a.always = function (func) {
    func();
    a.on("DOMContentLoaded", func);
    a.on("load", func);
};
/**
 * Returns a unique ID that is also a valid variable name.
 * @function
 * @returns {string} Unique ID.
 */
a.uid = function () {
    const chars = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let str = "";
    for (let i = 0; i < 10; ++i) {
        str += chars.charAt(a.win.Math.floor(a.win.Math.random() * chars.length));
    }
    a.uid.counter++;
    return str + a.uid.counter.toString();
};
/**
 * Unique ID counter, will be appended to randomly generated string to ensure uniqueness.
 * @var {integer}
 */
a.uid.counter = 0;
/**
 * Observe mutations to document.
 * @function
 * @param {string} type - The type of mutation to observe. Currently only "insert" is accepted, this argument is for future expansion.
 * @param {Function} callback - The callback function, relevant data will be passed in.
 */
a.observe = function (type, callback) {
    //Initialize observer
    if (!a.observe.init.done) {
        a.observe.init.done = true;
        a.observe.init();
    }
    //Add to callback array
    if (type === "insert") {
        a.observe.insertCallbacks.push(callback);
    }
    //More types will be added when needed
};
/**
 * Initialize MutationObserver.
 * This should only be called once by a.observe()
 * @function
 */
a.observe.init = function () {
    //Set up observer
    const observer = new a.win.MutationObserver(function (mutations) {
        for (let i = 0; i < mutations.length; i++) {
            //Insert
            if (mutations[i].addedNodes.length) {
                for (let ii = 0; ii < a.observe.insertCallbacks.length; ii++) {
                    for (let iii = 0; iii < mutations[i].addedNodes.length; iii++) {
                        a.observe.insertCallbacks[ii](mutations[i].addedNodes[iii]);
                    }
                }
            }
            //More types will be added when needed
        }
    });
    observer.observe(a.doc, {
        childList: true,
        subtree: true
    });
};
/**
 * Whether initialization is done.
 * @var {bool}
 */
a.observe.init.done = false;
/**
 * The callback function of insert mutations.
 * @var {Array.<Function>}
 */
a.observe.insertCallbacks = [];

//=====Generic Protectors=====
/**
 * Activate all generic protectors.
 * @function
 */
a.generic = function () {
    //Based on generic killers of Anti-Adblock Killer
    if (a.config.allowGeneric && !a.config.domExcluded) {
        const data = {};
        //===document-start===
        //FuckAdBlock
        a.generic.FuckAdBlock("FuckAdBlock", "fuckAdBlock");
        a.generic.FuckAdBlock("BlockAdBlock", "blockAdBlock");
        //ads.js
        a.readOnly("canRunAds", true);
        a.readOnly("canShowAds", true);
        a.readOnly("isAdBlockActive", false);
        //Playwire
        let playwireZeus;
        a.win.Object.defineProperty(a.win, "Zeus", {
            configurable: false,
            set: function (val) {
                playwireZeus = val;
            },
            get: function () {
                try {
                    playwireZeus.AdBlockTester = {
                        check: function (a) { a(); }
                    };
                } catch (err) { }
                return playwireZeus;
            }
        });
        //===document-idle===
        a.on("DOMContentLoaded", function () {
            //AdBlock Detector (XenForo Rellect)
            if (a.win.XenForo && typeof a.win.XenForo.rellect === "object") {
                a.win.XenForo.rellect = {
                    AdBlockDetector: {
                        start: function () { }
                    }
                };
            }
            //Adbuddy
            if (typeof a.win.closeAdbuddy === "function") {
                a.win.closeAdbuddy();
            }
            //AdBlock Alerter (WP)
            if (a.$("div.adb_overlay > div.adb_modal_img").length > 0) {
                //Remove alert and allow scrolling
                a.$("div.adb_overlay").remove();
                a.css("html,body {height:auto; overflow: auto;}");
            }
            //Block screen
            if (a.$("#blockdiv").html() === "disable ad blocking or use another browser without any adblocker when you visit") {
                a.$("#blockdiv").remove();
            }
            //Antiblock.org v2
            const styles = document.querySelectorAll("style");
            for (let i = 0; i < styles.length; i++) {
                const style = styles[i];
                const cssRules = style.sheet.cssRules;
                for (var j = 0; j < cssRules.length; j++) {
                    const cssRule = cssRules[j];
                    const cssText = cssRule.cssText;
                    const pattern = /^#([a-z0-9]{4,10}) ~ \* \{ display: none; \}/;
                    if (pattern.test(cssText)) {
                        const id = pattern.exec(cssText)[1];
                        if (a.$("script:contains(w.addEventListener('load'," + id + ",false))")) {
                            data.abo2 = id;
                            break;
                        }
                    }
                }
            }
            //BetterStopAdblock, Antiblock.org v3, and BlockAdBlock
            for (let prop in a.win) {
                try {
                    if (!prop.startsWith("webkit") && /^[a-z0-9]{4,12}$/i.test(prop) && prop !== "document" && (a.win[prop] instanceof a.win.HTMLDocument) === false && a.win.hasOwnProperty(prop) && typeof a.win[prop] === "object") {
                        const method = a.win[prop];
                        //BetterStopAdblock and Antiblock.org v3
                        if (method.deferExecution &&
                            method.displayMessage &&
                            method.getElementBy &&
                            method.getStyle &&
                            method.insert &&
                            method.nextFunction) {
                            if (method.toggle) {
                                data.bsa = prop;
                            } else {
                                data.abo3 = prop;
                            }
                            a.win[prop] = null;
                        }
                        //BlockAdBlock
                        if (method.bab) {
                            a.win[prop] = null;
                        } else if (a.win.Object.keys(method).length === 3 && a.win.Object.keys(method).join().length === 32) {
                            a.win[prop] = null;
                        }
                    }
                } catch (err) { }
            }
        });
        //===on-insert===
        const onInsertHandler = function (insertedNode) {
            //No-Adblock
            if (insertedNode.nodeName === "DIV" &&
                insertedNode.id &&
                insertedNode.id.length === 4 &&
                /^[a-z0-9]{4}$/.test(insertedNode.id) &&
                insertedNode.firstChild &&
                insertedNode.firstChild.id &&
                insertedNode.firstChild.id === insertedNode.id &&
                insertedNode.innerHTML.includes("no-adblock.com")) {
                //Remove
                insertedNode.remove();
            }
            //StopAdblock
            if (insertedNode.nodeName === "DIV" &&
                insertedNode.id &&
                insertedNode.id.length === 7 &&
                /^a[a-z0-9]{6}$/.test(insertedNode.id) &&
                insertedNode.parentNode &&
                insertedNode.parentNode.id &&
                insertedNode.parentNode.id === insertedNode.id + "2" &&
                insertedNode.innerHTML.includes("stopadblock.org")) {
                //Remove
                insertedNode.remove();
            }
            //AntiAdblock (Packer)
            const reIframeId = /^(zd|wd)$/;
            const reImgId = /^(xd|gd)$/;
            const reImgSrc = /\/ads\/banner.jpg/;
            const reIframeSrc = /(\/adhandler\/|\/adimages\/|ad.html)/;
            if (insertedNode.id &&
                reImgId.test(insertedNode.id) &&
                insertedNode.nodeName === "IMG" &&
                reImgSrc.test(insertedNode.src) ||
                insertedNode.id &&
                reIframeId.test(insertedNode.id) &&
                insertedNode.nodeName === "IFRAME" &&
                reIframeSrc.test(insertedNode.src)) {
                //Remove
                insertedNode.remove();
            }
            //Adunblock
            const reId = /^[a-z]{8}$/;
            const reClass = /^[a-z]{8} [a-z]{8}/;
            const reBg = /^[a-z]{8}-bg$/;
            if (typeof a.win.vtfab !== "undefined" &&
                typeof a.win.adblock_antib !== "undefined" &&
                insertedNode.parentNode &&
                insertedNode.parentNode.nodeName === "BODY" &&
                insertedNode.id &&
                reId.test(insertedNode.id) &&
                insertedNode.nodeName === "DIV" &&
                insertedNode.nextSibling &&
                insertedNode.nextSibling.className &&
                insertedNode.nextSibling.nodeName === "DIV") {
                if (insertedNode.className &&
                    reClass.test(insertedNode.className) &&
                    reBg.test(insertedNode.nextSibling.className) &&
                    insertedNode.nextSibling.style &&
                    insertedNode.nextSibling.style.display !== "none") {
                    //Full Screen Message (Premium)
                    insertedNode.nextSibling.remove();
                    insertedNode.remove();
                } else if (insertedNode.nextSibling.id &&
                           reId.test(insertedNode.nextSibling.id) &&
                           insertedNode.innerHTML.includes("Il semblerait que vous utilisiez un bloqueur de publicité !")) {
                    //Top bar Message (Free)
                    insertedNode.remove();
                }
            }
            //Antiblock
            const reMsgId = /^[a-z0-9]{4,10}$/i;
            const reTag1 = /^(div|span|b|i|font|strong|center)$/i;
            const reTag2 = /^(a|b|i|s|u|q|p|strong|center)$/i;
            const reWords1 = /ad blocker|ad block|ad-block|adblocker|ad-blocker|adblock|bloqueur|bloqueador|Werbeblocker|adblockert|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
            const reWords2 = /kapat|disable|désactivez|désactiver|desactivez|desactiver|desative|desactivar|desactive|desactiva|deaktiviere|disabilitare|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;
            //Antiblock.org (all version)
            if (insertedNode.parentNode &&
                insertedNode.id &&
                insertedNode.style &&
                insertedNode.childNodes.length &&
                insertedNode.firstChild &&
                !insertedNode.firstChild.id &&
                !insertedNode.firstChild.className &&
                reMsgId.test(insertedNode.id) &&
                reTag1.test(insertedNode.nodeName) &&
                reTag2.test(insertedNode.firstChild.nodeName)) {
                //Stop audio message
                const audio = insertedNode.querySelector("audio[loop]");
                if (audio) {
                    audio.pause();
                    audio.remove();
                } else if ((data.abo2 && insertedNode.id === data.abo2) ||
                           (insertedNode.firstChild.hasChildNodes() && reWords1.test(insertedNode.firstChild.innerHTML) && reWords2.test(insertedNode.firstChild.innerHTML))) {
                    //Antiblock.org v2
                    insertedNode.remove();
                } else if ((data.abo3 && insertedNode.id === data.abo3) ||
                           (insertedNode.firstChild.hasChildNodes() && insertedNode.firstChild.firstChild.nodeName === "IMG" && insertedNode.firstChild.firstChild.src.startsWith("data:image/png;base64"))) {
                    //Antiblock.org v3
                    a.win[data.abo3] = null;
                    insertedNode.remove();
                } else if (data.bsa && insertedNode.id === data.bsa) {
                    //BetterStopAdblock
                    a.win[data.bsa] = null;
                    insertedNode.remove();
                }
            }
        };
        //===Set up observer===
        a.observe("insert", onInsertHandler);
    } else {
        //Generic protectors disabled
        a.out.warn("Generic protectors are disabled on this domain. ");
    }
};
/**
 * Create a FuckAdBlock constructor and instance which always returns not detected.
 * @function
 * @param {string} constructorName - The name of the constructor.
 * @param {string} instanceName - The name of the instance.
 * @returns {boolean} True if the operation was successful, false otherwise.
 */
a.generic.FuckAdBlock = function (constructorName, instanceName) {
    const patchedFuckAdBlock = function () {
        //Based on FuckAdBlock by sitexw
        //https://github.com/sitexw/FuckAdBlock
        //===Init===
        //On not detected callbacks
        this._callbacks = [];
        //Add on load event
        a.on("load", (function () {
            this.emitEvent();
        }).bind(this));
        //===v3 Methods===
        //Set options, do nothing
        this.setOption = function () {
            return this;
        };
        //Check, call on not detected callbacks
        this.check = function () {
            this.emitEvent();
            return true;
        };
        //Call on not detected callbacks
        this.emitEvent = function () {
            for (let i = 0; i < this._callbacks.length; i++) {
                this._callbacks[i]();
            }
            return this;
        };
        //Clear events, empty callback array
        this.clearEvent = function () {
            this._callbacks = [];
        };
        //Add event handler
        this.on = function (detected, func) {
            if (!detected) {
                this._callbacks.push(func);
            }
            return this;
        };
        //Add on detected handler, do nothing
        this.onDetected = function () {
            return this;
        };
        //Add on not detected handler
        this.onNotDetected = function (func) {
            return this.on(false, func);
        };
        //===v4 Methods===
        this.debug = {};
        //Set debug state, do nothing
        this.debug.set = (function () {
            return this;
        }).bind(this);
    };
    //Define FuckAdBlock to unsafeWindow and create its instance, error checks are done in a.readOnly()
    return a.readOnly(constructorName, patchedFuckAdBlock) && a.readOnly(instanceName, new a.win[constructorName]());
};
