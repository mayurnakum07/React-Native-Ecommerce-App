# ShopEase - React Native E-commerce App

A modern React Native e-commerce app built with Expo, featuring an interactive onboarding experience.

## Features

### 🎯 Onboarding Experience
- **5 Dynamic Onboarding Pages** with beautiful animations
- **Swiper Navigation** - swipe left/right or use buttons
- **Skip Functionality** - users can skip onboarding
- **Persistent State** - onboarding completion is saved locally
- **Dynamic Content** - each page has unique colors and content

### 📱 App Structure
- **Onboarding Screen** - Interactive swiper with 5 pages
- **Home Screen** - Welcome screen after onboarding
- **TypeScript** - Full type safety
- **Modern React** - Using React 19 and latest patterns

## Onboarding Pages

1. **Welcome to ShopEase** - Introduction with shopping bag emoji
2. **Easy Shopping** - Mobile interface showcase
3. **Secure Payments** - Security and payment features
4. **Fast Delivery** - Delivery service highlights
5. **Ready to Shop?** - Call to action

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   ```bash
   npm run ios     # iOS
   npm run android # Android
   npm run web     # Web
   ```

## Dependencies

- **react-native-swiper** - For onboarding carousel
- **@react-native-async-storage/async-storage** - For persistent state
- **expo** - React Native development platform
- **TypeScript** - Type safety

## Project Structure

```
MyReactNativeApp/
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   └── HomeScreen.tsx
│   ├── components/
│   └── assets/
├── App.tsx
├── index.tsx
└── package.json
```

## Customization

### Adding More Onboarding Pages
Edit the `onboardingData` array in `src/screens/OnboardingScreen.tsx`:

```typescript
const onboardingData: OnboardingData[] = [
  // Add your new pages here
];
```

### Changing Colors and Styling
Modify the `styles` object in each component to customize the appearance.

## Next Steps

This is the foundation for your e-commerce app. Future features could include:
- Product catalog
- Shopping cart
- User authentication
- Payment integration
- Order tracking
- Product search and filtering

## License

This project is open source and available under the MIT License. 