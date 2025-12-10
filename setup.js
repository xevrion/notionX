// Load existing config if available
document.addEventListener('DOMContentLoaded', async () => {
    const data = await chrome.storage.local.get(['notionToken', 'databaseId']);
    
    if (data.notionToken) {
      document.getElementById('notionToken').value = data.notionToken;
    }
    
    if (data.databaseId) {
      document.getElementById('databaseId').value = data.databaseId;
    }
  });
  
  // Handle form submission
  document.getElementById('setupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const saveBtn = document.getElementById('saveBtn');
    const statusEl = document.getElementById('status');
    const notionToken = document.getElementById('notionToken').value.trim();
    const databaseId = document.getElementById('databaseId').value.trim();
    
    // Validate token format (both old and new formats)
    if (!notionToken.startsWith('secret_') && !notionToken.startsWith('ntn_')) {
      showStatus('error', '❌ Invalid token format. Must start with "ntn_" or "secret_"');
      return;
    }
    
    // Validate database ID
    if (databaseId.length < 32) {
      showStatus('error', '❌ Database ID too short. Check your database URL.');
      return;
    }
    
    // Disable button
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Connecting to Notion...';
    
    try {
      // Test connection
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid integration token. Double-check it from Notion.');
        } else if (response.status === 404) {
          throw new Error('Database not found. Make sure you shared it with your integration!');
        } else {
          throw new Error(`Connection failed (${response.status}). Try again?`);
        }
      }
      
      // Save credentials
      await chrome.storage.local.set({
        notionToken,
        databaseId
      });
      
      // Success!
      saveBtn.textContent = '✅ Connected Successfully!';
      showStatus('success', `
        <div class="success-icon">🎉</div>
        <strong>All set!</strong><br>
        Go to X/Twitter, open any tweet, and look for the save button!<br>
        <small style="opacity: 0.7; margin-top: 8px; display: block;">You can close this tab now</small>
      `);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
      
    } catch (error) {
      showStatus('error', `❌ ${error.message}`);
      saveBtn.disabled = false;
      saveBtn.textContent = '🔄 Try Again';
    }
  });
  
  function showStatus(type, message) {
    const statusEl = document.getElementById('status');
    statusEl.className = `status ${type}`;
    statusEl.innerHTML = message;
  }