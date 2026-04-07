# 📚 Dokumentasi Detail: Hooks, Store, Types, dan Constants

Dokumentasi lengkap untuk layer state management, custom hooks, type definitions, dan konfigurasi aplikasi Blue Swan Mobile App.

---

## 🎣 HOOKS (`/src/hooks`)

Custom React hooks untuk reusable logic dan business operations.

### **`use-async.ts`**

Hook generik untuk mengelola operasi asynchronous dengan state management built-in.

**🎯 Kegunaan:**

- Handle API calls dengan loading state otomatis
- Form submissions
- File uploads
- Operasi async lainnya

**📊 State yang dikelola:**

- `isLoading` - Status loading operasi
- `error` - Error message jika terjadi error
- `data` - Data hasil operasi async
- `execute()` - Function untuk trigger operasi
- `reset()` - Function untuk reset semua state

**💡 Contoh Penggunaan:**

```typescript
const { execute, isLoading, error, data } = useAsync(authService.login);

const handleLogin = async () => {
  try {
    await execute(email, password);
    // Success handling
  } catch (err) {
    // Error handling
  }
};
```

---

### **`use-destinations.ts`**

Hook khusus untuk fetching dan managing data destinations dengan pagination.

**🎯 Kegunaan:**

- Fetch daftar destinations dengan pagination
- Load more destinations (infinite scroll)
- Refresh destinations list
- Handle loading dan error states

**📊 Features:**

- Auto-fetch on mount (configurable)
- Pagination support
- Load more functionality
- Error handling

**📝 Options:**

```typescript
interface UseDestinationsOptions {
  autoFetch?: boolean; // Default: true
  page?: number; // Default: 1
  limit?: number; // Default: 20
}
```

**🔄 Returns:**

- `destinations` - Array of destination data
- `isLoading` - Loading state
- `error` - Error message
- `hasMore` - Apakah masih ada data untuk load more
- `fetchDestinations(page)` - Function untuk fetch
- `loadMore()` - Function untuk load more data
- `refresh()` - Function untuk refresh dari page 1

**💡 Contoh Penggunaan:**

```typescript
const { destinations, isLoading, loadMore, hasMore } = useDestinations({
  limit: 10,
});

// Render list dengan infinite scroll
```

---

### **`use-tours.ts`**

Hook khusus untuk fetching dan managing data tour packages dengan filtering.

**🎯 Kegunaan:**

- Fetch tour packages dengan filter
- Pagination support
- Search dan filter tours
- Refresh tours list

**📊 Features:**

- Filter by destination, category, price range
- Pagination dan load more
- Auto-fetch configurable
- Error handling

**💡 Similar API dengan `use-destinations.ts` tapi untuk tour packages.**

---

### **`use-search.ts`**

Hook generik untuk implement search functionality dengan debouncing.

**🎯 Kegunaan:**

- Search dengan debounce untuk performance
- Generic - bisa untuk search apapun
- Handle loading states
- Minimum query length validation

**📝 Configuration:**

```typescript
interface UseSearchOptions<T> {
  searchFn: (query: string) => Promise<T[]>; // Search function
  minQueryLength?: number; // Default: 2
  debounceMs?: number; // Default: 300ms
}
```

**🔄 Returns:**

- `results` - Search results array
- `isSearching` - Loading state saat search
- `error` - Error message
- `query` - Current search query
- `search(query)` - Function untuk trigger search
- `clearSearch()` - Function untuk clear results

**💡 Contoh Penggunaan:**

```typescript
const { results, isSearching, search } = useSearch({
  searchFn: async (query) => {
    return await tourService.searchTours(query);
  },
  minQueryLength: 3,
  debounceMs: 500,
});
```

---

### **`use-theme.ts`**

Hook untuk mengakses theme configuration aplikasi.

**🎯 Kegunaan:**

- Akses colors, fonts, spacing dari constants
- Type-safe theme access
- Konsisten di seluruh aplikasi

**💡 Contoh Penggunaan:**

```typescript
const { colors, fonts, spacing } = useTheme();

<Text style={{ color: colors.primary, fontFamily: fonts.bold }}>
  Hello World
</Text>
```

---

### **`use-color-scheme.ts` & `use-color-scheme.web.ts`**

Hook untuk detect dan manage dark/light mode.

**🎯 Kegunaan:**

- Detect system color scheme
- Support dark mode
- Platform-specific implementation (native vs web)

**💡 Contoh Penggunaan:**

```typescript
const colorScheme = useColorScheme();
// Returns: 'light' | 'dark'
```

---

## 🗄️ STORE (`/src/store`)

State management menggunakan **Zustand** untuk global state yang perlu diakses dari berbagai screens.

### **`index.ts`**

Export semua stores untuk kemudahan import:

```typescript
export { useAuthStore } from "./auth-store";
export { useBookingStore } from "./booking-store";
export { useExploreStore } from "./explore-store";
```

---

### **`auth-store.ts`**

**Global state untuk authentication dan user data.**

