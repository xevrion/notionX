// State management
let lastInjectedUrl = null;
let saveButtonExists = false;

// Initialize on page load
initializeExtension();

// Watch for SPA navigation on X/Twitter
const observer = new MutationObserver(() => {
  if (isTweetDetailPage() && !saveButtonExists) {
    injectSaveButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Listen for URL changes (X uses pushState)
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    saveButtonExists = false;
    
    if (isTweetDetailPage()) {
      setTimeout(() => injectSaveButton(), 500);
    }
  }
}).observe(document, { subtree: true, childList: true });

function initializeExtension() {
  if (isTweetDetailPage()) {
    setTimeout(() => injectSaveButton(), 1000);
  }
}

function isTweetDetailPage() {
  // Match URLs like: /username/status/1234567890
  const tweetUrlPattern = /\/(.*?)\/status\/(\d+)/;
  return tweetUrlPattern.test(window.location.pathname);
}

function injectSaveButton() {
  // Prevent duplicate injections
  if (saveButtonExists || document.getElementById('notion-save-btn')) {
    return;
  }
  
  const currentUrl = window.location.href;
  if (currentUrl === lastInjectedUrl) {
    return;
  }
  
  // Find the tweet action bar (like/retweet/share buttons)
  const actionBar = document.querySelector('article[data-testid="tweet"] div[role="group"]');
  
  if (!actionBar) {
    return; // Action bar not loaded yet
  }
  
  // Create the save button
  const saveButton = createSaveButton();
  
  // Insert before the last action (share button)
  const lastAction = actionBar.lastElementChild;
  if (lastAction) {
    actionBar.insertBefore(saveButton, lastAction);
    saveButtonExists = true;
    lastInjectedUrl = currentUrl;
  }
}

function createSaveButton() {
  const wrapper = document.createElement('div');
  wrapper.id = 'notion-save-btn';
  wrapper.className = 'notion-save-wrapper';
  
  const button = document.createElement('button');
  button.className = 'notion-save-button';
  button.setAttribute('aria-label', 'Save to Notion');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" class="notion-save-icon">
      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/>
    </svg>
  `;
  
  button.addEventListener('click', handleSaveClick);
  
  wrapper.appendChild(button);
  return wrapper;
}

async function handleSaveClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.currentTarget;
  
  // Prevent double-clicks
  if (button.classList.contains('saving')) {
    return;
  }
  
  button.classList.add('saving');
  
  try {
    const tweetData = extractTweetData();
    
    if (!tweetData) {
      showToast('error', 'Could not extract tweet data');
      button.classList.remove('saving');
      return;
    }
    
    // Send to background script
    const response = await chrome.runtime.sendMessage({
      action: 'saveTweet',
      data: tweetData
    });
    
    if (response.success) {
      showToast('success', 'Saved to Notion');
      button.classList.add('saved');
      setTimeout(() => button.classList.remove('saved'), 2000);
    } else {
      showToast('error', response.error || 'Failed to save');
    }
    
  } catch (error) {
    showToast('error', error.message || 'Save failed');
  } finally {
    button.classList.remove('saving');
  }
}

function extractTweetData() {
  try {
    const article = document.querySelector('article[data-testid="tweet"]');
    if (!article) return null;
    
    // Extract tweet text
    const tweetTextEl = article.querySelector('[data-testid="tweetText"]');
    const tweetText = tweetTextEl ? tweetTextEl.innerText : '';
    const title = tweetText.slice(0, 100) + (tweetText.length > 100 ? '...' : '');
    
    // Extract author
    const authorEl = article.querySelector('[data-testid="User-Name"] a[role="link"]');
    const author = authorEl ? authorEl.getAttribute('href').replace('/', '') : 'Unknown';
    
    // Extract media (first image)
    const imageEl = article.querySelector('img[alt="Image"]');
    const media = imageEl ? imageEl.src : null;
    
    // Current URL
    const url = window.location.href;
    
    return {
      title: title || 'Untitled Tweet',
      url,
      author,
      media
    };
    
  } catch (error) {
    console.error('Failed to extract tweet data:', error);
    return null;
  }
}

function showToast(type, message) {
  // Remove existing toast
  const existing = document.getElementById('notion-toast');
  if (existing) {
    existing.remove();
  }
  
  const toast = document.createElement('div');
  toast.id = 'notion-toast';
  toast.className = `notion-toast notion-toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}