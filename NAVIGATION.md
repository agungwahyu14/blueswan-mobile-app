# Navigation Structure

## Overview

Aplikasi Blue Swan menggunakan kombinasi Expo Router untuk navigasi utama dan React Navigation Bottom Tabs untuk tabs di dalam halaman home.

## Struktur Routing

### Root Level (src/app/)

```
├── _layout.tsx         → Stack Navigator (root)
├── index.tsx           → Entry point dengan redirect logic
├── home.tsx            → Home screen dengan bottom tabs
├── login.tsx           → Login screen
├── register.tsx        → Register screen
└── about-us.tsx        → About us screen
```

### Screens (src/screens/)

```
├── home-screen.tsx          → Bottom tabs container (Jelajah, Tur, Pesanan, Profil)
├── destinations-screen.tsx  → Tab: Jelajah (Destinasi)
├── tours-screen.tsx         → Tab: Tur (Tour Packages)
├── bookings-screen.tsx      → Tab: Pesanan (User's bookings)
├── profile-screen.tsx       → Tab: Profil (User profile & settings)
├── login-screen.tsx         → Standalone login page
├── register-screen.tsx      → Standalone register page
└── about-us-screen.tsx      → About us page
```

## Flow Navigasi

### 1. App Launch

```
index.tsx
  ├─ isAuthenticated ✅ → /home (with tabs)
  └─ isAuthenticated ❌ → /login
```

### 2. Login Flow

```
/login → Login berhasil → /home (dengan 4 tabs)
```

### 3. Register Flow

```
/register → Register berhasil → /home (dengan 4 tabs)
```

### 4. Home Screen (Bottom Tabs)

```
/home
  ├─ Tab 1: Jelajah (DestinationsScreen)
  ├─ Tab 2: Tur (ToursScreen)
  ├─ Tab 3: Pesanan (BookingsScreen)
  └─ Tab 4: Profil (ProfileScreen)
```

### 5. Logout Flow

```
Profil Tab → Logout → /login
```

## Tab Configuration

### Bottom Tabs (home-screen.tsx)

- **Navigator**: React Navigation Bottom Tabs
- **Active Color**: Accent green (#32cc0f)
- **Inactive Color**: Primary blue (#11468F)
- **Platform Specific**:
  - iOS: Height 85px, padding bottom 25px (untuk notch)
  - Android: Height 65px, padding bottom 10px

### Tabs Details

#### 1. Jelajah (Destinasi)

- Icon: compass (Ionicons)
- Screen: DestinationsScreen
- Fungsi: Explore destinations dan popular places

#### 2. Tur (Tour Packages)

- Icon: map (Ionicons)
- Screen: ToursScreen
- Fungsi: Browse dan cari tour packages

#### 3. Pesanan (Bookings)

- Icon: calendar (Ionicons)
- Screen: BookingsScreen
- Fungsi: Lihat history dan status bookings user

#### 4. Profil (Profile)

- Icon: person (Ionicons)
- Screen: ProfileScreen
- Fungsi: User profile, settings, dan logout

## Removed Components

File-file berikut telah dihapus karena tidak digunakan:

- ❌ `src/components/app-tabs.tsx` (diganti dengan home-screen.tsx)
- ❌ `src/components/app-tabs.web.tsx`
- ❌ `src/app/welcome.tsx` (tidak digunakan)
- ❌ `src/screens/welcome-screen.tsx`
- ❌ `src/app/bookings.tsx` (duplikat)
- ❌ `src/app/explore.tsx` (duplikat)
- ❌ `src/app/profile.tsx` (duplikat)
- ❌ `src/app/(tabs)/` folder (tidak digunakan)

## Notes

- **Authentication Guard**: index.tsx menghandle redirect berdasarkan auth status
- **Single Tabs Source**: Hanya home-screen.tsx yang menghandle tabs navigation
- **No Conflicts**: Tidak ada duplikasi tabs handler
- **Clean Structure**: Semua unused files sudah dihapus
