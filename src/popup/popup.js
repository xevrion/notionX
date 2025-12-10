// Load existing configuration on popup open
document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get(['notionToken', 'databaseId']);
    
    if (data.notionToken) {
      document.getElementById('notionToken').value = data.notionToken;
    }
    
    if (data.databaseId) {
      document.getElementById('databaseId').value = data.databaseId;
    }
    
    updateConfigStatus(data.notionToken && data.databaseId);
  });
  
  // Open full-page setup
  document.getElementById('openSetup').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('setup.html') });
  });
  
  // Handle form submission
  document.getElementById('settingsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveBtn');
    const statusEl = document.getElementById('status');
    const notionToken = document.getElementById('notionToken').value.trim();
    const databaseId = document.getElementById('databaseId').value.trim();
    
    // Validate inputs
    if (!notionToken.startsWith('secret_') && !notionToken.startsWith('ntn_')) {
      showStatus('error', 'Invalid token format. Must start with "secret_" or "ntn_"');
      return;
    }
    
    if (databaseId.length < 32) {
      showStatus('error', 'Database ID seems too short. Check your database URL.');
      return;
    }
    
    // Disable button during save
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    try {
      // Test the connection by attempting to retrieve database info
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid integration token');
        } else if (response.status === 404) {
          throw new Error('Database not found or not shared with integration');
        } else {
          throw new Error('Failed to connect to Notion');
        }
      }
      
      // Save to storage
      await chrome.storage.local.set({
        notionToken,
        databaseId
      });
      
      showStatus('success', '✓ Configuration saved successfully!');
      updateConfigStatus(true);
      
      // Reset button
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Configuration';
      }, 1500);
      
    } catch (error) {
      showStatus('error', `Error: ${error.message}`);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Configuration';
    }
  });
  
  function showStatus(type, message) {
    const statusEl = document.getElementById('status');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    
    if (type === 'success') {
      setTimeout(() => {
        statusEl.classList.add('hidden');
      }, 3000);
    }
  }
  
  function updateConfigStatus(isConfigured) {
    const badge = document.getElementById('configStatus');
    if (isConfigured) {
      badge.textContent = 'Configured';
      badge.classList.add('configured');
    } else {
      badge.textContent = 'Not configured';
      badge.classList.remove('configured');
    }
  }