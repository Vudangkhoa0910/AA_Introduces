/* ===================================
   Google Docs Viewer - Simple & Reliable
   Shows all pages with scroll
   =================================== */

const PDF_ROUTES = {
    'vi': 'pdfs/[VN] Product Introduction.pdf',
    'en': 'pdfs/[EN] Product Introduction.pdf',
    'vi-en': 'pdfs/[EN-VN] Product Introduction.pdf',
    'vi_en': 'pdfs/[EN-VN] Product Introduction.pdf',
    've_en': 'pdfs/[EN-VN] Product Introduction.pdf',
    'adgmin': 'pdfs/[ADGMIN] Product Introduction.pdf',
    'adgmin_video': 'pdfs/[ADGMIN] Product Introduction.pdf'
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
    const path = window.location.pathname.substring(1);
    return path || null;
}

/* ===================================
   PDF Loading with Google Docs Viewer
   =================================== */

function loadPDF(route) {
    const pdfUrl = PDF_ROUTES[route];
    
    if (!pdfUrl) {
        console.error(`Route '${route}' not found, loading default`);
        loadPDF(DEFAULT_ROUTE);
        return;
    }
    
    const pdfIframe = document.getElementById('pdf-frame');
    const videoSection = document.getElementById('video-section');
    const videoFrame = document.getElementById('video-frame');
    
    if (!pdfIframe) return;
    
    // Handle video section for adgmin_video route
    if (route === 'adgmin_video') {
        if (videoSection && videoFrame) {
            videoSection.style.display = 'block';
            videoFrame.src = 'https://www.youtube.com/embed/FHMFlllsj2s?si=X0VmaPMuEgr2e4d8&autoplay=1&mute=1';
        }
    } else {
        if (videoSection) {
            videoSection.style.display = 'none';
        }
    }
    
    // Get full URL for Google Docs Viewer
    const fullUrl = window.location.origin + '/' + pdfUrl;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
    
    // Set iframe source
    iframe.style.opacity = '0';
    iframe.src = googleViewerUrl;
    
    // Track loading
    let hasLoaded = false;
    
    // Method 1: iframe onload
    iframe.onload = () => {
        if (!hasLoaded) {
            hasLoaded = true;
            setTimeout(() => {
                iframe.style.transition = 'opacity 0.5s ease';
                iframe.style.opacity = '1';
                hideLoadingScreen();
            }, 500);
        }
    };
    
    // Method 2: Timeout fallback (3s)
    setTimeout(() => {
        if (!hasLoaded) {
            hasLoaded = true;
            iframe.style.opacity = '1';
            hideLoadingScreen();
        }
    }, 3000);
    
    // Update title
    updateTitle(route);
}

/* ===================================
   Helper Functions
   =================================== */

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
    }
}

function updateTitle(route) {
    const titles = {
        'vi': 'Giới thiệu sản phẩm',
        'en': 'Product Introduction',
        'vi-en': 'Product Introduction (EN-VN)',
        'vi_en': 'Product Introduction (EN-VN)',
        've_en': 'Product Introduction (EN-VN)',
        'adgmin': 'ADGMIN Product Introduction',
        'adgmin_video': 'ADGMIN Product Introduction + Video'
    };
    document.title = titles[route] || 'PDF Viewer';
}

/* ===================================
   Error Handling
   =================================== */

window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
    hideLoadingScreen();
});