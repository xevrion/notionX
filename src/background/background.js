// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveTweet') {
      saveTweetToNotion(request.data)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({ success: false, error: error.message }));
      
      return true; // Keep message channel open for async response
    }
  });
  
  async function saveTweetToNotion(tweetData) {
    try {
      // Get stored credentials
      const { notionToken, databaseId } = await chrome.storage.local.get([
        'notionToken',
        'databaseId'
      ]);
      
      if (!notionToken || !databaseId) {
        throw new Error('Notion not configured. Open extension popup to set up.');
      }
      
      // Prepare Notion API payload
      const payload = {
        parent: {
          database_id: databaseId
        },
        properties: {
          // Use Title (capital T) to match the default Notion title property
          Title: {
            title: [
              {
                text: {
                  content: tweetData.title
                }
              }
            ]
          },
          URL: {
            url: tweetData.url
          },
          Author: {
            rich_text: [
              {
                text: {
                  content: tweetData.author
                }
              }
            ]
          }
        }
      };
      
      // Add media if available
      if (tweetData.media) {
        payload.properties.Media = {
          url: tweetData.media
        };
      }
      
      // Send to Notion
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 401) {
          throw new Error('Invalid token. Reconfigure in popup.');
        } else if (response.status === 404) {
          throw new Error('Database not found. Check your database ID.');
        } else if (response.status === 400) {
          // Check if it's a property mismatch error
          const errorMessage = errorData.message || '';
          if (errorMessage.includes('property') || errorMessage.includes('schema')) {
            throw new Error('Database schema mismatch. Ensure properties: Title, URL, Author, Media exist.');
          }
          throw new Error(`API error: ${errorMessage}`);
        } else {
          throw new Error(`Failed to save: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      return {
        success: true,
        pageId: data.id
      };
      
    } catch (error) {
      console.error('Notion save error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Log extension initialization
  console.log('Notion Saver for X: Background service worker initialized');