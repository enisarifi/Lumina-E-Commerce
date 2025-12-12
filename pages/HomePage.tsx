import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { fetchProducts } from '../services/api';
import { COLORS, CATEGORY_VISUALS } from '../constants';
import { Product, FilterOptions } from '../types';
import { Loader2, ArrowRight, SlidersHorizontal, Star, X, Check, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomePageProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

const ITEMS_PER_PAGE = 10; // Increased to fill the larger grid density

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter State - Initialize from LocalStorage
  const [filters, setFilters] = useState<FilterOptions>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lumina_filters');
        return saved ? JSON.parse(saved) : {
          category: "All",
          minPrice: undefined,
          maxPrice: undefined,
          minRating: undefined,
          color: undefined,
          search: undefined,
          inStockOnly: false,
          sortBy: 'newest'
        };
      } catch (e) {
        console.error("Failed to parse filters", e);
      }
    }
    return {
      category: "All",
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      color: undefined,
      search: undefined,
      inStockOnly: false,
      sortBy: 'newest'
    };
  });
  
  // Sync URL search param with filters and reset page if search changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    
    if (filters.search !== searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam || undefined }));
        setCurrentPage(1); // Reset page on search change
    }
  }, [location.search, filters.search]);

  // Handle Hash Scrolling for "Collections" and "Shop" links
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash, location.pathname]);

  // Initialize showFilters based on whether we have active advanced filters
  const [showFilters, setShowFilters] = useState(() => {
    const activeAdvanced = [
      filters.minPrice, 
      filters.maxPrice, 
      filters.minRating, 
      filters.color,
      filters.inStockOnly,
      filters.sortBy !== 'newest' // Consider non-default sort as "advanced" usage
    ].some(x => x !== undefined && x !== false && x !== false);
    return activeAdvanced;
  });

  // Persist filters to LocalStorage whenever they change, excluding search
  useEffect(() => {
    const { search, ...filtersToSave } = filters;
    localStorage.setItem('lumina_filters', JSON.stringify(filtersToSave));
  }, [filters]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({
           ...filters,
           page: currentPage,
           limit: ITEMS_PER_PAGE
        });
        setProducts(data.products);
        setTotalItems(data.total);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce to prevent rapid API calls while typing
    const timeoutId = setTimeout(() => {
        loadData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, currentPage]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleCategoryClick = (categoryName: string) => {
    updateFilter('category', categoryName);
    // Scroll to products after selection
    setTimeout(() => {
      document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      color: undefined,
      search: undefined,
      inStockOnly: false,
      sortBy: 'newest'
    });
    setCurrentPage(1); // Reset page
    // Also close the panel since we are resetting to basic state
    setShowFilters(false);
    // Remove search param from URL
    navigate('/');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.minPrice, 
    filters.maxPrice, 
    filters.minRating, 
    filters.color,
    filters.inStockOnly ? true : undefined
  ].filter(x => x !== undefined).length;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Hero Section - Only show when no complex filters or search are active to keep focus */}
      {filters.category === "All" && activeFiltersCount === 0 && !filters.search && (
        <div className="py-12 md:py-20 mb-10">
          <div className="bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="relative h-full flex flex-col justify-end p-8 md:p-16 max-w-2xl">
              <span className="text-brand-500 font-bold uppercase tracking-wider mb-2">New Season</span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Define Your <br/>Unique Style
              </h1>
              <button 
                onClick={() => {
                  const el = document.getElementById('collections');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center w-fit hover:bg-brand-50 transition-colors"
              >
                Shop Collection <ArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Category Grid (Collections) */}
      {!filters.search && (
        <div id="collections" className="mb-16 scroll-mt-24">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {CATEGORY_VISUALS.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div className={`w-full aspect-square rounded-full overflow-hidden border-2 transition-all duration-300 relative shadow-md ${filters.category === cat.name ? 'border-brand-600 ring-2 ring-brand-100' : 'border-transparent group-hover:border-black'}`}>
                   <img 
                     src={cat.image} 
                     alt={cat.name} 
                     className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                   />
                   <div className={`absolute inset-0 transition-colors ${filters.category === cat.name ? 'bg-brand-600/10' : 'bg-black/0 group-hover:bg-black/10'}`}></div>
                </div>
                <span className={`font-medium text-gray-900 group-hover:text-brand-600 transition-colors ${filters.category === cat.name ? 'font-bold text-brand-600' : ''}`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar & Product Section */}
      <div id="shop" className="flex flex-col mb-8 scroll-mt-24">
        
        {/* Search Result Header */}
        {filters.search && (
           <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search results for "{filters.search}"
              </h2>
              <button onClick={() => navigate('/')} className="text-sm text-brand-600 font-medium hover:underline mt-1">
                Clear search
              </button>
           </div>
        )}

        {/* Filter Toggle Button (Standalone) */}
        <div className="flex justify-start mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              showFilters || activeFiltersCount > 0
                ? 'bg-brand-50 text-brand-600 ring-2 ring-brand-100' 
                : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="bg-brand-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border border-gray-100 mb-8">
            
            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price Range</h3>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={filters.minPrice !== undefined ? filters.minPrice : ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-xs">$</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={filters.maxPrice !== undefined ? filters.maxPrice : ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Rating & Availability */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[4, 3, 2].map(rating => (
                    <button
                      key={rating}
                      onClick={() => updateFilter('minRating', filters.minRating === rating ? undefined : rating)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        filters.minRating === rating 
                          ? 'bg-yellow-50 border-yellow-200 text-yellow-700' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {rating}+ <Star size={12} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer group select-none">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.inStockOnly ? 'bg-black border-black text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                     {filters.inStockOnly && <Check size={12} />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={!!filters.inStockOnly}
                    onChange={(e) => updateFilter('inStockOnly', e.target.checked)} 
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Sort By</h3>
              <div className="relative">
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer text-gray-700"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="topRated">Top Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Color</h3>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => updateFilter('color', filters.color === c.name ? undefined : c.name)}
                    className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${
                      filters.color === c.name ? 'ring-2 ring-offset-2 ring-brand-600 scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {filters.color === c.name && <CheckIcon isWhite={c.name === 'Black' || c.name === 'Navy' || c.name === 'Green' || c.name === 'Brown'} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Button */}
            <div className="md:col-span-2 lg:col-span-4 flex justify-end border-t border-gray-200 pt-4">
              <button 
                onClick={clearFilters}
                className="text-gray-500 hover:text-red-500 text-sm font-medium flex items-center gap-2"
              >
                <X size={14} /> Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <Loader2 size={40} className="animate-spin mb-4 text-brand-500" />
          <p>Loading collection...</p>
        </div>
      ) : (
        <>
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {filters.category === "All" ? "All Products" : filters.category}
                <span className="ml-2 text-sm font-normal text-gray-500">({totalItems} items)</span>
              </h2>
           </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
                onClick={(p) => navigate(`/product/${p.id}`)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    currentPage === page 
                      ? 'bg-black text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
            <SlidersHorizontal size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
          <button 
            onClick={clearFilters}
            className="text-brand-600 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

const CheckIcon = ({ isWhite }: { isWhite: boolean }) => (
  <svg 
    className={`w-4 h-4 ${isWhite ? 'text-white' : 'text-gray-800'}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);