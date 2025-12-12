import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../constants';
import { Product, FilterOptions, Review } from '../types';

// This service mimics the behavior of your future Spring Boot Controller.
// When you build the backend, replace these Promises with fetch() calls.

const DELAY_MS = 600; // Simulate network latency

export const fetchProducts = async (filters: FilterOptions): Promise<{ products: Product[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a shallow copy to avoid mutating the constant when sorting
      let result = [...MOCK_PRODUCTS];

      // Filter by Search Query
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query)
        );
      }

      // Filter by Category
      if (filters.category && filters.category !== "All") {
        result = result.filter(p => p.category === filters.category);
      }

      // Filter by Price
      if (filters.minPrice !== undefined) {
        result = result.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter(p => p.price <= filters.maxPrice!);
      }

      // Filter by Rating
      if (filters.minRating !== undefined) {
        result = result.filter(p => p.rating >= filters.minRating!);
      }

      // Filter by Color
      if (filters.color) {
        result = result.filter(p => p.colors && p.colors.includes(filters.color!));
      }

      // Filter by Availability
      if (filters.inStockOnly) {
        result = result.filter(p => p.stock > 0);
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'priceLowHigh':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'priceHighLow':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'topRated':
            result.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            // Assuming higher ID means newer for this mock data
            result.sort((a, b) => b.id - a.id);
            break;
          default:
            break;
        }
      }

      const total = result.length;

      // Pagination
      if (filters.page !== undefined && filters.limit !== undefined) {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        result = result.slice(start, end);
      }

      resolve({ products: result, total });
    }, DELAY_MS);
  });
};

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_PRODUCTS.find(p => p.id === id));
    }, DELAY_MS);
  });
};

export const fetchReviews = async (productId: number): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return reviews for this product, or if none exist, return some generic ones for the demo
      const productReviews = MOCK_REVIEWS.filter(r => r.productId === productId);
      
      // Fallback for products with no explicit reviews in mock data, just to populate the UI
      if (productReviews.length === 0) {
        const fallbackReviews = MOCK_REVIEWS.filter(r => r.productId > 100); // Empty filter usually, but here we can just pick random ones
        resolve(fallbackReviews);
      } else {
        resolve(productReviews);
      }
    }, DELAY_MS);
  });
};