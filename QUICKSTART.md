# Blue Swan Travel Agent App - Quick Start

## ✅ What's Been Built

A complete React Native Travel Agent application with:

### 📱 Features Implemented

- ✅ **Destinations Listing** - Browse and search travel destinations
- ✅ **Tour Packages** - View and filter tour packages
- ✅ **Bookings Management** - Create and manage travel bookings
- ✅ **User Profile** - Profile management with preferences
- ✅ **Authentication** - Login/register with JWT tokens
- ✅ **State Management** - Zustand stores for global state
- ✅ **API Integration** - Complete service layer for http://localhost:3000/api

### 🏗️ Architecture

```
✅ TypeScript (strict mode) - All types defined
✅ Functional Components - Using React Hooks
✅ Zustand State Management - auth, bookings, explore stores
✅ Custom Hooks - useDestinations, useTours, useSearch, useAsync
✅ Service Layer - Centralized API client with 6 services
✅ Type Safety - No 'any' types, full type definitions
✅ Navigation - 4 tabs: Destinations, Tours, Bookings, Profile
```

## 🚀 Running the App

### 1. Start the Backend API

Make sure your backend is running at `http://localhost:3000/api`

### 2. Start the Mobile App

```bash
# Start Expo development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run in web browser
npm run web
```

## 📂 Project Structure

```
src/
├── types/              # TypeScript interfaces
│   ├── api.ts         # API response types
│   ├── user.ts        # User & auth types
│   ├── destination.ts # Destination types
│   ├── tour.ts        # Tour package types
│   └── booking.ts     # Booking types
│
├── services/          # API service layer
│   ├── api-client.ts       # HTTP client with auth
│   ├── auth-service.ts     # Login, register, logout
│   ├── user-service.ts     # Profile management
│   ├── destination-service.ts
│   ├── tour-service.ts
│   └── booking-service.ts
│
├── store/             # Zustand global state
│   ├── auth-store.ts       # User authentication
│   ├── booking-store.ts    # Bookings management
│   └── explore-store.ts    # Destinations & tours
│
├── hooks/             # Custom React hooks
│   ├── use-destinations.ts # Fetch destinations with pagination
│   ├── use-tours.ts        # Fetch tours with filters
│   ├── use-search.ts       # Generic search hook
│   └── use-async.ts        # Async operation handler
│
├── screens/           # Screen components
│   ├── destinations-screen.tsx
│   ├── tours-screen.tsx
│   ├── bookings-screen.tsx
│   └── profile-screen.tsx
│
└── app/              # Expo Router screens
    ├── _layout.tsx   # Root navigation
    ├── index.tsx     # Destinations (home)
    ├── explore.tsx   # Tours
    ├── bookings.tsx  # Bookings
    └── profile.tsx   # Profile
```

## 💡 Usage Examples

### Authentication

```typescript
import { useAuthStore } from "@/store/auth-store";

function LoginScreen() {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login("user@example.com", "password123");
      // Navigate to home
    } catch (err) {
      // Error handled in store
    }
  };
}
```

### Fetch Destinations

```typescript
import { useDestinations } from '@/hooks/use-destinations';

function DestinationsList() {
  const { destinations, isLoading, loadMore, refresh } = useDestinations();

  return (
    <FlatList
      data={destinations}
      onEndReached={loadMore}
      onRefresh={refresh}
      refreshing={isLoading}
    />
  );
}
```

### Create Booking

```typescript
import { useBookingStore } from "@/store/booking-store";

function BookingForm() {
  const { createBooking, isLoading } = useBookingStore();

  const handleSubmit = async () => {
    const booking = await createBooking(
      "tour-123", // tourPackageId
      "2026-05-15", // startDate
      2, // numberOfTravelers
      "Vegetarian meals", // specialRequests
    );
    // Navigate to booking confirmation
  };
}
```

### Search Tours

```typescript
import { useSearch } from '@/hooks/use-search';
import { tourService } from '@/services/tour-service';

function TourSearch() {
  const { results, isSearching, search } = useSearch({
    searchFn: tourService.searchTours,
    minQueryLength: 2,
  });

  return (
    <SearchBar
      onChangeText={search}
      results={results}
      isLoading={isSearching}
    />
  );
}
```

## 🔧 Configuration

### Change API URL

Edit `src/services/api-client.ts`:

```typescript
const API_BASE_URL = "https://your-api.com/api";
```

### Update Theme Colors

Edit `src/constants/theme.ts` (existing theme file)

## 📋 API Endpoints Expected

Your backend should implement these endpoints:

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token

### Destinations

- `GET /api/destinations` - List with pagination
- `GET /api/destinations/:id` - Get by ID
- `GET /api/destinations/popular` - Popular destinations
- `GET /api/destinations/search?q=query` - Search

### Tours

- `GET /api/tours` - List with filters & pagination
- `GET /api/tours/:id` - Get by ID
- `GET /api/tours/featured` - Featured tours
- `GET /api/tours/search?q=query` - Search

### Bookings

- `GET /api/bookings/me` - User's bookings
- `GET /api/bookings/me/upcoming` - Upcoming trips
- `GET /api/bookings/me/past` - Past bookings
- `GET /api/bookings/:id` - Get by ID
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### User Profile

- `GET /api/users/me` - Get profile
- `PATCH /api/users/me` - Update profile
- `POST /api/users/me/avatar` - Upload avatar
- `DELETE /api/users/me/avatar` - Delete avatar

## 🎯 Next Steps

### 1. Add Authentication Screens

Currently screens exist but need auth UI:

```bash
# Create these screens:
src/screens/login-screen.tsx
src/screens/register-screen.tsx
src/screens/forgot-password-screen.tsx
```

### 2. Add Detail Screens

```bash
# Create these screens:
src/screens/destination-detail-screen.tsx
src/screens/tour-detail-screen.tsx
src/screens/booking-detail-screen.tsx
```

### 3. Add Booking Flow

- Date picker for travel dates
- Traveler count selector
- Payment integration
- Booking confirmation

### 4. Enhance Features

- Image carousel for destinations/tours
- Map integration (Google Maps/Apple Maps)
- Filter UI components
- Reviews and ratings
- Favorites/Wishlist

### 5. Testing & Performance

- Add unit tests
- Implement error boundaries
- Add loading skeletons
- Image caching
- Offline support

## 🐛 Troubleshooting

### "Network request failed"

- Ensure backend is running on `http://localhost:3000`
- On iOS simulator, use `localhost`
- On Android emulator, use `10.0.2.2:3000`
- On physical device, use your computer's IP address

### TypeScript Errors

```bash
# Clear cache and restart
npm start -- --clear
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Router](https://docs.expo.dev/router/introduction/)

## ✨ Code Highlights

### Type Safety

```typescript
// All API responses are fully typed
const destination: Destination =
  await destinationService.getDestinationById(id);

// No 'any' types anywhere in the codebase
// Strict TypeScript mode enabled
```

### Performance Optimizations

```typescript
// Pagination for large lists
const { destinations, loadMore, hasMore } = useDestinations();

// Memoized callbacks to prevent re-renders
const handlePress = useCallback(
  (item: Tour) => {
    navigate("TourDetail", { id: item.id });
  },
  [navigate],
);
```

### Error Handling

```typescript
// All services have proper error handling
try {
  const booking = await bookingService.createBooking(data);
} catch (error) {
  // Error is typed and includes message
  Alert.alert("Error", error.message);
}
```

### State Management

```typescript
// Zustand stores with TypeScript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;
```

---

**Ready to travel!** 🌍✈️🏖️
