# Poppins Font Implementation Guide

## ✅ Setup Complete

Font Poppins telah berhasil dikonfigurasi sebagai font global untuk aplikasi ini.

## 📦 Yang Sudah Diinstall

- `@expo-google-fonts/poppins` - Package font Poppins dari Expo Google Fonts

## 🔧 Perubahan yang Dilakukan

### 1. **\_layout.tsx**

Font Poppins dimuat menggunakan `useFonts` hook dengan variant:

- Poppins_300Light
- Poppins_400Regular
- Poppins_500Medium
- Poppins_600SemiBold
- Poppins_700Bold

### 2. **constants/theme.ts**

Ditambahkan:

- `FontFamilies` - Mapping font families untuk React Native
- `FontWeights` - Mapping font weights
- Updated `Fonts` object untuk menggunakan Poppins

### 3. **global.css**

Ditambahkan Google Fonts import dan set Poppins sebagai font default untuk web

### 4. **components/poppins-text.tsx**

Component Text wrapper yang otomatis menggunakan Poppins

## 🎨 Cara Menggunakan

### Metode 1: Menggunakan fontFamily langsung

```tsx
import { FontFamilies } from "@/constants/theme";

<Text style={{ fontFamily: FontFamilies.regular }}>
  Regular Text
</Text>

<Text style={{ fontFamily: FontFamilies.bold }}>
  Bold Text
</Text>

<Text style={{ fontFamily: FontFamilies.semibold }}>
  Semibold Text
</Text>
```

### Metode 2: Menggunakan StyleSheet

```tsx
import { FontFamilies } from "@/constants/theme";

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FontFamilies.bold,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FontFamilies.medium,
    color: Colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontFamily: FontFamilies.regular,
    color: Colors.text,
  },
});
```

### Metode 3: Menggunakan PoppinsText Component

```tsx
import { Text } from "@/components/poppins-text";

// Otomatis menggunakan Poppins Regular
<Text>Default text dengan Poppins</Text>

// Dengan custom font weight
<Text style={{ fontFamily: FontFamilies.bold }}>
  Bold text
</Text>
```

## 🔄 Font Weights yang Tersedia

| Weight | Font Family         | Usage                   |
| ------ | ------------------- | ----------------------- |
| 300    | Poppins_300Light    | Text ringan, subtitle   |
| 400    | Poppins_400Regular  | Text biasa, body        |
| 500    | Poppins_500Medium   | Text medium, label      |
| 600    | Poppins_600SemiBold | Heading kecil, button   |
| 700    | Poppins_700Bold     | Heading besar, emphasis |

## 📝 Best Practices

### Update Semua Text Components

Untuk konsistensi, update semua Text component di aplikasi Anda dengan menambahkan `fontFamily`:

**Sebelum:**

```tsx
<Text style={styles.title}>Judul</Text>
```

**Sesudah:**

```tsx
import { FontFamilies } from "@/constants/theme";

<Text style={[styles.title, { fontFamily: FontFamilies.bold }]}>Judul</Text>;
```

### Atau Update StyleSheet:

**Sebelum:**

```tsx
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
```

**Sesudah:**

```tsx
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: FontFamilies.bold, // Ganti fontWeight dengan fontFamily
  },
});
```

## ⚠️ Catatan Penting

1. **Jangan gunakan `fontWeight` bersamaan dengan `fontFamily`** - Di React Native, saat menggunakan custom fonts, gunakan font family yang berbeda untuk weight yang berbeda, bukan property `fontWeight`.

   ❌ **Salah:**

   ```tsx
   <Text style={{ fontFamily: FontFamilies.regular, fontWeight: "bold" }}>
     Text
   </Text>
   ```

   ✅ **Benar:**

   ```tsx
   <Text style={{ fontFamily: FontFamilies.bold }}>Text</Text>
   ```

2. **Web Support** - Font Poppins akan otomatis dimuat dari Google Fonts untuk versi web

3. **Performance** - Font sudah di-load saat aplikasi start, jadi tidak ada delay saat rendering text

## 🚀 Next Steps

1. Restart Metro bundler:

   ```bash
   npm start -- --reset-cache
   ```

2. Update semua file screen dan component untuk menggunakan Poppins

3. Test di berbagai platform (iOS, Android, Web)

## 🐛 Troubleshooting

### Font tidak muncul?

- Restart Metro bundler dengan `npm start -- --reset-cache`
- Clear app cache dan rebuild
- Pastikan semua font variant sudah ter-load di \_layout.tsx

### Font masih menggunakan system default?

- Pastikan sudah menambahkan `fontFamily` ke setiap Text component
- Cek console untuk error loading fonts
- Pastikan `fontsLoaded` sudah true sebelum render

## 📚 Resources

- [Expo Google Fonts](https://github.com/expo/google-fonts)
- [Poppins Font on Google Fonts](https://fonts.google.com/specimen/Poppins)
- [React Native Custom Fonts](https://docs.expo.dev/develop/user-interface/fonts/)
