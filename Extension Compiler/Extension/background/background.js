"use strict";

//=====Initialization=====
//Message listener
chrome.runtime.onMessage.addListener((...args) => {
    if (args.length === 3) {
        //Each message must have "cmd" field for the command
        switch (args[0]["cmd"]) {
            /**
             * Inject CSS to the caller tab.
             * @param {string} data - The CSS code to inject.
             */
            case "inject css":
                if (args[1].tab && args[1].tab.id !== chrome.tabs.TAB_ID_NONE) {
                    chrome.tabs.insertCSS(args[1].tab.id, {
                        code: args[0]["data"],
                        frameId: args[1].frameId || 0,
                    }, () => {
                        if (chrome.runtime.lastError) {
                            //Ignore, assume the tab is closed
                        }
                    });
                }
                //Ignore if not called from a proper tab
                break;
            /**
             * Do a cross origin XMLHttpRequest.
             * @param {Object} details - The details object, see a.request() of content-core
             ** for more information.
             * @return {string|null} The response text, or null if the request failed.
             */
            case "xhr":
                if (typeof args[0].details === "object") {
                    console.warn(`Sending cross origin request to ${args[0].details.url}`);
                    let req = new XMLHttpRequest();
                    //Event handler
                    req.onreadystatechange = () => {
                        if (req.readyState === 4) {
                            try {
                                args[2](req.responseText);
                            } catch (err) { }
                        }
                    };
                    //Create request
                    req.open(String(args[0].details.method), String(args[0].details.url));
                    //Set headers
                    if (typeof args[0].details.headers === "object") {
                        for (let key in args[0].details.headers) {
                            req.setRequestHeader(key, String(args[0].details.headers[key]));
                        }
                    }
                    //Send request
                    let payload = null;
                    if (args[0].payload) {
                        payload = String(args[0].payload);
                    }
                    req.send(payload);
                    return true; //The callback is done after this handler returns
                }
            /**
             * Forcefully close the sender tab.
             */
            case "remove tab":
                if (args[1].tab && args[1].tab.id !== chrome.tabs.TAB_ID_NONE) {
                    chrome.tabs.remove(args[1].tab.id, () => {
                        if (chrome.runtime.lastError) {
                            //Ignore, assume the tab is already closed
                        }
                    });
                }
                //Ignore if not called from a proper tab
                break;
            default:
                //Invalid command, ignore
                break;
        }
    }
    //No command, ignore
});
//Extension icon click handler, open options page
chrome.browserAction.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});
//Set badge
if (a.debugMode) {
    //Debug mode
    chrome.browserAction.setBadgeText({
        text: "DBG",
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#6996FF",
    });
} else if (chrome.runtime.id !== "ggolfgbegefeeoocgjbmkembbncoadlb") {
    //Unpacked extension but not in debug mode
    chrome.browserAction.setBadgeText({
        text: "DEV",
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: "#25BA42",
    });
} //No badge otherwise

//=====Debug=====
if (a.debugMode) {
    //Issue: https://github.com/jspenguin2017/uBlockProtector/issues/209
    chrome.webRequest.onHeadersReceived.addListener(
        (details) => {
            console.log(details);
            details.responseHeaders.push({
                name: "Content-Security-Policy",
                value: "worker-src *",
            });
            return { responseHeaders: details.responseHeaders };
        },
        {
            urls: [
                "https://*.vidlox.tv/*",
            ],
            types: [
                "main_frame",
            ],
        },
        [
            "blocking",
            "responseHeaders",
        ],
    );
}
