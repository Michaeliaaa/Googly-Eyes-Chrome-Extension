var ReadingLine = localStorage.getItem("ReadingLine") === "true";

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.query({currentWindow: true}, function (tabs) {
        for (var i in tabs) {
            chrome.tabs.sendMessage(tabs[i].id, {
                action: ReadingLine ? "ReadingLine-disable" : "ReadingLine-enable"
            });
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "ReadingLine-status") {
        sendResponse(ReadingLine);
    }

    if (request.message === "ReadingLine-enable") {
        ReadingLine = true;
        localStorage.setItem("ReadingLine", ReadingLine);
    }

    if (request.message === "ReadingLine-disable") {
        ReadingLine = false;
        localStorage.setItem("ReadingLine", ReadingLine);
    }

    if (request.message === "ReadingLine-ping") {
        injectedScript[sender.tab.id] = true;
    }
});

var injectedScript = {};

chrome.tabs.query({currentWindow: true}, function (tabs) {
    for (var i in tabs) {
        injectedScript[tabs[i].id] = null;
        chrome.tabs.sendMessage(tabs[i].id, {action: "ReadingLine-ping"});
    }

    setTimeout(function() {
        for (var tabId in injectedScript) {
            tabId = parseInt(tabId);
            if (!injectedScript[tabId]) {
                chrome.tabs.insertCSS(tabId, {
                    file: "reading-line.css"
                });
                chrome.tabs.executeScript(tabId, {
                    file: "reading-line.js"
                });
            }
        }
    }, 1000)
});

