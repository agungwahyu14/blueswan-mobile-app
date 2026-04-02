# Blue Swan Travel Agent Mobile App

A modern React Native travel agent application built with Expo, TypeScript, and best practices for mobile development.

## 🏗️ Architecture

### Tech Stack

- **Frontend:** React Native + Expo
- **Language:** TypeScript (strict mode)
- **State Management:** Zustand
- **Navigation:** Expo Router with Native Tabs
- **Styling:** StyleSheet.create
- **API Client:** Custom fetch-based client
- **Storage:** AsyncStorage for auth persistence

### Folder Structure

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout with navigation
│   ├── index.tsx          # Destinations screen (home)
│   ├── explore.tsx        # Tours screen
│   ├── bookings.tsx       # Bookings screen
│   └── profile.tsx        # Profile screen
├── components/            # Reusable UI components
├── constants/             # Theme constants
├── hooks/                 # Custom React hooks
│   ├── use-destinations.ts
│   ├── use-tours.ts
│   ├── use-search.ts
│   └── use-async.ts
├── screens/              # Screen components
│   ├── destinations-screen.tsx
│   ├── tours-screen.tsx
│   ├── bookings-screen.tsx
│   └── profile-screen.tsx
├── services/             # API service layer
│   ├── api-client.ts
│   ├── auth-service.ts
│   ├── user-service.ts
│   ├── destination-service.ts
│   ├── tour-service.ts
│   └── booking-service.ts
├── store/                # Zustand state management
│   ├── auth-store.ts
│   ├── booking-store.ts
│   └── explore-store.ts
└── types/                # TypeScript type definitions
    ├── api.ts
    ├── user.ts
    ├── destination.ts
    ├── tour.ts
    └── booking.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

## 🔧 Configuration

### API Endpoint

Update the API base URL in `src/services/api-client.ts`:

```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

For production, use environment variables:

```typescript
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
```

## 📚 Core Features

### 1. Authentication

- Login/Register with email and password
- JWT token-based authentication
- Auto token refresh
- Persistent auth state with AsyncStorage
- Logout functionality

**Usage:**

```typescript
import { useAuthStore } from "@/store/auth-store";

const { user, login, logout, isAuthenticated } = useAuthStore();

// Login
await login("user@example.com", "password");

// Logout
await logout();
```

### 2. Destinations

- Browse all destinations
- View popular destinations
- Search destinations
- View destination details
- Pagination support

**Usage:**

```typescript
import { useDestinations } from "@/hooks/use-destinations";

const { destinations, isLoading, loadMore, refresh } = useDestinations();
```

### 3. Tour Packages

- Browse tour packages
- Filter by destination, price, duration, difficulty
- View tour details with itinerary
- Search tours
- Featured tours

**Usage:**

```typescript
import { useTours } from "@/hooks/use-tours";

const { tours, isLoading, loadMore } = useTours({
  filters: { destinationId: "dest-123" },
});
```

### 4. Bookings

- Create new bookings
- View all bookings
- View upcoming trips
- View past bookings
- Cancel bookings
- Booking status tracking

**Usage:**

```typescript
import { useBookingStore } from "@/store/booking-store";

const { bookings, createBooking, cancelBooking } = useBookingStore();

// Create booking
await createBooking("tour-123", "2026-05-01", 2, "Vegetarian meals");

// Cancel booking
await cancelBooking("booking-123");
```

### 5. User Profile

- View profile information
- Update profile details
- Upload avatar
- Manage preferences (currency, language, notifications)
- Change password
- Delete account

**Usage:**

```typescript
import { userService } from "@/services/user-service";

