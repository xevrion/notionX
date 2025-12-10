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
    const notionToken = document.getElementById('notionToken').value.trim();
    const databaseId = document.getElementById('databaseId').value.trim();
    
    // Clean UI state
    showStatus('', ''); 
    
    // Validate token format
    if (!notionToken.startsWith('secret_') && !notionToken.startsWith('ntn_')) {
      showStatus('error', 'Token must start with "ntn_" or "secret_"');
      return;
    }
    
    // Validate database ID
    if (databaseId.length < 32) {
      showStatus('error', 'Database ID looks too short.');
      return;
    }
    
    // Disable button
    saveBtn.disabled = true;
    saveBtn.textContent = 'Verifying...';
    
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
          throw new Error('Invalid token. Check integration settings.');
        } else if (response.status === 404) {
          throw new Error('Database not found. Did you share it with the integration?');
        } else {
          throw new Error(`Connection failed (${response.status}).`);
        }
      }
      
      // Save credentials
      await chrome.storage.local.set({
        notionToken,
        databaseId
      });
      
      // Success!
      saveBtn.textContent = 'Connected';
      showStatus('success', `
        <strong>System Operational</strong><br>
        <span style="opacity:0.6; font-size:12px">Configuration saved. Closing in 3s...</span>
      `);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);
      
    } catch (error) {
      showStatus('error', error.message);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Try Again';
    }
  });
  
  function showStatus(type, message) {
    const statusEl = document.getElementById('status');
    if (!type) {
      statusEl.style.display = 'none';
      return;
    }
    statusEl.className = `status ${type}`;
    statusEl.innerHTML = message;
    statusEl.style.display = 'block';
  }