**🔐 State:**

```typescript
{
  user: User | null; // Current user data
  token: string | null; // JWT access token
  refreshToken: string | null; // Refresh token
  isAuthenticated: boolean; // Auth status
  isLoading: boolean; // Loading state
  error: string | null; // Error message
}
```

**⚙️ Actions:**

- `login(email, password)` - Login user dan set auth state
- `register(fullName, email, password, phone)` - Register user baru
- `logout()` - Logout dan clear auth state
- `refreshAuth()` - Refresh access token
- `getCurrentUser()` - Fetch current user data
- `clearError()` - Clear error message
- `setUser(user)` - Update user data

**💾 Persistence:**

- Menggunakan `zustand/middleware/persist`
- Data disimpan di AsyncStorage
- Auto-rehydrate on app start
- Token otomatis diset ke API client

**💡 Contoh Penggunaan:**

```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();

const handleLogin = async () => {
  await login(email, password);
  if (isAuthenticated) {
    navigation.navigate("Home");
  }
};
```

---

### **`booking-store.ts`**

**Global state untuk booking data dan operations.**

**📋 State:**

```typescript
{
  bookings: Booking[];              // User's all bookings
  upcomingBookings: Booking[];      // Upcoming bookings only
  currentBooking: Booking | null;   // Currently viewing booking
  isLoading: boolean;
  error: string | null;
}
```

**⚙️ Actions:**

- `fetchMyBookings()` - Fetch all user bookings
- `fetchUpcomingBookings()` - Fetch upcoming bookings saja
- `fetchBookingById(id)` - Fetch specific booking detail
- `createBooking(tourPackageId, startDate, numberOfTravelers, specialRequests)` - Create booking baru
- `cancelBooking(id)` - Cancel booking
- `clearError()` - Clear error
- `clearCurrentBooking()` - Clear current booking state

**💡 Contoh Penggunaan:**

```typescript
const { bookings, isLoading, fetchMyBookings, createBooking } =
  useBookingStore();

useEffect(() => {
  fetchMyBookings();
}, []);

const handleBooking = async () => {
  const newBooking = await createBooking(packageId, startDate, travelers);
  navigation.navigate("BookingDetail", { id: newBooking.id });
};
```

---

### **`explore-store.ts`**

**Global state untuk explore/discover features.**

**🗺️ State:**

- Destinations data
- Popular tours
- Filter states
- Search results

**⚙️ Actions:**

- Manage explore filters
- Cache popular destinations
- Handle search results

---

## 📝 TYPES (`/src/types`)

TypeScript type definitions dan interfaces untuk type safety.

### **`index.ts`**

Re-export semua types untuk import yang mudah:

```typescript
export * from "./api";
export * from "./user";
export * from "./booking";
export * from "./destination";
export * from "./tour";
export * from "./transport";
export * from "./category";
export * from "./package";
export * from "./home";
```

**💡 Import types:**

```typescript
import type { User, Booking, Destination } from "@/types";
```

---

### **`api.ts`**

**Generic API response types.**

**🔧 Interfaces:**

```typescript
// Standard API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Paginated response
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error response
interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// Pagination params for requests
interface PaginationParams {
  page?: number;
  limit?: number;
}
```

**💡 Digunakan di semua service layers untuk consistent API responses.**

---

### **`user.ts`**

**User-related types.**