// Update profile
const updatedUser = await userService.updateProfile({
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "+1234567890",
});
```

## 🎨 Best Practices Implemented

### TypeScript

✅ Strict mode enabled
✅ No `any` types - proper interfaces defined
✅ Type-safe API responses
✅ Exported types for reusability

### Components

✅ Functional components with Hooks
✅ Named exports (no default exports for components)
✅ Proper prop type definitions
✅ Memoization with useMemo/useCallback where needed

### Performance

✅ FlatList for efficient list rendering
✅ Image optimization with proper resizeMode
✅ Pagination for large datasets
✅ Pull-to-refresh functionality
✅ Optimistic UI updates

### State Management

✅ Zustand for global state
✅ Proper state slicing (auth, bookings, explore)
✅ Persistent auth state
✅ Error handling in stores

### API Layer

✅ Centralized API client
✅ Automatic token injection
✅ Error handling and retries
✅ Type-safe responses
✅ Service-based architecture

### Styling

✅ StyleSheet.create for performance
✅ Consistent spacing and colors
✅ SafeAreaView for proper insets
✅ Responsive layouts

## 🔍 Custom Hooks

### useDestinations

Fetch and manage destination data with pagination.

```typescript
const { destinations, isLoading, hasMore, loadMore, refresh } = useDestinations(
  {
    autoFetch: true,
    page: 1,
    limit: 20,
  },
);
```

### useTours

Fetch and manage tour packages with filters.

```typescript
const { tours, isLoading, hasMore, loadMore } = useTours({
  filters: {
    destinationId: "dest-123",
    minPrice: 500,
    maxPrice: 2000,
    difficulty: "easy",
  },
});
```

### useSearch

Generic search hook with debouncing.

```typescript
const { query, results, isSearching, search, clearSearch } = useSearch({
  searchFn: destinationService.searchDestinations,
  minQueryLength: 2,
  debounceMs: 300,
});
```

### useAsync

Handle async operations with loading/error states.

```typescript
const { execute, isLoading, error, data } = useAsync(
  bookingService.createBooking,
);

await execute(tourId, startDate, travelers);
```

## 🎯 API Integration

All API endpoints follow this pattern:

```
GET     /api/destinations              - List destinations
GET     /api/destinations/:id          - Get destination by ID
GET     /api/destinations/popular      - Get popular destinations
GET     /api/destinations/search       - Search destinations

GET     /api/tours                     - List tours (with filters)
GET     /api/tours/:id                 - Get tour by ID
GET     /api/tours/featured            - Get featured tours

GET     /api/bookings/me               - Get user's bookings
GET     /api/bookings/:id              - Get booking by ID
POST    /api/bookings                  - Create booking
PATCH   /api/bookings/:id              - Update booking
PATCH   /api/bookings/:id/cancel       - Cancel booking

POST    /api/auth/login                - Login
POST    /api/auth/register             - Register
POST    /api/auth/logout               - Logout
POST    /api/auth/refresh              - Refresh token

GET     /api/users/me                  - Get current user
PATCH   /api/users/me                  - Update profile
POST    /api/users/me/avatar           - Upload avatar
DELETE  /api/users/me/avatar           - Delete avatar
```

## 🐛 Error Handling

All API calls include proper error handling:

```typescript
try {
  const data = await destinationService.getDestinations();
  // Handle success
} catch (error) {
  // Error is properly typed and includes message
  console.error(error.message);
}
```

## 🔐 Authentication Flow

1. User logs in → Token stored in Zustand + AsyncStorage
2. Token automatically added to API requests
3. On app restart → Token restored from AsyncStorage
4. On 401 error → Auto refresh token
5. If refresh fails → Logout user

## 📱 Platform-Specific Notes

### iOS

- StatusBar handled automatically
- SafeAreaView for notch support
- Native navigation animations

### Android

- Material design ripple effects
- Hardware back button handled
- Proper permission handling for avatar upload

### Web

- Responsive design
- Browser-compatible navigation
- Web-specific optimizations

## 🚧 Next Steps

To complete the app, consider adding:

1. **Authentication Screens**
   - Login screen
   - Register screen
   - Password reset flow

2. **Detail Screens**
   - Destination detail screen
   - Tour detail screen with booking flow
   - Booking detail screen

3. **Additional Features**
   - Image gallery/carousel
   - Maps integration
   - Payment gateway
   - Reviews and ratings
   - Push notifications
   - Offline support

4. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Detox

5. **Performance**
   - Image caching
   - API response caching
   - Code splitting

## 📄 License

This project is licensed under the MIT License.
