chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": "View in EC lite",
         "contexts":["page","browser_action"],
         "id": "ViewInLightbox"
    });
});


function contextClicked(info, tab) {
  if (info.menuItemId == "ViewInLightbox" ) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"action": "startLightbox"});
        });
    } 
};


//Instruct Chrome to launch a particular function when context menu items are clicked.
chrome.contextMenus.onClicked.addListener(contextClicked);