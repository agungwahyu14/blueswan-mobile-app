# 🔄 State Management Structure: Zustand vs Redux

Dokumentasi perbandingan struktur file dan implementasi antara **Zustand** (yang digunakan) dan **Redux** sebagai alternatif.

---

## 📁 STRUKTUR FILE - ZUSTAND (Current Implementation)

### Folder Structure

```
/src
  /store
    index.ts              # Export all stores
    auth-store.ts         # Auth state & actions
    booking-store.ts      # Booking state & actions
    explore-store.ts      # Explore state & actions
  /types
    user.ts               # User & Auth types
    booking.ts            # Booking types
  /services
    auth-service.ts       # API calls
    booking-service.ts    # API calls
```

### File Contents - Zustand

#### **`/src/store/index.ts`**
```typescript
// Simple re-export
export { useAuthStore } from "./auth-store";
export { useBookingStore } from "./booking-store";
export { useExploreStore } from "./explore-store";
```

#### **`/src/store/auth-store.ts`**
```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "@/services/auth-service";
import type { User, AuthResponse } from "@/types/user";

// 1. Define State Interface
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 2. Define Actions Interface
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

// 3. Combine into Store Type
type AuthStore = AuthState & AuthActions;

// 4. Create Store with Implementation
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions Implementation
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response: AuthResponse = await authService.login({
            email,
            password,
          });

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
      
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

#### **`/src/store/booking-store.ts`**
```typescript
import { create } from "zustand";
import { bookingService } from "@/services/booking-service";
import type { Booking } from "@/types/booking";

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  fetchMyBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (
    tourPackageId: string,
    startDate: string,
    numberOfTravelers: number
  ) => Promise<Booking>;
  clearError: () => void;
}

type BookingStore = BookingState & BookingActions;

export const useBookingStore = create<BookingStore>((set) => ({
  // State
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  // Actions
  fetchMyBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookingService.getMyBookings();
      set({ bookings: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch",
        isLoading: false,
      });
    }
  },

  createBooking: async (tourPackageId, startDate, numberOfTravelers) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingService.createBooking({
        tourPackageId,
        startDate,
        numberOfTravelers,
      });
      set((state) => ({
        bookings: [...state.bookings, booking],
        currentBooking: booking,
        isLoading: false,
      }));
      return booking;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
```

#### **Usage in Component - Zustand**
```typescript
import { useAuthStore } from "@/store";

function LoginScreen() {
  // Select only what you need
  const { user, isLoading, error, login } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <View>
      <Text>{error}</Text>
      <Button onPress={handleLogin} disabled={isLoading}>
        Login
      </Button>
    </View>
  );
}
```

---

## 📁 STRUKTUR FILE - REDUX (Alternative)

### Folder Structure dengan Redux Toolkit

```
/src
  /store
    store.ts                    # Configure store
    hooks.ts                    # Typed hooks
    /slices
      authSlice.ts              # Auth slice (reducer + actions)
      bookingSlice.ts           # Booking slice
      exploreSlice.ts           # Explore slice
    /middleware
      authMiddleware.ts         # Custom middleware
      loggerMiddleware.ts       # Logger middleware
    /thunks
      authThunks.ts             # Async thunks for auth
      bookingThunks.ts          # Async thunks for booking
  /types
    store.ts                    # RootState, AppDispatch types
    user.ts                     # User & Auth types
    booking.ts                  # Booking types
  /services
    auth-service.ts             # API calls
    booking-service.ts          # API calls
```

### File Contents - Redux

#### **`/src/store/store.ts`**
```typescript
import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./slices/authSlice";
import bookingReducer from "./slices/bookingSlice";
import exploreReducer from "./slices/exploreSlice";

// Persist config for auth
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["user", "token", "refreshToken", "isAuthenticated"],
};

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    booking: bookingReducer,
    explore: exploreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **`/src/store/hooks.ts`**
```typescript
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### **`/src/store/slices/authSlice.ts`**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/auth-service";
import type { User, AuthResponse } from "@/types/user";

// 1. Define State Interface
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 2. Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 3. Create Async Thunks
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    payload: {
      fullName: string;
      email: string;
      password: string;
      phone: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

export const getCurrentUserThunk = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.me();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to get user"
      );
    }
  }
);

// 4. Create Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerThunk.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.isAuthenticated = true;
        }
      )
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    });

    // Get Current User
    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getCurrentUserThunk.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// 5. Export actions and reducer
export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
```

#### **`/src/store/slices/bookingSlice.ts`**
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { bookingService } from "@/services/booking-service";
import type { Booking } from "@/types/booking";

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchMyBookingsThunk = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.getMyBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch bookings"
      );
    }
  }
);

