// Local client-side auth helper (dev fallback)
// Stores users in localStorage under key 'stockmaster_users' as an object mapping userId -> { name, email, hash }

async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function getStoredUsers() {
    try {
        const raw = localStorage.getItem('stockmaster_users') || '{}';
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse stored users', e);
        return {};
    }
}

function saveStoredUsers(obj) {
    localStorage.setItem('stockmaster_users', JSON.stringify(obj));
}

async function localRegister({ user_id, password, name = '', email = '' }) {
    if (!user_id || !password || !name) return { success: false, message: 'Missing fields' };
    const users = getStoredUsers();
    if (users[user_id]) return { success: false, message: 'User ID already exists (local)' };
    const hash = await hashPassword(password);
    users[user_id] = { name, email, hash, created_at: new Date().toISOString() };
    saveStoredUsers(users);
    return { success: true, message: 'Account created (local)' };
}

async function localLogin({ user_id, password, email = '' }) {
    if (!user_id || !password) return { success: false, message: 'Missing credentials' };
    const users = getStoredUsers();
    const user = users[user_id];
    if (!user) return { success: false, message: 'Invalid credentials (local)' };
    // If email provided, ensure it matches stored email
    if (email && user.email && String(email).toLowerCase() !== String(user.email).toLowerCase()) {
        return { success: false, message: 'Email does not match (local)' };
    }
    const hash = await hashPassword(password);
    if (hash !== user.hash) return { success: false, message: 'Invalid credentials (local)' };
    try {
        localStorage.setItem('stockmaster_authenticated', 'true');
        localStorage.setItem('stockmaster_user', user_id);
    } catch (e) { /* ignore */ }
    return { success: true, message: 'Authenticated (local)' };
}

// Export to global for simple usage
window.authLocal = {
    hashPassword,
    localRegister,
    localLogin,
    getStoredUsers,
    saveStoredUsers
};
