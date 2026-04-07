# Blue Swan Mobile App - Struktur Folder

Dokumentasi ini menjelaskan fungsi dan kegunaan dari setiap folder dalam project Blue Swan Mobile App.

## 📁 Root Level Files

- **`package.json`** - Daftar dependencies dan scripts npm untuk project
- **`app.json`** - Konfigurasi aplikasi Expo
- **`tsconfig.json`** - Konfigurasi TypeScript compiler
- **`expo-env.d.ts`** - Type definitions untuk Expo

### Dokumentasi

- **`README.md`** - Dokumentasi utama project
- **`QUICKSTART.md`** - Panduan cepat memulai development
- **`DEVELOPMENT.md`** - Panduan development lengkap
- **`NAVIGATION.md`** - Dokumentasi struktur navigasi aplikasi
- **`API_CONFIG.md`** - Dokumentasi konfigurasi API
- **`POPPINS_FONT_GUIDE.md`** - Panduan penggunaan font Poppins
- **`EXAMPLES.tsx`** - Contoh-contoh kode dan komponen

## 📱 Platform Native

### `/android`

Build files dan konfigurasi untuk platform Android.

- **`build.gradle`** - Konfigurasi build Gradle level project
- **`settings.gradle`** - Settings Gradle project
- **`gradle.properties`** - Properties Gradle
- **`app/`** - Folder aplikasi Android utama
  - **`build.gradle`** - Konfigurasi build level app
  - **`src/`** - Source code Android native
- **`build/`** - Output build hasil compile (generated)

### `/ios`

Build files dan konfigurasi untuk platform iOS.

- **`Podfile`** - Dependency manager untuk iOS (CocoaPods)
- **`Podfile.properties.json`** - Properti konfigurasi Podfile
- **`blueswanmobileapp/`** - Folder aplikasi iOS utama
  - **`AppDelegate.swift`** - Entry point aplikasi iOS
  - **`Info.plist`** - Konfigurasi metadata aplikasi iOS
  - **`blueswanmobileapp.entitlements`** - Capabilities dan permissions iOS
  - **`SplashScreen.storyboard`** - Splash screen iOS
  - **`Images.xcassets/`** - Asset catalog untuk images dan icons
- **`blueswanmobileapp.xcodeproj/`** - Xcode project files

## 🎨 Assets

### `/assets`

Semua asset statis aplikasi (gambar, font, icon).

- **`fonts/`** - Font files (Poppins family)
- **`images/`** - Gambar dan ilustrasi aplikasi
  - **`tabIcons/`** - Icon untuk tab navigation
- **`expo.icon/`** - Konfigurasi dan asset untuk app icon
  - **`icon.json`** - Konfigurasi icon generator
  - **`Assets/`** - Source icon files

## 💻 Source Code (`/src`)

### `/src/app`

**📍 File-file routing Expo Router.**
Setiap file di folder ini merepresentasikan satu screen/route dalam aplikasi.

- **`_layout.tsx`** - Root layout, setup fonts, theme, dan navigation stack
- **`index.tsx`** - Landing/welcome screen (route: `/`)
- **`home.tsx`** - Home screen utama
- **`login.tsx`** - Halaman login
- **`register.tsx`** - Halaman registrasi
- **`forgot-password.tsx`** - Halaman lupa password
- **`edit-profile.tsx`** - Halaman edit profile user
- **`change-password.tsx`** - Halaman ganti password
- **`about-us.tsx`** - Halaman tentang kami
- **`terms-conditions.tsx`** - Halaman syarat dan ketentuan
- **`gallery.tsx`** - Halaman gallery foto
- **`tours.tsx`** - Halaman daftar tour/destinations
- **`transportation.tsx`** - Halaman daftar transportasi
- **`transport-detail.tsx`** - Detail transportasi
- **`package-detail.tsx`** - Detail paket tour
- **`promo.tsx`** - Halaman daftar promo
- **`promo-detail.tsx`** - Detail promo
- **`booking-detail.tsx`** - Detail booking

### `/src/screens`

**📱 Komponen Screen yang digunakan oleh routing.**
Berisi logic dan UI utama untuk setiap screen. File di `/src/app` mengimport komponen dari folder ini.

- **`home-screen.tsx`** - UI dan logic home screen
- **`login-screen.tsx`** - UI dan logic login
- **`register-screen.tsx`** - UI dan logic registrasi
- **`profile-screen.tsx`** - UI dan logic profile user
- **`bookings-screen.tsx`** - UI daftar booking user
- **`destinations-screen.tsx`** - UI daftar destinasi
- **`tours-screen.tsx`** - UI daftar tour
- **`transportation-screen.tsx`** - UI daftar transportasi
- **`gallery-screen.tsx`** - UI gallery
- **`promo-screen.tsx`** - UI daftar promo
- **`promo-detail-screen.tsx`** - UI detail promo
- **`booking-detail-screen.tsx`** - UI detail booking
- **`about-us-screen.tsx`** - UI about us
- **`terms-conditions-screen.tsx`** - UI terms & conditions
- **`edit-profile-screen.tsx`** - UI edit profile
- **`change-password-screen.tsx`** - UI change password
- **`forgot-password-screen.tsx`** - UI forgot password