**👤 Main Types:**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  nationality?: string;
  date_of_birth?: string;
  is_verified: boolean;
  role?: {
    id: number;
    name: string;
  };
  avatarUrl?: string;
  preferences?: UserPreferences;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  newsletter: boolean;
}
```

**🔐 Auth Types:**

```typescript
interface AuthCredentials {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthCredentials {
  fullName: string;
  phone: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  message: string;
}
```

**✏️ Update Payload:**

```typescript
interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone_number?: string;
  nationality?: string;
  date_of_birth?: string;
  preferences?: Partial<UserPreferences>;
}
```

---

### **`booking.ts`**

**Booking-related types.**

**📦 Main Types:**

```typescript
interface Booking {
  id: string;
  userId: string;
  tourPackageId: string;
  tourPackage: {
    id: string;
    title: string;
    destinationName: string;
    imageUrl: string;
  };
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  numberOfTravelers: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
```

**📝 Request Payloads:**

```typescript
interface CreateBookingPayload {
  tourPackageId: string;
  startDate: string;
  numberOfTravelers: number;
  specialRequests?: string;
}

interface UpdateBookingPayload {
  numberOfTravelers?: number;
  specialRequests?: string;
  status?: BookingStatus;
}
```

---

### **`destination.ts`**

**Destination-related types.**

```typescript
interface Destination {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  country: string;
  city?: string;
  description?: string;
  description_en?: string;
  image_url?: string;
  is_active: boolean;
  package_count?: number;
  created_at: string;
  updated_at: string;
}

interface DestinationFilters {
  country?: string;
  minRating?: number;
  searchQuery?: string;
}
```

---

### **`tour.ts`**

Tour package types dengan detail lengkap (pricing, itinerary, dll).

### **`transport.ts`**

Transportation service types (rental mobil, private driver, dll).

### **`category.ts`**

Category types untuk tour packages.

### **`package.ts`**

Tour package detail types.

### **`home.ts`**

Types untuk home screen data (banners, featured tours, dll).

---

## ⚙️ CONSTANTS (`/src/constants`)

### **`theme.ts`**

**Centralized theme configuration untuk konsistensi UI.**

**🎨 Colors:**

```typescript
export const Colors = {
  text: "#11468F", // Primary text color
  background: "#FFFFFF", // Background putih
  backgroundElement: "#F0F0F3", // Background untuk cards/elements
  backgroundSelected: "#E8F5FF", // Background saat selected
  textSecondary: "#60646C", // Secondary text color
  primary: "#11468F", // Primary brand color
  accent: "#32cc0f", // Accent color (green)
  tint: "#11468F", // Tint color
} as const;
```

**✏️ Font Families:**

```typescript
export const FontFamilies = {
  light: "Poppins_300Light",
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
} as const;
```

**🔢 Font Weights:**

```typescript
export const FontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;
```

**📏 Spacing:**

```typescript
export const Spacing = {
  half: 2, // 2px
  one: 4, // 4px
  two: 8, // 8px
  three: 16, // 16px
  four: 24, // 24px
  five: 32, // 32px
  six: 64, // 64px
} as const;
```

**📱 Platform-Specific:**

```typescript
// Bottom tab bar inset untuk safe area
export const BottomTabInset =
  Platform.select({
    ios: 50,
    android: 80,
  }) ?? 0;

// Maximum content width untuk responsive layout
export const MaxContentWidth = 800;
```

**💡 Contoh Penggunaan:**

```typescript
import { Colors, FontFamilies, Spacing } from "@/constants/theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: Spacing.four,
  },
  title: {
    color: Colors.primary,
    fontFamily: FontFamilies.bold,
    fontSize: 24,
    marginBottom: Spacing.three,
  },
  card: {
    backgroundColor: Colors.backgroundElement,
    borderRadius: Spacing.two,
    padding: Spacing.three,
  },
});
```

---

## 🔄 Data Flow Pattern

### **1. Screen Component Pattern**

```typescript
// Screen menggunakan store untuk global state
const { user, isAuthenticated } = useAuthStore();
const { bookings, fetchMyBookings } = useBookingStore();

// Screen menggunakan hooks untuk data fetching
const { destinations, isLoading, loadMore } = useDestinations();

// Screen menggunakan types untuk type safety
const handleBooking = async (payload: CreateBookingPayload) => {
  // ...
};
```

### **2. Service → Store Pattern**

```typescript
// Store actions memanggil services
const login = async (email: string, password: string) => {
  set({ isLoading: true });

  try {
    const response: AuthResponse = await authService.login({
      email,
      password,
    });

    set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    });
  } catch (error) {
    set({ error: error.message });
  }
};
```

### **3. Hook → Service Pattern**

```typescript
// Hook membungkus service call dengan state management
export const useDestinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDestinations = async () => {
    setIsLoading(true);
    try {
      const response = await destinationService.getDestinations();
      setDestinations(response.data);
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  return { destinations, isLoading, fetchDestinations };
};
```

---

## 🎯 Best Practices

### **Hooks:**

✅ Gunakan `use-async` untuk operasi async sederhana  
✅ Buat custom hook untuk logic yang reusable  
✅ Tambahkan error handling di semua hooks  
✅ Reset state saat unmount jika perlu

### **Store:**

✅ Hanya simpan state yang perlu global access  
✅ Use persistence hanya untuk data yang perlu survive app restart  
✅ Clear sensitive data pada logout  
✅ Normalize data structure untuk update efficiency

### **Types:**

✅ Define all API response types  
✅ Use strict typing, avoid `any`  
✅ Create separate payload types untuk create/update operations  
✅ Export types dari index.ts untuk clean imports

### **Constants:**

✅ Gunakan theme constants untuk semua styling  
✅ Avoid magic numbers - define di Spacing  
✅ Use platform-specific values dengan Platform.select  
✅ Add `as const` untuk type inference yang better

---

## 📚 Quick Reference

| Kebutuhan                            | Gunakan                    |
| ------------------------------------ | -------------------------- |
| Async operation dengan loading state | `useAsync`                 |
| Fetch destinations dengan pagination | `useDestinations`          |
| Search functionality dengan debounce | `useSearch`                |
| Global auth state                    | `useAuthStore`             |
| User bookings                        | `useBookingStore`          |
| API response typing                  | Types dari `/types/api.ts` |
| Colors dan spacing                   | `/constants/theme.ts`      |
| Type safety untuk data models        | Import dari `/types`       |

---

**💡 Tip:** Lihat file-file existing sebagai reference saat membuat hooks, stores, atau types baru untuk maintain consistency.
