# PDF Viewer Application

Web đơn giản để hiển thị PDF files toàn màn hình, tương thích hoàn hảo với mobile và desktop. Dùng để thay thế Google Drive khi share file qua QR code.

## 🌟 Tính năng

- ✅ **Hiển thị PDF toàn màn hình** - Không có navigation, header hay text thừa
- ✅ **Responsive 100%** - Tự động tương thích điện thoại, tablet, máy tính
- ✅ **3 Routes riêng biệt** - Dành cho QR code scanning
- ✅ **Loading animation** - Hiệu ứng load đẹp mắt
- ✅ **Tốc độ nhanh** - Tối ưu hiệu năng

## 📱 Routes cho QR Codes

Sau khi deploy lên Netlify, bạn sẽ có 3 links:

1. **Tiếng Việt**: `https://alphaasimovdocs.netlify.app/vi`
2. **English**: `https://alphaasimovdocs.netlify.app/en`
3. **Song ngữ**: `https://alphaasimovdocs.netlify.app/vi-en`

Mỗi link hiển thị một file PDF khác nhau, hoàn hảo để tạo QR code riêng biệt.

## 🚀 Deploy lên Netlify

### Cách 1: Drag & Drop (Đơn giản nhất)

1. Vào [Netlify Drop](https://app.netlify.com/drop)
2. Kéo thả toàn bộ thư mục project
3. Xong! URL sẽ có dạng: `https://your-site-name.netlify.app`

### Cách 2: Netlify CLI

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Cách 3: Từ Git Repository

1. Push code lên GitHub/GitLab
2. Vào Netlify Dashboard → New site from Git
3. Chọn repository
4. Deploy settings để mặc định
5. Click "Deploy site"

## 📂 Cấu trúc Project

```
QR_Intro/
├── index.html          # HTML tối giản
├── styles.css          # CSS responsive
├── script.js           # JavaScript routing
├── netlify.toml        # Netlify config
├── README.md           # File này
└── pdfs/               # Thư mục chứa PDF
    ├── [VN] Product Introduction.pdf
    ├── [EN] Product Introduction.pdf
    └── [EN-VN] Product Introduction.pdf
```

## 🔧 Thay đổi PDF Files

1. Mở thư mục `pdfs/`
2. Thay thế các file PDF (giữ nguyên tên file)
3. Hoặc đổi tên file và cập nhật trong `script.js`:

```javascript
const PDF_ROUTES = {
    'vi': './pdfs/[VN] Product Introduction.pdf',
    'en': './pdfs/[EN] Product Introduction.pdf',
    'vi-en': './pdfs/[EN-VN] Product Introduction.pdf'
};
```

## 📱 Tạo QR Code

Sau khi deploy, sử dụng các tool này để tạo QR code:

- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)
- [Free QR](https://www.free-qr.com/)

Paste link vào (ví dụ: `https://alphaasimovdocs.netlify.app/vi`) và tạo QR code.

## 🎨 Tùy chỉnh màu Loading

Trong file `styles.css`, dòng 32-33:

```css
.loading-screen {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Thay đổi màu gradient theo ý bạn.

## 🌐 Tương thích trình duyệt

- ✅ Chrome/Edge (Mobile & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Firefox (Mobile & Desktop)
- ✅ Samsung Internet
- ✅ UC Browser

## 📄 License

MIT License - Tự do sử dụng cho mọi mục đích.

---

**Built by VuDangKhoa** | Dành cho Alpha Asimov Documentation