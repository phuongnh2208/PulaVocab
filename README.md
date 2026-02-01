# PulaVocab

Ứng dụng học từ vựng thông minh sử dụng Google Gemini AI để tạo câu tiếng Anh từ keywords, dịch sang tiếng Việt và highlight các thành phần ngữ pháp. Hỗ trợ lưu trữ local và cloud sync với Firebase.

## Giới thiệu

PulaVocab là một công cụ học từ vựng tiếng Anh hiện đại được xây dựng bằng React + TypeScript + Vite. Ứng dụng sử dụng Google Gemini AI để:
- Tạo câu tiếng Anh từ keywords của bạn
- Dịch sang tiếng Việt
- Phân tích và highlight các thành phần ngữ pháp (subject, verb, object, etc.)
- Lưu trữ và quản lý các câu đã tạo
- Đồng bộ dữ liệu qua Firebase (optional)

## Công nghệ sử dụng

### Core Stack
- **React 18.3.1** - UI library
- 
- **TypeScript 5.6.3** - Type-safe JavaScript
- **Vite 5.4.10** - Build tool và dev server
- **Tailwind CSS 3.4.10** - Utility-first CSS framework

### AI & Backend
- **Google Gemini API** - AI sentence generation
- **Firebase 12.8.0** - Cloud storage và authentication
  - Firestore - NoSQL database
  - Authentication - Google OAuth

### UI Components
- **lucide-react 0.471.0** - Icon library
- Custom components (Button, Tag, Sidebar, MobileNav, ResultCard)

### Development Tools
- **@vitejs/plugin-react 4.3.3** - React plugin cho Vite
- **PostCSS 8.4.38** - CSS processing
- **Autoprefixer 10.4.20** - CSS vendor prefixing

### Language Composition
- **TypeScript** - 97.7%
- **JavaScript** - 1.1%
- **Other** - 1.2%

## Tính năng

### Core Features
- [x] Tạo câu tiếng Anh từ keywords với AI
- [x] Dịch tự động sang tiếng Việt
- [x] Phân tích và highlight ngữ pháp
- [x] Lưu trữ local với localStorage
- [x] Quản lý danh sách câu đã lưu
- [x] Dark/Light mode support

### Cloud Features (Optional)
- [x] Đăng nhập với Google
- [x] Lưu trữ cloud với Firestore
- [x] Đồng bộ dữ liệu giữa các thiết bị
- [x] Offline-first với sync

### UI/UX Features
- [x] Responsive design (desktop & mobile)
- [x] Desktop sidebar navigation
- [x] Mobile bottom navigation
- [x] Grammar type labels (subject, verb, object, etc.)
- [x] Copy to clipboard
- [x] Delete confirmation

## Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** hoặc **yarn**
- **PowerShell** (Windows users)
- **Google Gemini API key** (required)
- **Firebase project** (optional, for cloud features)

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/pulapily2208/PulaVocab.git
cd PulaVocab
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình environment variables

#### Cấu hình cơ bản (chỉ local storage)

Sao chép file `.env.example` thành `.env.local`:

