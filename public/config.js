// Frontend API configuration
// Set the API base URL in one place for all pages.
// Default: when served over http(s), API_BASE will be derived from current origin by api.js.
// When opening pages via file:// without a dev server, set this to your backend URL.

const API_BASE_URL = "https://inest-website.onrender.com";

// For production deployment, use the production API URL
window.API_BASE = `${API_BASE_URL}/api`;

// Clear any cached localStorage API URL to prevent conflicts
if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('apiBaseURL');
}


