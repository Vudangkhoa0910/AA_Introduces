/* ===================================
   PDF.js Viewer - All Pages Rendering
   Responsive & Mobile-Friendly
   =================================== */

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const PDF_ROUTES = {
    'vi': 'pdfs/[VN] Product Introduction.pdf',
    'en': 'pdfs/[EN] Product Introduction.pdf',
    'vi-en': 'pdfs/[EN-VN] Product Introduction.pdf',
    'vi_en': 'pdfs/[EN-VN] Product Introduction.pdf',
    've_en': 'pdfs/[EN-VN] Product Introduction.pdf'
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
   PDF Loading & Rendering
   =================================== */

async function loadPDF(route) {
    const pdfUrl = PDF_ROUTES[route];
    
    if (!pdfUrl) {
        console.error(`Route '${route}' not found, loading default`);
        loadPDF(DEFAULT_ROUTE);
        return;
    }
    
    const canvas = document.getElementById('pdf-canvas');
    const container = document.getElementById('pdf-container');
    
    if (!canvas) return;
    
    try {
        // Load PDF document
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        // Get first page to calculate scale
        const firstPage = await pdf.getPage(1);
        const viewport = firstPage.getViewport({ scale: 1 });
        
        // Calculate optimal scale for responsive display
        const containerWidth = window.innerWidth;
        const scale = containerWidth / viewport.width;
        const scaledViewport = firstPage.getViewport({ scale });
        
        // Calculate total canvas height for all pages
        const totalHeight = scaledViewport.height * pdf.numPages;
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = totalHeight;
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
        const context = canvas.getContext('2d');
        
        // Render all pages sequentially
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const pageViewport = page.getViewport({ scale });
            
            // Calculate Y offset for current page
            const yOffset = (pageNum - 1) * scaledViewport.height;
            
            // Render page at correct vertical position
            await page.render({
                canvasContext: context,
                viewport: pageViewport,
                transform: [1, 0, 0, 1, 0, yOffset]
            }).promise;
        }
        
        // Show container and hide loading screen
        container.style.opacity = '1';
        hideLoadingScreen();
        
        // Update title
        updateTitle(route);
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        hideLoadingScreen();
    }
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
        've_en': 'Product Introduction (EN-VN)'
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