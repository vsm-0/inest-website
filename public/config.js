// Frontend API configuration
// Set the API base URL in one place for all pages.
// Default: when served over http(s), API_BASE will be derived from current origin by api.js.
// When opening pages via file:// without a dev server, set this to your backend URL.

// For production deployment on inest.space, use the production API URL
if (typeof window !== 'undefined' && window.location && window.location.hostname === 'inest.space') {
    window.API_BASE = 'https://inest.space/api';
} else {
    // For local development
    window.API_BASE = 'http://localhost:5000/api';
}

// Clear any cached localStorage API URL to prevent conflicts
if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('apiBaseURL');
}


