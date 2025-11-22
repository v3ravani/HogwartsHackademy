// StockMaster - Authentication Logic

function checkAuth() {
    const isAuthenticated = localStorage.getItem('stockmaster_authenticated') === 'true';
    if (!isAuthenticated && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
    }
}

function getStoredUsers() {
    try {
        const raw = localStorage.getItem('stockmaster_users');
        return raw ? JSON.parse(raw) : [];
    } catch (_) {
        return [];
    }
}

function setStoredUsers(users) {
    localStorage.setItem('stockmaster_users', JSON.stringify(users));
}

async function login(userId, password) {
    const users = getStoredUsers();
    const user = users.find(u => u && u.user_id === userId && u.password === password);
    if (!user) return false;
    localStorage.setItem('stockmaster_authenticated', 'true');
    localStorage.setItem('stockmaster_user', user.user_id);
    return true;
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
