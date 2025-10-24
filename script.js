/* ===================================
   Application State & Configuration
   =================================== */

const APP_CONFIG = {
    defaultPage: 'vi-en',
    routes: {
        'vi-en': {
            id: 'page-en-vn',
            title: 'Product Introduction (EN-VN)',
            pdf: './pdfs/[EN-VN] Product Introduction.pdf',
            navButton: 'en-vn'
        },
        'en': {
            id: 'page-en',
            title: 'Product Introduction (English)',
            pdf: './pdfs/[EN] Product Introduction.pdf',
            navButton: 'en'
        },
        'vi': {
            id: 'page-vn',
            title: 'Giới thiệu sản phẩm',
            pdf: './pdfs/[VN] Product Introduction.pdf',
            navButton: 'vn'
        }
    }
};

let currentTheme = 'light';
let currentRoute = null;

/* ===================================
   Initialization
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRouter();
    initEventListeners();
    hideLoadingScreen();
});

/* ===================================
   Theme Management
   =================================== */

function initTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else if (prefersDark) {
        currentTheme = 'dark';
    }
    
    applyTheme(currentTheme);
    updateThemeIcon();
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

/* ===================================
   Router Implementation
   =================================== */

function initRouter() {
    // Get the current path
    const path = getCurrentPath();
    
    // Navigate to the current path or default
    if (path && APP_CONFIG.routes[path]) {
        navigateTo(path, false);
    } else {
        navigateTo(APP_CONFIG.defaultPage, true);
    }
    
    // Listen for browser back/forward
    window.addEventListener('popstate', handlePopState);
}

function getCurrentPath() {
    // Get path from URL (e.g., /vi, /en, /vi-en)
    const path = window.location.pathname.substring(1); // Remove leading slash
    return path || null;
}

function navigateTo(route, updateHistory = true) {
    const routeConfig = APP_CONFIG.routes[route];
    
    if (!routeConfig) {
        console.error(`Route '${route}' not found`);
        navigateTo(APP_CONFIG.defaultPage, true);
        return;
    }
    
    // Update browser history
    if (updateHistory) {
        const newUrl = `/${route}`;
        window.history.pushState({ route }, '', newUrl);
    }
    
    // Update current route
    currentRoute = route;
    
    // Show the corresponding page
    showPage(routeConfig.navButton);
    
    // Update document title
    document.title = `${routeConfig.title} - PDF Viewer`;
    
    // Update meta description
    updateMetaDescription(routeConfig.title);
}

function handlePopState(event) {
    const route = event.state?.route || getCurrentPath() || APP_CONFIG.defaultPage;
    navigateTo(route, false);
}

function updateMetaDescription(title) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', `View ${title} - Professional PDF document viewer`);
    }
}

/* ===================================
   Page Navigation
   =================================== */

function showPage(pageId) {
    // Find the route for this page
    let targetRoute = null;
    for (const [route, config] of Object.entries(APP_CONFIG.routes)) {
        if (config.navButton === pageId) {
            targetRoute = route;
            break;
        }
    }
    
    if (!targetRoute) {
        console.error(`Page '${pageId}' not found`);
        return;
    }
    
    // Navigate to the route
    navigateTo(targetRoute, true);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const routeConfig = APP_CONFIG.routes[targetRoute];
    const targetPage = document.getElementById(routeConfig.id);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation buttons
    updateNavigation(pageId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateNavigation(activePageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPageId = link.getAttribute('data-page');
        
        if (linkPageId === activePageId) {
            link.classList.add('active');
            link.setAttribute('aria-selected', 'true');
        } else {
            link.classList.remove('active');
            link.setAttribute('aria-selected', 'false');
        }
    });
}

/* ===================================
   PDF Actions
   =================================== */

function downloadPDF(pageId) {
    // Find the route for this page
    let pdfUrl = null;
    for (const [route, config] of Object.entries(APP_CONFIG.routes)) {
        if (config.navButton === pageId) {
            pdfUrl = config.pdf;
            break;
        }
    }
    
    if (!pdfUrl) {
        showError('Không tìm thấy file PDF');
        return;
    }
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('Đang tải xuống tài liệu...', 'success');
}

function printPDF(pageId) {
    const iframe = document.getElementById(`pdf-frame-${pageId}`);
    
    if (!iframe) {
        showError('Không tìm thấy tài liệu để in');
        return;
    }
    
    try {
        // Try to print the iframe content
        iframe.contentWindow.print();
    } catch (error) {
        // Fallback: open in new window and print
        window.open(iframe.src, '_blank');
        showNotification('Vui lòng in tài liệu từ cửa sổ mới', 'info');
    }
}

function toggleFullscreen(pageId) {
    const viewer = document.getElementById(`pdf-viewer-${pageId}`);
    
    if (!viewer) {
        showError('Không tìm thấy trình xem PDF');
        return;
    }
    
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (viewer.requestFullscreen) {
            viewer.requestFullscreen();
        } else if (viewer.webkitRequestFullscreen) {
            viewer.webkitRequestFullscreen();
        } else if (viewer.msRequestFullscreen) {
            viewer.msRequestFullscreen();
        }
        
        viewer.classList.add('fullscreen');
        
        // Update icon
        const btn = viewer.parentElement.querySelector('.toolbar-btn[onclick*="toggleFullscreen"]');
        if (btn) {
            btn.querySelector('i').className = 'fas fa-compress';
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        viewer.classList.remove('fullscreen');
        
        // Update icon
        const btn = viewer.parentElement.querySelector('.toolbar-btn[onclick*="toggleFullscreen"]');
        if (btn) {
            btn.querySelector('i').className = 'fas fa-expand';
        }
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement) {
        // Exited fullscreen
        const viewers = document.querySelectorAll('.pdf-viewer.fullscreen');
        viewers.forEach(viewer => {
            viewer.classList.remove('fullscreen');
            
            const btn = viewer.parentElement.querySelector('.toolbar-btn[onclick*="toggleFullscreen"]');
            if (btn) {
                btn.querySelector('i').className = 'fas fa-expand';
            }
        });
    }
}

/* ===================================
   Modal Management
   =================================== */

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus on first focusable element
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

function showError(message) {
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    showModal('error-modal');
}

/* ===================================
   Notification System
   =================================== */

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'check-circle';
        case 'error':
            return 'exclamation-circle';
        case 'warning':
            return 'exclamation-triangle';
        case 'info':
        default:
            return 'info-circle';
    }
}

/* ===================================
   Event Listeners
   =================================== */

function initEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Close modal on overlay click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Handle iframe load errors
    const iframes = document.querySelectorAll('.pdf-frame');
    iframes.forEach(iframe => {
        iframe.addEventListener('error', () => {
            showError('Không thể tải tài liệu PDF. Vui lòng thử lại sau.');
        });
    });
}

function handleKeyboardShortcuts(e) {
    // Escape key - close modals, exit fullscreen
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
    
    // Ctrl/Cmd + K - toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + P - print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        if (currentRoute) {
            const config = APP_CONFIG.routes[currentRoute];
            printPDF(config.navButton);
        }
    }
}

/* ===================================
   Loading Screen
   =================================== */

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

/* ===================================
   Utility Functions
   =================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ===================================
   Error Handling
   =================================== */

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

/* ===================================
   Performance Monitoring
   =================================== */

if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    });
}

/* ===================================
   Service Worker Registration (Optional)
   =================================== */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/service-worker.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

/* ===================================
   Export for debugging
   =================================== */

window.APP = {
    config: APP_CONFIG,
    currentRoute,
    currentTheme,
    navigateTo,
    showPage,
    toggleTheme
};