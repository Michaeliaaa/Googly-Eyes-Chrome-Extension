let color = '#3aa757';
let size = 100;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.sync.set({ size });

  chrome.contextMenus.create({
    id: "readText",
    title: "Read selected text: %s", 
    contexts:[ "selection" ]
  });
});