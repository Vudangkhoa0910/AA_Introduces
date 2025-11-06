/* ===================================
   Minimal PDF Viewer - Routing Only
   Auto-compatible with Mobile & Desktop
   =================================== */

const PDF_ROUTES = {
    'vi': 'pdfs/[VN] Product Introduction.pdf',
    'en': 'pdfs/[EN] Product Introduction.pdf',
    'vi-en': 'pdfs/[EN-VN] Product Introduction.pdf',
    'vi_en': 'pdfs/[EN-VN] Product Introduction.pdf',  // Alternative with underscore
    've_en': 'pdfs/[EN-VN] Product Introduction.pdf'   // Alternative route
};

const DEFAULT_ROUTE = 'vi-en';

/* ===================================
   Initialize on Page Load
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
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
        
        // Always use direct PDF link for better performance
        iframe.src = pdfUrl;
        
        // Track loading
        let hasLoaded = false;
        
        // Method 1: Listen for iframe load event
        iframe.onload = () => {
            if (!hasLoaded) {
                hasLoaded = true;
                setTimeout(() => {
                    iframe.style.transition = 'opacity 0.3s ease';
                    iframe.style.opacity = '1';
                    hideLoadingScreen();
                }, 300);
            }
        };
        
        // Method 2: Progressive timeout - show earlier if possible
        setTimeout(() => {
            if (!hasLoaded) {
                hasLoaded = true;
                iframe.style.transition = 'opacity 0.3s ease';
                iframe.style.opacity = '1';
                hideLoadingScreen();
            }
        }, 2000);
        
        // Method 3: Ultimate fallback
        setTimeout(() => {
            if (!hasLoaded) {
                hasLoaded = true;
                iframe.style.opacity = '1';
                hideLoadingScreen();
            }
        }, 4000);
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
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
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