// API utility functions for making HTTP requests to the backend

class API {
    constructor() {
        const envBase = (typeof window !== 'undefined' && window.API_BASE) ? String(window.API_BASE) : '';
        const savedBase = typeof localStorage !== 'undefined' ? localStorage.getItem('apiBaseURL') : null;
        const defaultBase = (typeof window !== 'undefined' && window.location && window.location.protocol !== 'file:')
            ? (window.location.origin.replace(/\/$/, '') + '/api')
            : 'http://localhost:5000/api';
        this.baseURL = (envBase && envBase.trim()) || (savedBase && savedBase.trim()) || defaultBase;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authorization header if token exists
        const token = this.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const contentType = response.headers.get('content-type') || '';
            const data = contentType.includes('application/json') ? await response.json() : await response.text();

            if (!response.ok) {
                const message = (data && data.message) || (typeof data === 'string' ? data : 'Request failed');
                throw new Error(`${response.status} ${response.statusText}: ${message}`);
            }

            return data;
        } catch (error) {
            const isNetwork = error && (error.name === 'TypeError' || /Failed to fetch|NetworkError/i.test(String(error)));
            if (isNetwork) {
                throw new Error(`Unable to reach API at ${this.baseURL}. Ensure the backend is running and CORS/port are correct.`);
            }
            throw error;
        }
    }

    // GET request
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // User authentication methods
    async register(userData) {
        return this.post('/users/register', userData);
    }

    async login(credentials) {
        return this.post('/users/login', credentials);
    }

    // Token management
    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    removeToken() {
        localStorage.removeItem('authToken');
    }

    // Base URL management
    setBaseURL(url) {
        if (!url) return;
        const normalized = url.replace(/\/$/, '');
        this.baseURL = normalized;
        localStorage.setItem('apiBaseURL', normalized);
    }

    getBaseURL() {
        return this.baseURL;
    }

    // Health check
    async health() {
        return this.get('/health');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Logout user
    logout() {
        this.removeToken();
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

// Create global instance
const api = new API();

