// Initialize on page load
initializeExtension();

// Watch for SPA navigation and DOM changes on X/Twitter
const observer = new MutationObserver(() => {
  injectButtonsForTweets();
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
    injectButtonsForTweets();
  }
}).observe(document, { subtree: true, childList: true });

function initializeExtension() {
  setTimeout(() => injectButtonsForTweets(), 500);
}

function injectButtonsForTweets() {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');

  articles.forEach(article => {
    // Skip if already injected
    if (article.querySelector('.notion-save-wrapper')) {
      return;
    }

    const actionBar = article.querySelector('div[role="group"]');
    if (!actionBar) {
      return;
    }

    const saveButton = createSaveButton();
    const lastAction = actionBar.lastElementChild;
    if (lastAction) {
      actionBar.insertBefore(saveButton, lastAction);
    }
  });
}

function createSaveButton() {
  const wrapper = document.createElement('div');
  wrapper.className = 'notion-save-wrapper';
  
  const button = document.createElement('button');
  button.className = 'notion-save-button';
  button.setAttribute('aria-label', 'Save to Notion');
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('assets/Notion-logo.svg');
  icon.alt = 'Save to Notion';
  icon.className = 'notion-save-icon';

  button.appendChild(icon);
  
  button.addEventListener('click', handleSaveClick);
  
  wrapper.appendChild(button);
  return wrapper;
}

async function handleSaveClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.currentTarget;
  const article = button.closest('article[data-testid="tweet"]');
  
  // Prevent double-clicks
  if (button.classList.contains('saving')) {
    return;
  }
  
  button.classList.add('saving');
  
  try {
    const tweetData = extractTweetData(article);
    
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

function extractTweetData(article) {
  try {
    if (!article) return null;
    
    // Extract tweet text
    const tweetTextEl = article.querySelector('[data-testid="tweetText"]');
    const tweetText = tweetTextEl ? tweetTextEl.innerText : '';
    const title = tweetText.slice(0, 100) + (tweetText.length > 100 ? '...' : '');
    
    // Extract author
    const authorEl = article.querySelector('[data-testid="User-Name"] a[role="link"]');
    const author = authorEl ? authorEl.getAttribute('href').replace('/', '') : 'Unknown';
    
    // Extract media (first image)
    const imageEl = article.querySelector('div[data-testid="tweetPhoto"] img, img[alt="Image"]');
    const media = imageEl ? imageEl.src : null;
    
    // Find the canonical tweet URL
    const statusLink = article.querySelector('a[href*="/status/"][role="link"]');
    const url = statusLink ? new URL(statusLink.getAttribute('href'), window.location.origin).href : window.location.href;
    
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