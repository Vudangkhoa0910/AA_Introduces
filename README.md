# PDF Viewer Application

A modern, responsive single-page application for displaying PDF documents with clean URLs perfect for QR code sharing.

## 🌟 Features

- **Clean URLs**: Three separate routes for QR code generation
  - `/vi` - Vietnamese document
  - `/en` - English document  
  - `/vi-en` - Bilingual document
  
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Dark/Light Theme**: Automatic theme switching with manual toggle
- **PDF Actions**: Download, print, and fullscreen viewing
- **Fast Loading**: Optimized performance with lazy loading
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation

## 📱 Routes for QR Codes

Generate QR codes for these URLs:

1. **Vietnamese**: `https://your-site.netlify.app/vi`
2. **English**: `https://your-site.netlify.app/en`
3. **Bilingual**: `https://your-site.netlify.app/vi-en`

## 🚀 Deployment

### Deploy to Netlify

1. **Via Netlify CLI**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy
   netlify deploy --prod
   ```

2. **Via Drag & Drop**:
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag the entire project folder
   - Done!

3. **Via Git**:
   - Push to GitHub/GitLab/Bitbucket
   - Connect repository in Netlify dashboard
   - Auto-deploy on push

## 📂 Project Structure

```
QR_Intro/
├── index.html          # Main HTML file
├── styles.css          # Responsive CSS styles
├── script.js           # JavaScript routing & functionality
├── netlify.toml        # Netlify configuration
├── README.md           # This file
└── pdfs/               # PDF documents folder
    ├── [EN-VN] Product Introduction.pdf
    ├── [EN] Product Introduction.pdf
    └── [VN] Product Introduction.pdf
```

## 🎨 Customization

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --primary-dark: #1d4ed8;
    /* ... more variables */
}
```

### Add More Routes

1. Update `APP_CONFIG` in `script.js`
2. Add corresponding HTML section in `index.html`
3. Add redirect rule in `netlify.toml`

## 🔧 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for easy PDF sharing via QR codes