export const createBookingThunk = createAsyncThunk(
  "booking/createBooking",
  async (
    payload: {
      tourPackageId: string;
      startDate: string;
      numberOfTravelers: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const booking = await bookingService.createBooking(payload);
      return booking;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Bookings
    builder
      .addCase(fetchMyBookingsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMyBookingsThunk.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.isLoading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchMyBookingsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Booking
    builder
      .addCase(createBookingThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        createBookingThunk.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.isLoading = false;
          state.bookings.push(action.payload);
          state.currentBooking = action.payload;
        }
      )
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
```

#### **`App.tsx` - Redux Provider Setup**
```typescript
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
}
```

#### **Usage in Component - Redux**
```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk, clearError } from "@/store/slices/authSlice";

function LoginScreen() {
  const dispatch = useAppDispatch();
  
  // Select state from store
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      // Dispatch async thunk
      const result = await dispatch(
        loginThunk({ email, password })
      ).unwrap();
      
      router.push("/home");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <View>
      <Text>{error}</Text>
      <Button onPress={handleLogin} disabled={isLoading}>
        Login
      </Button>
    </View>
  );
}
```

---

## 📊 Perbandingan File Count

### **Zustand Implementation**

```
Total Files: 3
- index.ts                (3 lines)
- auth-store.ts           (120 lines)
- booking-store.ts        (80 lines)
```

### **Redux Implementation**

```
Total Files: 8+
- store.ts                (45 lines)
- hooks.ts                (6 lines)
- authSlice.ts            (180 lines)
- bookingSlice.ts         (150 lines)
- exploreSlice.ts         (150 lines)
- authMiddleware.ts       (optional)
- loggerMiddleware.ts     (optional)
- App.tsx (Provider)      (additional setup)
```

---

## 🔍 Code Comparison - Same Feature

### **Adding a New Action**

#### **Zustand - Add "updateProfile" action:**
```typescript
// Just add to the store object
updateProfile: async (payload: UpdateUserPayload) => {
  set({ isLoading: true });
  try {
    const user = await authService.updateProfile(payload);
    set({ user, isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
}
```

**Total: ~10 lines dalam 1 file**

#### **Redux - Add "updateProfile" action:**
```typescript
// 1. Create async thunk
export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (payload: UpdateUserPayload, { rejectWithValue }) => {
    try {
      const user = await authService.updateProfile(payload);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 2. Add to extraReducers
builder
  .addCase(updateProfileThunk.pending, (state) => {
    state.isLoading = true;
  })
  .addCase(updateProfileThunk.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload;
  })
  .addCase(updateProfileThunk.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
  });
```

**Total: ~25 lines dalam 1 file**

---

## 📈 Complexity Metrics

| Metric | Zustand | Redux (RTK) |
|--------|---------|-------------|
| **Files per feature** | 1 | 1 (slice) |
| **Lines of code** | ~100-150 | ~180-250 |
| **Boilerplate** | Minimal | Moderate |
| **Learning curve** | Low | Medium |
| **Type safety** | Excellent | Excellent |
| **Bundle size** | ~1KB | ~50KB |
| **Setup time** | 5 min | 20 min |

---

## 🎯 Migration Path (Zustand → Redux)

Jika suatu hari perlu migrasi ke Redux, ini langkah-langkahnya:

### **Step 1: Install Dependencies**
```bash
npm install @reduxjs/toolkit react-redux redux-persist
```

### **Step 2: Create Store Structure**
```bash
mkdir -p src/store/slices
touch src/store/store.ts
touch src/store/hooks.ts
```

### **Step 3: Move State Logic**
```typescript
// Convert Zustand store → Redux slice
// From: src/store/auth-store.ts
// To:   src/store/slices/authSlice.ts
```

### **Step 4: Update Imports**
```typescript
// Old (Zustand)
import { useAuthStore } from "@/store";
const { user, login } = useAuthStore();

// New (Redux)
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginThunk } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();
const user = useAppSelector((state) => state.auth.user);
```

### **Step 5: Add Provider**
```typescript
// App.tsx
<Provider store={store}>
  <PersistGate persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

---

## 💡 Recommendation

### **Keep Zustand jika:**
✅ App size < 50 screens  
✅ State complexity rendah-medium  
✅ Team size kecil (1-5 devs)  
✅ Performance critical (mobile)  
✅ Simple requirements  

### **Migrasi ke Redux jika:**
⚠️ App growth > 100 screens  
⚠️ Complex state interactions  
⚠️ Large team (5+ devs)  
⚠️ Perlu advanced debugging  
⚠️ Enterprise requirements  

---

## 📝 Summary

**Aplikasi Blue Swan Mobile saat ini menggunakan Zustand** karena:

1. ✅ **3 files** vs **8+ files** (Redux)
2. ✅ **~300 total lines** vs **~600+ lines** (Redux)
3. ✅ **1KB bundle** vs **50KB bundle** (Redux)
4. ✅ **5 menit setup** vs **20 menit setup** (Redux)
5. ✅ **Simple API** - Easy to maintain
6. ✅ **Perfect untuk mobile apps**

Redux sangat bagus, tapi untuk scale aplikasi ini, **Zustand adalah pilihan yang tepat** dan sudah cukup powerful untuk semua kebutuhan state management.

---

**📌 Note:** Dokumentasi ini bisa dijadikan reference jika suatu hari team memutuskan untuk scale up dan mempertimbangkan migration ke Redux.
