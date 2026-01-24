# 🔧 Hướng dẫn sửa lỗi: auth/configuration-not-found

## ❌ Lỗi hiện tại
```
FirebaseError: Firebase: Error (auth/configuration-not-found)
CONFIGURATION_NOT_FOUND
```

## 🔍 Nguyên nhân
Lỗi này xảy ra khi Firebase Authentication không tìm thấy cấu hình cho Google Sign-in. Thường do:

1. **Google Sign-in provider chưa được bật** trong Firebase Console
2. **API Key không đúng** hoặc không khớp với project
3. **Auth Domain không đúng** trong file `.env.local`
4. **Project ID không đúng** trong file `.env.local`

---

## ✅ CÁCH KHẮC PHỤC (Làm theo từng bước)

### Bước 1: Kiểm tra và Bật Google Sign-in Provider

1. Mở **Firebase Console**: https://console.firebase.google.com
2. Chọn project của bạn (ví dụ: `pulavocab`)
3. Vào **Authentication** (trong menu bên trái)
4. Click tab **Sign-in method**
5. Tìm **Google** trong danh sách providers
6. Click vào **Google**
7. **BẬT** toggle "Enable" (nếu chưa bật)
8. Nhập **Project support email** (email của bạn)
9. Click **Save**

⚠️ **QUAN TRỌNG**: Phải bật Google Sign-in provider trước khi có thể đăng nhập!

---

### Bước 2: Kiểm tra Authorized Domains

1. Vẫn trong **Firebase Console** → **Authentication**
2. Click tab **Settings**
3. Scroll xuống phần **Authorized domains**
4. Đảm bảo có các domain sau:
   - ✅ `localhost`
   - ✅ `127.0.0.1`
   - ✅ `pulavocab.firebaseapp.com` (nếu có)
5. Nếu thiếu, click **Add domain** và thêm `localhost` và `127.0.0.1`

---

### Bước 3: Kiểm tra lại file `.env.local`

1. Mở file `.env.local` ở thư mục gốc của dự án
2. Đảm bảo có đầy đủ các biến sau:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (phải khớp với Firebase project)
VITE_FIREBASE_AUTH_DOMAIN=pulavocab.firebaseapp.com (hoặc project-id.firebaseapp.com)
VITE_FIREBASE_PROJECT_ID=pulavocab (hoặc project-id của bạn)
VITE_FIREBASE_APP_ID=1:... (phải khớp với Firebase project)
```

3. **Lấy các giá trị chính xác từ Firebase Console**:
   - Vào **Project Settings** (biểu tượng ⚙️ bên cạnh "Project Overview")
   - Scroll xuống phần **Your apps**
   - Chọn **Web app** của bạn (hoặc tạo mới nếu chưa có)
   - Copy các giá trị:
     - `apiKey` → `VITE_FIREBASE_API_KEY`
     - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
     - `projectId` → `VITE_FIREBASE_PROJECT_ID`
     - `appId` → `VITE_FIREBASE_APP_ID`

⚠️ **LƯU Ý**: 
- Không có khoảng trắng quanh dấu `=`
- Không có dấu ngoặc kép thừa
- Giá trị phải chính xác 100%

---

### Bước 4: Khởi động lại server

Sau khi sửa file `.env.local`:

1. **Dừng server** (Ctrl+C trong terminal)
2. **Khởi động lại**: `npm run dev`
3. **Refresh trình duyệt** (Ctrl+Shift+R để hard refresh)

---

### Bước 5: Kiểm tra lại

1. Mở ứng dụng trong trình duyệt
2. Xem phần **Firebase Status**:
   - Nếu hiển thị "Firebase: READY" (màu xanh) = ✅ Cấu hình đúng
   - Nếu hiển thị "Firebase: NOT CONFIGURED" (màu đỏ) = ❌ Kiểm tra lại `.env.local`
3. Click **"Đăng nhập Google"**
4. Nếu vẫn lỗi, xem thông báo lỗi mới và làm theo hướng dẫn

---

## 🐛 Debug thêm

Nếu vẫn không được, kiểm tra:

1. **Console của trình duyệt** (F12):
   - Xem có lỗi gì khác không
   - Copy toàn bộ lỗi và gửi cho tôi

2. **Firebase Console**:
   - Authentication → Users: Xem có user nào đã đăng nhập chưa
   - Authentication → Sign-in method → Google: Đảm bảo đã bật

3. **File `.env.local`**:
   - Đảm bảo file ở đúng thư mục gốc (cùng cấp với `package.json`)
   - Đảm bảo không có lỗi cú pháp

---

## 📝 Checklist

Trước khi thử lại, đảm bảo:

- [ ] Google Sign-in provider đã được BẬT trong Firebase Console
- [ ] `localhost` và `127.0.0.1` đã được thêm vào Authorized domains
- [ ] File `.env.local` có đầy đủ 4 biến: API_KEY, AUTH_DOMAIN, PROJECT_ID, APP_ID
- [ ] Các giá trị trong `.env.local` khớp với Firebase Console
- [ ] Đã khởi động lại server sau khi sửa `.env.local`
- [ ] Đã refresh trình duyệt (hard refresh: Ctrl+Shift+R)

---

## 💡 Lưu ý quan trọng

- **API Key** phải khớp với project Firebase của bạn
- **Auth Domain** thường có dạng: `project-id.firebaseapp.com`
- **Project ID** là tên project của bạn (ví dụ: `pulavocab`)
- Sau khi sửa `.env.local`, **BẮT BUỘC** phải khởi động lại server

---

Nếu vẫn gặp vấn đề sau khi làm theo các bước trên, vui lòng cung cấp:
1. Screenshot của Firebase Console → Authentication → Sign-in method
2. Nội dung file `.env.local` (ẩn các giá trị nhạy cảm)
3. Lỗi trong Console (F12)
