// Advanced Authentication System for iNest Platform
class AuthManager {
    constructor() {
        this.storageKeys = {
            token: 'inest_auth_token',
            refreshToken: 'inest_refresh_token',
            user: 'inest_user_data',
            sessionExpiry: 'inest_session_expiry',
            rememberMe: 'inest_remember_me'
        };
        
        this.userRoles = {
            TENANT: 'tenant',
            OWNER: 'owner',
            SERVICE_PROVIDER: 'service_provider',
            ADMIN: 'admin',
            SUPER_ADMIN: 'super_admin'
        };
        
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
        this.refreshTokenTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        // Initialize session check
        this.initializeSession();
    }
    
    // Initialize session management
    initializeSession() {
        // Check for session expiry on page load
        const sessionExpiry = localStorage.getItem(this.storageKeys.sessionExpiry);
        if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
            this.logout(false); // Silent logout without redirect
        }
        
        // Set up periodic session refresh
        setInterval(() => {
            this.refreshSession();
        }, 5 * 60 * 1000); // Check every 5 minutes
    }
    
    // User Registration
    async register(userData) {
        try {
            // Validate user data
            this.validateUserData(userData);
            
            // Add registration timestamp and default role
            const registrationData = {
                ...userData,
                role: userData.role || this.userRoles.TENANT,
                registeredAt: new Date().toISOString(),
                isEmailVerified: false,
                isPhoneVerified: false,
                profileComplete: false
            };
            
            // Call API
            const response = await api.register(registrationData);
            
            // Handle successful registration
            if (response.success) {
                // Store temporary user data for email verification
                this.setTempUserData(response.user);
                
                // Send verification email
                await this.sendEmailVerification(response.user.email);
                
                return {
                    success: true,
                    message: 'Registration successful! Please check your email to verify your account.',
                    user: response.user,
                    requiresVerification: true
                };
            }
            
            throw new Error(response.message || 'Registration failed');
            
        } catch (error) {
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    }
    
    // User Login
    async login(credentials, rememberMe = false) {
        try {
            // Validate credentials
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }
            
            // Call API
            const response = await api.login({
                ...credentials,
                deviceInfo: this.getDeviceInfo()
            });
            
            // Handle successful login
            if (response.success && response.token) {
                // Set authentication data
                this.setAuthData(response.token, response.refreshToken, response.user, rememberMe);
                
                // Update user's last login
                this.updateLastLogin(response.user.id);
                
                // Log login event
                this.logUserActivity('login', {
                    timestamp: new Date().toISOString(),
                    ip: await this.getClientIP(),
                    userAgent: navigator.userAgent
                });
                
                return {
                    success: true,
                    user: response.user,
                    token: response.token
                };
            }
            
            throw new Error(response.message || 'Login failed');
            
        } catch (error) {
            // Log failed attempt
            this.logUserActivity('login_failed', {
                email: credentials.email,
                reason: error.message,
                timestamp: new Date().toISOString()
            });
            
            throw new Error(error.message || 'Login failed. Please check your credentials.');
        }
    }
    
    // Social Media Login
    async socialLogin(provider, profile) {
        try {
            const response = await api.post('/auth/social-login', {
                provider,
                profile,
                deviceInfo: this.getDeviceInfo()
            });
            
            if (response.success) {
                this.setAuthData(response.token, response.refreshToken, response.user, false);
                
                this.logUserActivity('social_login', {
                    provider,
                    timestamp: new Date().toISOString()
                });
                
                return {
                    success: true,
                    user: response.user,
                    isNewUser: response.isNewUser
                };
            }
            
            throw new Error(response.message || 'Social login failed');
            
        } catch (error) {
            throw new Error(error.message || 'Social login failed. Please try again.');
        }
    }
    
    // User Logout
    logout(redirect = true) {
        try {
            // Log logout event
            if (this.isAuthenticated()) {
                const user = this.getCurrentUser();
                this.logUserActivity('logout', {
                    userId: user?.id,
                    timestamp: new Date().toISOString()
                });
            }
            
            // Clear authentication data
            this.clearAuthData();
            
            // Redirect to login if requested
            if (redirect) {
                window.location.href = 'login.html';
            }
            
        } catch (error) {
            console.error('Logout error:', error);
            // Force clear even if there's an error
            this.clearAuthData();
            if (redirect) {
                window.location.href = 'login.html';
            }
        }
    }
    
    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const sessionExpiry = localStorage.getItem(this.storageKeys.sessionExpiry);
        
        return !!(token && sessionExpiry && Date.now() < parseInt(sessionExpiry));
    }
    
    // Get current user
    getCurrentUser() {
        try {
            const userData = localStorage.getItem(this.storageKeys.user);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }
    
    // Update user profile
    async updateProfile(profileData) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please login to update your profile');
            }
            
            const response = await api.put('/user/profile', profileData);
            
            if (response.success) {
                // Update local user data
                const updatedUser = { ...this.getCurrentUser(), ...response.user };
                localStorage.setItem(this.storageKeys.user, JSON.stringify(updatedUser));
                
                this.logUserActivity('profile_updated', {
                    timestamp: new Date().toISOString(),
                    updatedFields: Object.keys(profileData)
                });
                
                return {
                    success: true,
                    user: updatedUser
                };
            }
            
            throw new Error(response.message || 'Profile update failed');
            
        } catch (error) {
            throw new Error(error.message || 'Failed to update profile. Please try again.');
        }
    }
    
    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            if (!this.isAuthenticated()) {
                throw new Error('Please login to change your password');
            }
            
            // Validate passwords
            if (!currentPassword || !newPassword) {
                throw new Error('Both current and new passwords are required');
            }
            
            if (newPassword.length < 6) {
                throw new Error('New password must be at least 6 characters long');
            }
            
            const response = await api.put('/user/change-password', {
                currentPassword,
                newPassword
            });
            
            if (response.success) {
                this.logUserActivity('password_changed', {
                    timestamp: new Date().toISOString()
                });
                
                return { success: true };
            }
            
            throw new Error(response.message || 'Password change failed');
            
        } catch (error) {
            throw new Error(error.message || 'Failed to change password. Please try again.');
        }
    }
    
    // Reset password
    async resetPassword(email) {
        try {
            const response = await api.post('/auth/reset-password', { email });
            
            if (response.success) {
                return {
                    success: true,
                    message: 'Password reset link sent to your email'
                };
            }
            
            throw new Error(response.message || 'Password reset failed');
            
        } catch (error) {
            throw new Error(error.message || 'Failed to send reset email. Please try again.');
        }
    }
    
    // Email verification
    async sendEmailVerification(email) {
        try {
            const response = await api.post('/auth/send-verification', { email });
            return response.success;
        } catch (error) {
            console.error('Email verification send failed:', error);
            return false;
        }
    }
    
    async verifyEmail(token) {
        try {
            const response = await api.post('/auth/verify-email', { token });
            
            if (response.success) {
                // Update user data
                const user = this.getCurrentUser();
                if (user) {
                    user.isEmailVerified = true;
                    localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
                }
                
                return { success: true };
            }
            
            throw new Error(response.message || 'Email verification failed');
            
        } catch (error) {
            throw new Error(error.message || 'Email verification failed');
        }
    }
    
    // Check user role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    }
    
    // Check if user is admin
    isAdmin() {
        return this.hasRole(this.userRoles.ADMIN) || this.hasRole(this.userRoles.SUPER_ADMIN);
    }
    
    // Session management
    async refreshSession() {
        try {
            if (!this.isAuthenticated()) return;
            
            const refreshToken = localStorage.getItem(this.storageKeys.refreshToken);
            if (!refreshToken) {
                this.logout(false);
                return;
            }
            
            const response = await api.post('/auth/refresh', { refreshToken });
            
            if (response.success) {
                // Update tokens and session
                this.updateSession(response.token, response.refreshToken);
            } else {
                this.logout(false);
            }
            
        } catch (error) {
            console.error('Session refresh failed:', error);
            this.logout(false);
        }
    }
    
    // Private helper methods
    setAuthData(token, refreshToken, user, rememberMe) {
        localStorage.setItem(this.storageKeys.token, token);
        localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
        localStorage.setItem(this.storageKeys.rememberMe, rememberMe.toString());
        
        if (refreshToken) {
            localStorage.setItem(this.storageKeys.refreshToken, refreshToken);
        }
        
        // Set session expiry
        const expiryTime = Date.now() + (rememberMe ? this.refreshTokenTimeout : this.sessionTimeout);
        localStorage.setItem(this.storageKeys.sessionExpiry, expiryTime.toString());
        
        // Update API token
        api.setToken(token);
    }
    
    updateSession(token, refreshToken) {
        localStorage.setItem(this.storageKeys.token, token);
        if (refreshToken) {
            localStorage.setItem(this.storageKeys.refreshToken, refreshToken);
        }
        
        const rememberMe = localStorage.getItem(this.storageKeys.rememberMe) === 'true';
        const expiryTime = Date.now() + (rememberMe ? this.refreshTokenTimeout : this.sessionTimeout);
        localStorage.setItem(this.storageKeys.sessionExpiry, expiryTime.toString());
        
        api.setToken(token);
    }
    
    clearAuthData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        api.removeToken();
    }
    
    getToken() {
        return localStorage.getItem(this.storageKeys.token);
    }
    
    setTempUserData(user) {
        sessionStorage.setItem('temp_user', JSON.stringify(user));
    }
    
    getTempUserData() {
        const tempUser = sessionStorage.getItem('temp_user');
        return tempUser ? JSON.parse(tempUser) : null;
    }
    
    validateUserData(userData) {
        const required = ['name', 'email', 'password'];
        const missing = required.filter(field => !userData[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Password validation
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        // Phone validation (if provided)
        if (userData.phone && !/^\d{10}$/.test(userData.phone.replace(/\D/g, ''))) {
            throw new Error('Please enter a valid 10-digit phone number');
        }
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
    
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }
    
    async updateLastLogin(userId) {
        try {
            await api.put('/user/last-login', {
                userId,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to update last login:', error);
        }
    }
    
    logUserActivity(action, data) {
        try {
            const user = this.getCurrentUser();
            const activityLog = {
                userId: user?.id || 'anonymous',
                action,
                data,
                timestamp: new Date().toISOString()
            };
            
            // Store in sessionStorage for now (in production, send to server)
            const activities = JSON.parse(sessionStorage.getItem('user_activities') || '[]');
            activities.push(activityLog);
            
            // Keep only last 100 activities
            if (activities.length > 100) {
                activities.splice(0, activities.length - 100);
            }
            
            sessionStorage.setItem('user_activities', JSON.stringify(activities));
            
            // In production, also send to server
            // this.sendActivityToServer(activityLog);
            
        } catch (error) {
            console.error('Failed to log user activity:', error);
        }
    }
    
    getUserActivities() {
        try {
            return JSON.parse(sessionStorage.getItem('user_activities') || '[]');
        } catch (error) {
            console.error('Failed to get user activities:', error);
            return [];
        }
    }
    
    // Page protection
    requireAuth(allowedRoles = null) {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        
        if (allowedRoles) {
            const user = this.getCurrentUser();
            if (!user || !allowedRoles.includes(user.role)) {
                this.redirectToUnauthorized();
                return false;
            }
        }
        
        return true;
    }
    
    redirectToLogin() {
        const currentPage = window.location.pathname;
        localStorage.setItem('redirect_after_login', currentPage);
        window.location.href = 'login.html';
    }
    
    redirectToUnauthorized() {
        alert('You do not have permission to access this page.');
        window.location.href = 'index.html';
    }
    
    getRedirectUrl() {
        const redirectUrl = localStorage.getItem('redirect_after_login');
        localStorage.removeItem('redirect_after_login');
        return redirectUrl || 'index.html';
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}

// Helper functions for backward compatibility
function isAuthenticated() {
    return authManager.isAuthenticated();
}

function getCurrentUser() {
    return authManager.getCurrentUser();
}

function logout() {
    authManager.logout();
}

function requireAuth(roles = null) {
    return authManager.requireAuth(roles);
}