### `/src/components`

**🧩 Komponen reusable yang digunakan di berbagai screen.**

- **`poppins-text.tsx`** - Text component wrapper dengan font Poppins
- **`themed-text.tsx`** - Text component dengan theme support
- **`themed-view.tsx`** - View component dengan theme support
- **`animated-icon.tsx`** - Icon dengan animasi (native)
- **`animated-icon.web.tsx`** - Icon dengan animasi (web version)
- **`animated-tab-bar.tsx`** - Custom animated tab bar
- **`external-link.tsx`** - Component untuk external links
- **`hint-row.tsx`** - Component untuk menampilkan hint/tips
- **`web-badge.tsx`** - Badge component untuk web
- **`ui/`** - Sub-folder untuk UI components yang lebih spesifik

### `/src/services`

**🔌 Layer komunikasi dengan backend API.**
Semua HTTP requests dan integrasi API berada di sini.

- **`api-client.ts`** - Axios instance dan konfigurasi base API client
- **`auth-service.ts`** - Service untuk authentication (login, register, logout)
- **`booking-service.ts`** - Service untuk booking operations
- **`about-service.ts`** - Service untuk data about us, terms, dll
- _...services lainnya untuk destinations, tours, transportation, promo, dll_

### `/src/store`

**🗄️ State management global (Redux/Zustand/Context).**
Mengelola state aplikasi yang perlu diakses dari berbagai screen.

- Biasanya berisi:
  - Store configuration
  - Slices/reducers untuk different features
  - Selectors
  - Actions

### `/src/types`

**📝 TypeScript type definitions dan interfaces.**
Definisi tipe untuk data models, API responses, props, dll.

- Interface untuk User, Booking, Tour, Transportation, etc.
- API request/response types
- Component props types
- Utility types

### `/src/constants`

**⚙️ Constants dan konfigurasi aplikasi.**

- **`theme.ts`** - Theme configuration (colors, spacing, typography)
- Biasanya juga berisi:
  - API endpoints
  - App config values
  - Static data

### `/src/hooks`

**🎣 Custom React hooks.**
Logic reusable yang dapat digunakan di berbagai components.

- **`use-async.ts`** - Hook untuk handling async operations
- **`use-color-scheme.ts`** - Hook untuk dark/light mode (native)
- **`use-color-scheme.web.ts`** - Hook untuk dark/light mode (web)
- **`use-theme.ts`** - Hook untuk mengakses theme
- **`use-destinations.ts`** - Hook untuk fetching/managing destinations data
- **`use-tours.ts`** - Hook untuk fetching/managing tours data
- **`use-search.ts`** - Hook untuk search functionality

### `/src/global.css`

**🎨 Global CSS styles** (untuk web support jika menggunakan NativeWind/similar).

## 🛠️ Scripts

### `/scripts`

Utility scripts untuk development dan maintenance.

- **`reset-project.js`** - Script untuk reset project ke initial state

## 📊 Flow Data

```
┌─────────────┐
│   Screens   │ ← UI Layer
└──────┬──────┘
       │ menggunakan
       ↓
┌─────────────┐
│   Hooks     │ ← Business Logic
└──────┬──────┘
       │ mengakses
       ↓
┌─────────────┐
│  Services   │ ← API Communication
└──────┬──────┘
       │ menggunakan
       ↓
┌─────────────┐
│ API Client  │ ← HTTP Client
└─────────────┘

     ↕️
┌─────────────┐
│    Store    │ ← Global State Management
└─────────────┘
```

## 🚀 Quick Reference

**Ingin menambahkan screen baru?**

1. Buat file di `/src/app/` untuk routing
2. Buat komponen screen di `/src/screens/`
3. Tambahkan route di `/src/app/_layout.tsx`

**Ingin menambahkan API endpoint baru?**

1. Tambahkan service function di `/src/services/`
2. Definisikan types di `/src/types/`
3. Buat custom hook di `/src/hooks/` jika perlu

**Ingin menambahkan komponen reusable?**

1. Buat file di `/src/components/` atau `/src/components/ui/`
2. Export dan gunakan di screens yang memerlukan

---

**📝 Note**: Folder `build/` dan file-file generated tidak perlu di-commit ke Git. Pastikan sudah ada di `.gitignore`.
