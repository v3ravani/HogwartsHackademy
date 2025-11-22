// StockMaster - Gemini AI Chatbot Integration

const GEMINI_API_KEY = 'AIzaSyALqD_zIGKS7ZfbNQCAb6jSFCYIKXIH3Ow';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

let chatHistory = [];
let isChatOpen = false;

function initChatbot() {
    createChatbotUI();
    loadChatHistory();
    ensureChatPosition();
    
    // Ensure chat stays in bottom right on window resize/scroll
    window.addEventListener('resize', ensureChatPosition);
    window.addEventListener('scroll', ensureChatPosition);
}

function ensureChatPosition() {
    const chatButton = document.getElementById('chatbotButton');
    const chatWindow = document.getElementById('chatbotWindow');
    
    if (chatButton) {
        chatButton.style.position = 'fixed';
        chatButton.style.bottom = '24px';
        chatButton.style.right = '24px';
        chatButton.style.top = 'auto';
        chatButton.style.left = 'auto';
    }
    
    if (chatWindow) {
        chatWindow.style.position = 'fixed';
        chatWindow.style.bottom = '90px';
        chatWindow.style.right = '24px';
        chatWindow.style.top = 'auto';
        chatWindow.style.left = 'auto';
    }
}

function createChatbotUI() {
    // Create chat button
    const chatButton = document.createElement('div');
    chatButton.id = 'chatbotButton';
    chatButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span id="chatbotNotification" style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 18px;
            height: 18px;
            background: #D32F2F;
            color: white;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 600;
            border: 2px solid white;
        "></span>
    `;
    chatButton.style.cssText = `
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #1A73E8 0%, #185ABC 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        transition: all 0.3s ease;
        color: white;
    `;
    
    // Add pulse animation style
    const pulseStyle = document.createElement('style');
    pulseStyle.id = 'chatbotPulseStyle';
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2); }
            50% { box-shadow: 0 4px 20px rgba(26, 115, 232, 0.6), 0 4px 8px rgba(0, 0, 0, 0.3); }
        }
    `;
    document.head.appendChild(pulseStyle);
    
    // Add pulse animation when chat is closed
    if (!isChatOpen) {
        chatButton.style.animation = 'pulse 2s infinite';
    }
    chatButton.onmouseover = () => {
        chatButton.style.transform = 'scale(1.1)';
        chatButton.style.boxShadow = '0 6px 16px rgba(26, 115, 232, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3)';
    };
    chatButton.onmouseout = () => {
        chatButton.style.transform = 'scale(1)';
        chatButton.style.boxShadow = '0 4px 12px rgba(26, 115, 232, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)';
    };
    chatButton.onclick = toggleChat;
    document.body.appendChild(chatButton);
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatbotWindow';
    chatWindow.style.cssText = `
        position: fixed !important;
        bottom: 90px !important;
        right: 24px !important;
        width: 380px;
        height: 600px;
        max-height: calc(100vh - 120px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 9998;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .chat-message {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    chatWindow.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1A73E8 0%, #185ABC 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div>
                <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 500;">StockMaster AI Assistant</h3>
                <p style="margin: 0; font-size: 12px; opacity: 0.9;">Powered by Gemini AI</p>
            </div>
            <button id="closeChatbot" style="
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div id="chatbotMessages" style="
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #F8F9FA;
            display: flex;
            flex-direction: column;
            gap: 12px;
        "></div>
        <div style="
            padding: 16px;
            background: white;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
        ">
            <div style="display: flex; gap: 8px;">
                <input type="text" id="chatbotInput" placeholder="Ask me anything about StockMaster..." style="
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #DADCE0;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                " onkeypress="handleChatInput(event)">
                <button id="sendChatbotMessage" style="
                    background: #1A73E8;
                    color: white;
                    border: none;
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                " onmouseover="this.style.background='#1557B0'" onmouseout="this.style.background='#1A73E8'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatWindow);
    
    // Add event listeners
    document.getElementById('closeChatbot').onclick = toggleChat;
    document.getElementById('sendChatbotMessage').onclick = sendMessage;
    
    // Add welcome message
    addWelcomeMessage();
}

function toggleChat() {
    const chatWindow = document.getElementById('chatbotWindow');
    const chatButton = document.getElementById('chatbotButton');
    isChatOpen = !isChatOpen;
    
    if (chatWindow) {
        // Ensure chat window always stays in bottom right
        chatWindow.style.position = 'fixed';
        chatWindow.style.bottom = '90px';
        chatWindow.style.right = '24px';
        chatWindow.style.display = isChatOpen ? 'flex' : 'none';
    }
    
    if (isChatOpen) {
        if (chatButton) {
            chatButton.style.animation = 'none';
        }
        setTimeout(() => {
            const input = document.getElementById('chatbotInput');
            if (input) input.focus();
        }, 100);
        loadPreviousMessages();
    } else {
        if (chatButton) {
            chatButton.style.animation = 'pulse 2s infinite';
        }
    }
}

function loadPreviousMessages() {
    if (chatHistory.length === 0) return;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    // Check if we already loaded messages (more than just welcome message)
    const hasLoadedMessages = Array.from(messagesContainer.children).some(child => 
        child.textContent.includes('User:') || child.textContent.includes('Previous conversation')
    );
    
    if (hasLoadedMessages) return; // Already loaded
    
    // Load last 5 messages from history
    const recentMessages = chatHistory.slice(-5);
    recentMessages.forEach(msg => {
        addMessageToChat(msg.user, 'user');
        addMessageToChat(msg.assistant, 'assistant');
    });
}

function addWelcomeMessage() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    // Only show welcome if no previous messages
    if (messagesContainer.children.length > 0) return;
    
    messagesContainer.innerHTML = `
        <div class="chat-message" style="
            background: linear-gradient(135deg, rgba(26, 115, 232, 0.05) 0%, rgba(24, 90, 188, 0.05) 100%);
            border: 1px solid rgba(26, 115, 232, 0.1);
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            max-width: 90%;
            align-self: flex-start;
        ">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #1A73E8 0%, #185ABC 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">AI</div>
                <div>
                    <p style="margin: 0; font-size: 15px; color: #202124; font-weight: 500;">StockMaster AI Assistant</p>
                    <p style="margin: 0; font-size: 11px; color: #5F6368;">Powered by Gemini</p>
                </div>
            </div>
            <p style="margin: 0 0 12px 0; font-size: 14px; color: #202124; line-height: 1.6;">
                👋 Hello! I'm your AI assistant for StockMaster inventory management system.
            </p>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #5F6368; font-weight: 500;">I can help you with:</p>
            <ul style="margin: 0 0 12px 0; padding-left: 20px; font-size: 13px; color: #5F6368; line-height: 1.8;">
                <li>Product & inventory management</li>
                <li>Stock operations (receipts, deliveries, transfers)</li>
                <li>Customer database management</li>
                <li>Reports & analytics insights</li>
                <li>System navigation and features</li>
            </ul>
            <p style="margin: 0; font-size: 13px; color: #1A73E8; font-weight: 500;">
                Ask me anything about StockMaster!
            </p>
        </div>
    `;
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const sendButton = document.getElementById('sendChatbotMessage');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Disable input while processing
    if (input) input.disabled = true;
    if (sendButton) sendButton.disabled = true;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get context about current state
    const context = getStockMasterContext();
    
    // Send to Gemini API
    sendToGemini(message, context).finally(() => {
        // Re-enable input
        if (input) {
            input.disabled = false;
            input.focus();
        }
        if (sendButton) sendButton.disabled = false;
    });
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    if (sender === 'user') {
        messageDiv.style.cssText = `
            background: #1A73E8;
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 85%;
            align-self: flex-end;
            margin-left: auto;
        `;
    } else {
        messageDiv.style.cssText = `
            background: white;
            color: #202124;
            padding: 12px 16px;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            max-width: 85%;
            align-self: flex-start;
        `;
    }
    
    messageDiv.innerHTML = `<p style="margin: 0; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(message)}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.style.cssText = `
        background: white;
        padding: 12px 16px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        max-width: 85%;
        align-self: flex-start;
    `;
    typingDiv.innerHTML = `
        <div style="display: flex; gap: 4px;">
            <div style="width: 8px; height: 8px; background: #1A73E8; border-radius: 50%; animation: bounce 1.4s infinite;"></div>
            <div style="width: 8px; height: 8px; background: #1A73E8; border-radius: 50%; animation: bounce 1.4s infinite 0.2s;"></div>
            <div style="width: 8px; height: 8px; background: #1A73E8; border-radius: 50%; animation: bounce 1.4s infinite 0.4s;"></div>
        </div>
        <style>
            @keyframes bounce {
                0%, 60%, 100% { transform: translateY(0); }
                30% { transform: translateY(-8px); }
            }
        </style>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

function getStockMasterContext() {
    const products = getProducts();
    const customers = getCustomers();
    const receipts = getReceipts();
    const deliveries = getDeliveries();
    const transfers = getTransfers();
    const warehouses = getWarehouses();
    const categories = getCategories();
    
    return {
        productsCount: products.length,
        totalStock: products.reduce((sum, p) => sum + p.stock, 0),
        lowStockItems: products.filter(p => p.stock < 10).length,
        customersCount: customers.length,
        totalReceipts: receipts.length,
        totalDeliveries: deliveries.length,
        warehouses: warehouses,
        categories: categories
    };
}

async function sendToGemini(message, context) {
    try {
        removeTypingIndicator(); // Remove any existing typing indicator
        showTypingIndicator(); // Show fresh typing indicator
        const systemPrompt = `You are StockMaster AI Assistant, a helpful AI chatbot for an Inventory Management System called StockMaster. 

Current System Status:
- Total Products: ${context.productsCount}
- Total Stock Units: ${context.totalStock}
- Low Stock Items: ${context.lowStockItems}
- Total Customers: ${context.customersCount}
- Total Receipts: ${context.totalReceipts}
- Total Deliveries: ${context.totalDeliveries}
- Warehouses: ${context.warehouses.join(', ')}
- Categories: ${context.categories.join(', ')}

StockMaster Features:
1. Products Management - Create, view, and manage inventory products with SKU, category, stock levels
2. Customer Database - Manage customer information (Corporate, Individual, Government types)
3. Receipts - Record incoming stock from suppliers
4. Delivery Orders - Track outgoing stock to customers with stock validation
5. Internal Transfers - Move stock between warehouses/locations
6. Stock Adjustments - Correct physical vs system stock discrepancies
7. Move History - Chronological log of all inventory movements
8. Reports & Analytics - Visual charts and analytics dashboard
9. Dashboard - Real-time KPIs, charts, recent activity, stock alerts

You can help users with:
- Explaining how to use StockMaster features
- Product and inventory management questions
- Stock operations (receipts, deliveries, transfers, adjustments)
- Warehouse and category management guidance
- Understanding reports and analytics
- Troubleshooting and best practices
- General questions about inventory management

Keep responses concise (2-3 sentences max for simple questions, up to 5 for complex topics). Be professional, friendly, and helpful. Use the current system status context when relevant to answer questions.`;

        // Build conversation history for context
        const conversationContext = chatHistory.slice(-5).map(chat => 
            `User: ${chat.user}\nAssistant: ${chat.assistant}`
        ).join('\n\n');
        
        const fullPrompt = conversationContext 
            ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`
            : `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        removeTypingIndicator();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessageToChat(aiResponse, 'assistant');
            
            // Save to history
            chatHistory.push({ user: message, assistant: aiResponse, timestamp: new Date().toISOString() });
            
            // Keep only last 20 messages
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(-20);
            }
            
            saveChatHistory();
        } else {
            addMessageToChat('Sorry, I encountered an error processing your request. Please try again or rephrase your question.', 'assistant');
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        removeTypingIndicator();
        
        let errorMessage = 'Sorry, I\'m having trouble connecting right now. ';
        if (error.message.includes('API error')) {
            errorMessage += 'There was an issue with the AI service. Please try again in a moment.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage += 'Please check your internet connection and try again.';
        } else {
            errorMessage += 'Please try again or rephrase your question.';
        }
        
        addMessageToChat(errorMessage, 'assistant');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveChatHistory() {
    localStorage.setItem('stockmaster_chat_history', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('stockmaster_chat_history');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

// Initialize chatbot when DOM is ready (only on authenticated pages)
function initializeChatbot() {
    // Don't show chatbot on login/signup pages
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        return;
    }
    
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('stockmaster_authenticated') === 'true';
    if (!isAuthenticated) {
        return;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
}

// Initialize
initializeChatbot();

