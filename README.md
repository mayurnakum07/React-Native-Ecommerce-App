# LuxeCart - React Native E-commerce App

A modern, full-featured e-commerce app built with React Native and Expo. LuxeCart provides a beautiful onboarding experience, product catalog, shopping cart, authentication, and more. This README explains the entire project so any developer can understand, extend, and maintain it.

---

## 🚀 Project Overview

LuxeCart is a cross-platform (iOS, Android, Web) e-commerce app with:
- Animated onboarding flow
- Product catalog and categories
- Shopping cart with persistent state
- User authentication and profile
- Modern UI/UX with theming
- Modular, scalable architecture

---

## 🗂️ Project Structure

```
Ecommerce-App/
├── App.tsx                # App root, onboarding logic, providers
├── index.tsx              # Entry point (Expo)
├── package.json           # Dependencies and scripts
├── assets/                # Images and splash assets
├── src/
│   ├── components/        # Reusable UI and business components
│   │   ├── ui/            # Button, Input, AnimatedLogo, LoadingSpinner
│   │   ├── BannerSwiper.tsx
│   │   ├── CategoryCard.tsx
│   │   └── ProductCard.tsx
│   ├── context/           # App-wide and auth context providers
│   ├── data/              # Mock data for products and categories
│   ├── navigation/        # App and tab navigation
│   ├── screens/           # Main app screens (Home, Cart, Profile, etc.)
│   ├── services/          # API service and cache
│   ├── theme/             # Colors, spacing, typography, layout
│   └── utils/             # Formatters, validation, helpers
└── ...
```

---

## 🏗️ Main App Flow & Architecture

### 1. **App Initialization & Onboarding**
- **App.tsx**: Checks AsyncStorage for onboarding completion. Shows `AnimatedLogo` while initializing.
- If onboarding not complete, shows `OnboardingScreen` (animated swiper, 5 pages, skip/next/start buttons).
- On completion, sets onboarding flag and loads the main app.

### 2. **Providers & State Management**
- **AuthProvider** (`src/context/AuthContext.tsx`): Handles user login, logout, profile, and persistent auth state.
- **CartProvider** (`src/screens/CartScreen.tsx`): Manages cart items, add/remove/update/clear, persists to AsyncStorage.
- **AppContext**: Exposes onboarding status check.
- All providers are composed in `App.tsx` for global access.

### 3. **Navigation**
- **AppNavigator**: Root stack navigator. Main screen is a bottom tab navigator, with additional screens for product details and category product lists.
- **BottomTabNavigator**: 5 tabs (Home, Categories, Cart, New Products, Profile), each mapped to a screen.

### 4. **Screens**
- **OnboardingScreen**: Animated swiper, dynamic content, skip/next/start logic.
- **HomeScreen**: Banner swiper, featured categories, featured products, navigation to details.
- **CategoriesScreen**: Browse all categories.
- **CategoryProductListScreen**: Products filtered by category.
- **ProductDetailScreen**: Product info, add to cart.
- **CartScreen**: Cart items, quantity controls, clear cart, checkout summary.
- **ProfileScreen**: User info, edit profile, logout.
- **NewProductsScreen**: Latest products.

### 5. **Data & API Service**
- **Mock Data**: `src/data/products.js` and `src/data/categories.js` provide sample products and categories.
- **ApiService**: Simulates API calls, supports caching, searching, and category filtering. All data is loaded from local files for demo purposes.

### 6. **Theming & Styling**
- **src/theme/index.ts**: Centralized theme (colors, spacing, typography, border radius, shadows, layout, responsive helpers).
- All components use theme constants for consistent look and feel.

### 7. **Utilities**
- **formatters.ts**: Price formatting, discount calculation, date/number formatting, text helpers.
- **validation.ts**: Email, password, phone, credit card, and form validation utilities.

### 8. **Reusable Components**
- **Button**: Themed, supports variants, loading, icons.
- **Input**: Themed, supports icons, error states, secure entry.
- **AnimatedLogo**: Animated loading logo, used for splash/loading.
- **LoadingSpinner**: Wrapper for loading states.
- **ProductCard, CategoryCard, BannerSwiper**: Business components for product/category display and banners.

---

## 🛒 Data Model