```bash
# Windows PowerShell
copy .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Chỉnh sửa `.env.local` và thêm Gemini API key của bạn:

```env
# Google Gemini
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
# Optional: override model name
VITE_GEMINI_MODEL=gemini-2.5-flash-preview-09-2025
```

#### Cấu hình Firebase (optional, cho cloud sync)

Nếu muốn sử dụng cloud storage và Google login, thêm Firebase config:

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your_app_id
# Optional
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Lấy Google Gemini API Key

1. Truy cập [Google AI Studio](https://aistudio.google.com/apikey)
2. Đăng nhập với Google account
3. Click "Get API key" hoặc "Create API key"
4. Copy API key và paste vào `.env.local`

### 5. Setup Firebase (Optional)

Nếu muốn sử dụng cloud features:

1. Tạo Firebase project tại [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**:
   - Chọn production mode hoặc test mode
   - Chọn location gần bạn nhất
3. Enable **Authentication**:
   - Vào Authentication → Sign-in method
   - Enable **Google** provider
   - Thêm authorized domains: `localhost`, `127.0.0.1`
4. Lấy Firebase config:
   - Project Settings → Your apps → Web app
   - Copy config values vào `.env.local`

#### Firestore Security Rules

Cấu hình security rules để chỉ user được phép truy cập dữ liệu của mình:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/cards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Chạy ứng dụng

### Development Mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build Production

```bash
npm run build
```

Build output sẽ nằm trong thư mục `dist/`

### Preview Production Build

```bash
npm run preview
```

## Cấu trúc dự án

```
PulaVocab/
├── .github/                    # GitHub workflows và configs
├── .vscode/                    # VS Code settings
├── dist/                       # Build output
├── src/
│   ├── components/            # React components
│   │   ├── Button.tsx         # Shared button component
│   │   ├── Tag.tsx            # Grammar type label
│   │   ├── Sidebar.tsx        # Desktop navigation
│   │   ├── MobileNav.tsx      # Mobile bottom nav
│   │   └── ResultCard.tsx     # Generated sentence card
│   ├── lib/                   # Utilities và libraries
│   │   ├── firebase.ts        # Firebase initialization
│   │   └── gemini.ts          # Gemini API integration
│   ├── App.tsx                # Main application component
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles (Tailwind)
├── .env.example               # Environment variables template
├── .env.local                 # Your actual env vars (not committed)
├── index.html                 # HTML entry point
├── package.json               # Dependencies và scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── FIX_CONFIGURATION_NOT_FOUND.md  # Troubleshooting guide
└── README.md                  # This file
```

## Sử dụng

### 1. Tạo câu từ keyword

1. Nhập keyword vào ô input (ví dụ: "learn", "travel", "study")
2. Click nút "Generate" hoặc nhấn Enter
3. AI sẽ tạo câu tiếng Anh, dịch tiếng Việt và phân tích ngữ pháp

### 2. Xem phân tích ngữ pháp

Các thành phần ngữ pháp được highlight với màu khác nhau:
- **Subject** (Chủ ngữ) - màu xanh
- **Verb** (Động từ) - màu đỏ
- **Object** (Tân ngữ) - màu vàng
- **Adjective** (Tính từ) - màu tím
- **Adverb** (Trạng từ) - màu cam
- **Preposition** (Giới từ) - màu xanh lá

### 3. Lưu và quản lý câu

- Click icon "Save" để lưu câu
- Câu được lưu trong localStorage (hoặc Firestore nếu đã login)
- Xem lại trong tab "Saved" hoặc "History"
- Click icon "Delete" để xóa câu

### 4. Đăng nhập (Optional)

- Click "Sign in with Google" ở sidebar
- Đăng nhập với Google account
- Dữ liệu sẽ được đồng bộ lên Firestore

## Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development server với hot reload |
| `npm run build` | Build production với TypeScript check |
| `npm run preview` | Preview production build locally |

## Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key | - |
| `VITE_GEMINI_MODEL` | No | Gemini model name | `gemini-2.5-flash-preview-09-2025` |
| `VITE_FIREBASE_API_KEY` | No | Firebase API key | - |
| `VITE_FIREBASE_AUTH_DOMAIN` | No | Firebase Auth domain | - |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID | - |
| `VITE_FIREBASE_APP_ID` | No | Firebase app ID | - |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | Firebase Analytics ID | - |

## Data Storage

### Local Storage
- Key: `duo_vocab_ai`
- Format: JSON array of saved cards
- Persistent across browser sessions
- No login required

### Cloud Storage (Firestore)
- Collection: `users/{userId}/cards`
- Auto-sync khi đăng nhập
- Conflict resolution: last-write-wins
- Offline support với caching

## Troubleshooting

### Lỗi "Configuration not found"

Xem file [FIX_CONFIGURATION_NOT_FOUND.md](./FIX_CONFIGURATION_NOT_FOUND.md) để khắc phục.

### Lỗi API Key không hợp lệ

```
Error: Invalid API key
```

**Giải pháp:**
1. Kiểm tra API key trong `.env.local` đúng chưa
2. Không có khoảng trắng thừa
3. API key được enable tại Google AI Studio
4. Restart dev server sau khi sửa `.env.local`

### Lỗi Firebase Authentication

```
Error: Firebase: Error (auth/unauthorized-domain)
```

**Giải pháp:**
1. Vào Firebase Console → Authentication → Settings
2. Thêm domain vào Authorized domains:
   - `localhost`
   - `127.0.0.1`
   - Domain deploy của bạn

### Lỗi Firestore Permission

```
Error: Missing or insufficient permissions
```

**Giải pháp:**
1. Kiểm tra Firestore Security Rules
2. Đảm bảo user đã đăng nhập
3. Rules phải cho phép read/write với `userId` của user

### Build error với TypeScript

```bash
# Clear cache và rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Performance

- **First Load**: ~200KB (gzipped)
- **Tailwind CSS**: Tree-shaken, chỉ styles được dùng
- **Code splitting**: Dynamic imports cho Firebase
- **Image optimization**: Lazy loading
- **Caching**: Service worker cho offline support

## Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Opera >= 76

## Contributing

Đây là dự án cá nhân để học tập. Contributions are welcome!

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [ ] Thêm nhiều ngôn ngữ (Korean, Japanese, Chinese)
- [ ] Text-to-speech cho pronunciation
- [ ] Spaced repetition system
- [ ] Flashcard mode
- [ ] Export to Anki
- [ ] Mobile app (React Native)
- [ ] Collaborative learning
- [ ] Gamification với points và achievements

## License

Private project - For learning purposes only

## Liên hệ

- GitHub: [@pulapily2208](https://github.com/pulapily2208)
- Repository: [PulaVocab](https://github.com/pulapily2208/PulaVocab)

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) - AI sentence generation
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Vite](https://vitejs.dev/) - Lightning fast build tool

## Ghi chú

Dự án này được tạo ra để thực hành React, Làm quen TypeScript, và tích hợp AI/Firebase. Phù hợp cho việc học từ vựng tiếng Anh một cách thông minh và hiệu quả. Dự án được thực hành bằng vibe coding

**Happy Learning! 📚✨**
