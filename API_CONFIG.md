# API Configuration Guide

## Network Request Failed Error

Jika Anda mendapatkan error "Network request failed", berikut solusinya:

### 1. Konfigurasi API Base URL

File: `src/services/api-client.ts`

**Untuk iOS Simulator:**

- Gunakan `http://localhost:3000`
- Sudah otomatis dikonfigurasi

**Untuk Android Emulator:**

- Gunakan `http://10.0.2.2:3000` (untuk Android Virtual Device)
- Sudah otomatis dikonfigurasi
- Jika tidak bekerja, ganti dengan IP address komputer Anda

**Untuk Device Fisik:**

- Gunakan IP address komputer Anda di network yang sama
- Contoh: `http://192.168.1.100:3000`
- Cek IP komputer dengan:
  - macOS: `ifconfig | grep "inet "` atau System Preferences > Network
  - Windows: `ipconfig`

### 2. Cara Mengubah API URL

Edit file `src/services/api-client.ts`, pada bagian:

```typescript
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === "android") {
      // Ganti dengan IP komputer Anda jika perlu
      return "http://192.168.1.100:3000";
    }
    return "http://localhost:3000";
  }
  return "https://api.blueswan.com";
};
```

### 3. Pastikan Backend Server Berjalan

- Cek apakah backend server sudah running di port 3000
- Test dengan browser: `http://localhost:3000/api/auth/login`
- Atau gunakan: `curl http://localhost:3000/api/auth/login`

### 4. Troubleshooting

**Error masih muncul?**

1. Restart Metro bundler: `npm start -- --reset-cache`
2. Pastikan backend server berjalan
3. Cek firewall tidak memblokir koneksi
4. Pastikan device dan komputer di network yang sama (untuk device fisik)
5. Test koneksi dengan Postman atau curl terlebih dahulu

**API Endpoints yang tersedia:**

- POST `/api/auth/register` - Register user baru
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

### 5. Development Tips

**Menggunakan ngrok untuk testing:**

```bash
ngrok http 3000
```

Kemudian gunakan URL ngrok di API configuration.

**Menggunakan IP static:**
Lebih mudah jika menggunakan IP static untuk development.
