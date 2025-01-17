let timeSpent = {};
let activeTab = null;
let timer = null;

// Track active tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (timer) clearInterval(timer);

  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    activeTab = new URL(tab.url).hostname;
    if (!timeSpent[activeTab]) timeSpent[activeTab] = 0;

    timer = setInterval(() => {
      timeSpent[activeTab]++;
      console.log(`Time spent on ${activeTab}: ${timeSpent[activeTab]} seconds`);
    }, 1000);
  }
});

// Save data when the popup requests it
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTimeSpent') {
    sendResponse(timeSpent);
  }
});
