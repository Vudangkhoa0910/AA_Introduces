/* ===================================
   Minimal PDF Viewer - Routing Only
   Auto-compatible with Mobile & Desktop
   =================================== */

const PDF_ROUTES = {
    'vi': './pdfs/[VN] Product Introduction.pdf',
    'en': './pdfs/[EN] Product Introduction.pdf',
    'vi-en': './pdfs/[EN-VN] Product Introduction.pdf',
    'vi_en': './pdfs/[EN-VN] Product Introduction.pdf',  // Alternative with underscore
    've_en': './pdfs/[EN-VN] Product Introduction.pdf'   // Alternative route
};

const DEFAULT_ROUTE = 'vi-en';

/* ===================================
   Initialize on Page Load
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    hideLoadingScreen();
});

/* ===================================
   Router
   =================================== */

function initRouter() {
    const path = getCurrentPath();
    const route = path || DEFAULT_ROUTE;
    
    loadPDF(route);
    
    // Listen for browser back/forward
    window.addEventListener('popstate', () => {
        const newPath = getCurrentPath() || DEFAULT_ROUTE;
        loadPDF(newPath);
    });
}

function getCurrentPath() {
    // Get path from URL (e.g., /vi, /en, /vi-en)
    const path = window.location.pathname.substring(1);
    return path || null;
}

function loadPDF(route) {
    const pdfUrl = PDF_ROUTES[route];
    
    if (!pdfUrl) {
        console.error(`Route '${route}' not found, loading default`);
        loadPDF(DEFAULT_ROUTE);
        return;
    }
    
    const iframe = document.getElementById('pdf-frame');
    if (iframe) {
        // Add loading state
        iframe.style.opacity = '0';
        
        // Detect mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        if (isMobile) {
            // Use Google Docs Viewer for better mobile support
            const fullUrl = window.location.origin + '/' + pdfUrl;
            iframe.src = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
        } else {
            // Direct PDF for desktop
            iframe.src = pdfUrl;
        }
        
        // Fade in when loaded
        iframe.onload = () => {
            iframe.style.transition = 'opacity 0.3s ease';
            iframe.style.opacity = '1';
        };
    }
    
    // Update document title based on route
    const titles = {
        'vi': 'Giới thiệu sản phẩm',
        'en': 'Product Introduction',
        'vi-en': 'Product Introduction (EN-VN)',
        'vi_en': 'Product Introduction (EN-VN)',
        've_en': 'Product Introduction (EN-VN)'
    };
    document.title = titles[route] || 'PDF Viewer';
}

/* ===================================
   Loading Screen
   =================================== */

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
}

/* ===================================
   Error Handling
   =================================== */

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// Handle iframe load errors
document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('pdf-frame');
    if (iframe) {
        iframe.addEventListener('error', () => {
            console.error('Failed to load PDF');
        });
    }
});