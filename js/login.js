// StockMaster - Authentication Logic

// Hardcoded credentials
const VALID_USER_ID = 'team123';
const VALID_PASSWORD = 'pass123';

function checkAuth() {
    const isAuthenticated = localStorage.getItem('stockmaster_authenticated') === 'true';
    if (!isAuthenticated && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
    }
}

function login(userId, password) {
    if (userId === VALID_USER_ID && password === VALID_PASSWORD) {
        localStorage.setItem('stockmaster_authenticated', 'true');
        localStorage.setItem('stockmaster_user', userId);
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('stockmaster_authenticated');
    localStorage.removeItem('stockmaster_user');
    window.location.href = 'login.html';
}

function isAuthenticated() {
    return localStorage.getItem('stockmaster_authenticated') === 'true';
}

// Check authentication on page load (except login/signup pages)
if (typeof window !== 'undefined') {
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login.html' && currentPage !== 'signup.html') {
        checkAuth();
    }
}