### Product Example (`src/data/products.js`):
```js
{
  id: '1',
  shortName: 'Organic Bananas',
  name: 'Chiquita Organic Bananas',
  price: 2.99,
  priceOff: 2.49,
  strikePrice: 3.49,
  weight: [1, 2, 3],
  badge: 'Fresh',
  rating: 4.7,
  review: 156,
  stock: 45,
  category: 'Fruits',
  categoryId: '2',
  productImages: [require('../../assets/images/bananas.jpg'), ...],
  ...
}
```

### Category Example (`src/data/categories.js`):
```js
{
  id: '2',
  name: 'Fruits',
  image: '🍎',
  description: 'Fresh fruits and berries',
  productCount: 3
}
```

---

## 🧩 How to Extend & Customize

- **Add a new screen**: Create a new file in `src/screens/`, add it to the navigator in `src/navigation/`.
- **Add a new product/category**: Edit `src/data/products.js` or `src/data/categories.js`.
- **Change theme/colors**: Edit `src/theme/index.ts`.
- **Add onboarding pages**: Edit the `screens` array in `src/screens/OnboardingScreen.tsx`.
- **Add new reusable UI**: Place in `src/components/ui/` and export from `src/components/index.ts`.
- **API integration**: Replace logic in `src/services/api.ts` with real API calls.

---

## 🛠️ Utilities & Helpers

- **Formatting**: Use `formatPrice`, `formatNumber`, `formatDate`, etc. from `src/utils/formatters.ts`.
- **Validation**: Use `isValidEmail`, `validatePassword`, `validateForm`, etc. from `src/utils/validation.ts`.

---

## 🧑‍💻 Key Dependencies

- **React Native**: Core framework
- **Expo**: Development/build platform
- **React Navigation**: Navigation and tabs
- **AsyncStorage**: Persistent storage
- **react-native-swiper**: Onboarding and banners
- **expo-linear-gradient**: Gradients
- **@expo/vector-icons**: Icons
- **react-native-animatable**: Animations
- **TypeScript**: Type safety

---

## ▶️ Running the App

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm start
   ```
3. **Run on device/emulator**
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

---

## 📦 Building for Android & iOS

This project uses **Expo EAS Build** for creating internal and production builds.

### 1. **Prerequisites**
- Install [Expo CLI](https://docs.expo.dev/get-started/installation/):
  ```bash
  npm install -g expo-cli eas-cli
  ```
- Log in to Expo:
  ```bash
  expo login
  eas login
  ```
- Configure your app in `app.json` and `eas.json` (already present in this repo).

### 2. **Create Internal (Development) Builds**
Internal builds are for testing on real devices before publishing.

- **Android (APK/AAB):**
  ```bash
  eas build -p android --profile development
  ```
  - The build artifact (APK/AAB) will be available in the Expo dashboard or as a download link.

- **iOS (Simulator/Device):**
  ```bash
  eas build -p ios --profile development
  ```
  - For iOS, you need an Apple Developer account. You can install the build on a device using TestFlight or directly via the Expo dashboard.

### 3. **Create Production Builds for App Stores**
Production builds are for submitting to the Play Store (Android) or App Store (iOS).

- **Android (Play Store):**
  ```bash
  eas build -p android --profile production
  ```
  - This generates an AAB file suitable for Play Store submission.
  - Follow [Expo's Play Store submission guide](https://docs.expo.dev/submit/android/).

- **iOS (App Store):**
  ```bash
  eas build -p ios --profile production
  ```
  - This generates an IPA file for App Store Connect.
  - Follow [Expo's App Store submission guide](https://docs.expo.dev/submit/ios/).

### 4. **Submit to Stores (Optional, via EAS Submit)**
- **Android:**
  ```bash
  eas submit -p android --latest
  ```
- **iOS:**
  ```bash
  eas submit -p ios --latest
  ```

> **Note:**
> - For iOS, you must have an Apple Developer account and set up your app in App Store Connect.
> - For Android, you need a Google Play Developer account and set up your app in the Play Console.
> - Update app icons, splash screens, and metadata in `app.json` before building for production.
> - See the [Expo EAS Build docs](https://docs.expo.dev/build/introduction/) for more details.

---

## 📝 Developer Notes

- All state is managed via React Context and hooks (no Redux needed).
- Cart and user data are persisted using AsyncStorage.
- The app is fully typed with TypeScript for safety and maintainability.
- The UI is responsive and uses a centralized theme for easy customization.
- All business logic is separated from UI for clarity and reusability.

---

## 📄 License

This project is open source and available under the MIT License. 