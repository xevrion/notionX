// Popup now only links to full-page setup.
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('openSetup').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('setup.html') });
  });
});