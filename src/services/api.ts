import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * API service for handling data fetching and caching
 */

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEYS = {
  PRODUCTS: 'cached_products',
  CATEGORIES: 'cached_categories',
  USER_DATA: 'cached_user_data',
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * Generic cache management
 */
class CacheManager {
  static async set<T>(key: string, data: T): Promise<void> {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  }

  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(key);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

      if (isExpired) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async clear(key?: string): Promise<void> {
    if (key) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.multiRemove(Object.values(CACHE_KEYS));
    }
  }
}

/**
 * Simulated API endpoints
 */
class ApiService {
  // Simulate network delay
  private static delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch products with caching
   */
  static async getProducts(): Promise<any[]> {
    // Check cache first
    const cached = await CacheManager.get<any[]>(CACHE_KEYS.PRODUCTS);
    if (cached) {
      return cached;
    }

    // Simulate API call
    await this.delay(800);
    
    // Import products data
    const { products } = await import('../data/products.js');
    
    // Cache the result
    await CacheManager.set(CACHE_KEYS.PRODUCTS, products);
    
    return products;
  }

  /**
   * Fetch categories with caching
   */
  static async getCategories(): Promise<any[]> {
    // Check cache first
    const cached = await CacheManager.get<any[]>(CACHE_KEYS.CATEGORIES);
    if (cached) {
      return cached;
    }

    // Simulate API call
    await this.delay(500);
    
    // Import categories data
    const { categories } = await import('../data/categories.js');
    
    // Cache the result
    await CacheManager.set(CACHE_KEYS.CATEGORIES, categories);
    
    return categories;
  }

  /**
   * Search products
   */
  static async searchProducts(query: string): Promise<any[]> {
    const products = await this.getProducts();
    
    // Simulate API call
    await this.delay(300);
    
    return products.filter(product =>
      product.shortName.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(categoryId: string): Promise<any[]> {
    const products = await this.getProducts();
    
    // Simulate API call
    await this.delay(400);
    
    return products.filter(product => product.categoryId === categoryId);
  }

  /**
   * Get product details
   */
  static async getProductDetails(productId: string): Promise<any | null> {
    const products = await this.getProducts();
    
    // Simulate API call
    await this.delay(200);
    
    return products.find(product => product.id === productId) || null;
  }

  /**
   * Simulate user authentication
   */
  static async login(email: string, password: string): Promise<{ success: boolean; user?: any; message?: string }> {
    await this.delay(1000);
    
    // Simple validation
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Simulate successful login
    const user = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    };

    return { success: true, user };
  }

  /**
   * Simulate user registration
   */
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: any; message?: string }> {
    await this.delay(1200);
    
    // Simple validation
    if (!email || !password || !name) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    // Simulate successful registration
    const user = {
      id: Date.now().toString(),
      email,
      name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    };

    return { success: true, user };
  }

  /**
   * Clear all cached data
   */
  static async clearCache(): Promise<void> {
    await CacheManager.clear();
  }

  /**
   * Refresh cached data
   */
  static async refreshData(): Promise<void> {
    await CacheManager.clear();
    await this.getProducts();
    await this.getCategories();
  }
}

export default ApiService;
export { CacheManager }; 