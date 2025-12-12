import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, fetchProducts, fetchReviews } from '../services/api';
import { Product, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Loader2, ArrowLeft, Star, ShoppingBag, Check, ThumbsUp, AlertCircle, Maximize2, X, Minus, Plus } from 'lucide-react';

interface ProductDetailsPageProps {
  onAddToCart: (product: Product, quantity?: number) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ onAddToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Image State
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Zoom & Lightbox State
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      window.scrollTo(0, 0); // Ensure scroll to top on navigation
      setQuantity(1); // Reset quantity on product change
      
      if (id) {
        try {
          const productId = parseInt(id, 10);
          
          // Fetch product, related items, and reviews in parallel
          const [productData, reviewsData] = await Promise.all([
            fetchProductById(productId),
            fetchReviews(productId)
          ]);

          setProduct(productData);
          setReviews(reviewsData);
          
          if (productData) {
            setActiveImage(productData.image); // Set initial image
            
            // Fetch related products based on category
            const { products: allCategoryProducts } = await fetchProducts({ category: productData.category });
            // Filter out current product and take first 5 to fit grid
            const related = allCategoryProducts
              .filter(p => p.id !== productId)
              .slice(0, 5);
            setRelatedProducts(related);
          }
        } catch (err) {
          console.error("Failed to fetch product data", err);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      setAdding(true);
      onAddToCart(product, quantity);
      // Simulate a small delay for visual feedback
      // Increased to 1500ms so the user has time to read "Added to Cart"
      setTimeout(() => setAdding(false), 1500);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!product) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };
  
  const galleryImages = product ? [product.image, ...(product.images || [])] : [];

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4 text-brand-500" />
        <p>Loading details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for might have been removed or unavailable.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isMaxStock = quantity >= product.stock;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Shopping
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Image Section */}
          <div className="space-y-4">
            <div 
              className={`aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-gray-100 relative group ${!isOutOfStock ? 'cursor-zoom-in' : ''}`}
              onMouseEnter={() => !isOutOfStock && setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              onClick={() => !isOutOfStock && setShowLightbox(true)}
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-transform duration-200 ease-out ${isOutOfStock ? 'grayscale opacity-80' : ''}`}
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transform: isHovering && !isOutOfStock ? 'scale(2)' : 'scale(1)'
                }}
              />
              
              {/* Overlays */}
              {isOutOfStock ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold text-lg">
                    Out of Stock
                  </div>
                </div>
              ) : (
                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg opacity-0 transition-opacity duration-300 pointer-events-none ${!isHovering ? 'group-hover:opacity-100' : ''}`}>
                  <Maximize2 size={20} className="text-gray-700" />
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-brand-600 shadow-md ring-2 ring-brand-100' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-center text-xs text-gray-400">
              {isOutOfStock ? 'This item is currently unavailable' : 'Hover main image to zoom • Click to expand'}
            </p>
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center">
            {isOutOfStock && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} className="text-red-600" />
                <span className="font-semibold">This product is currently out of stock.</span>
              </div>
            )}
            
            <span className="text-brand-600 font-bold uppercase tracking-wide text-sm mb-2">{product.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center text-yellow-400 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={16} fill="currentColor" />
                <span className="text-gray-900 font-bold ml-1.5 text-sm">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500 text-sm">{reviews.length} Reviews</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className={`mb-8 ${isOutOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                  <button 
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors rounded-l-lg disabled:opacity-50"
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{isOutOfStock ? 0 : quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-colors rounded-r-lg disabled:opacity-50"
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {isMaxStock && !isOutOfStock && (
                  <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md">
                    Max stock reached
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-gray-100 pt-8 mt-auto">
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-gray-900">
                  ${(product.price * quantity).toFixed(2)}
                </div>
                {quantity > 1 && (
                  <span className="text-gray-400 text-sm font-medium">
                    ${product.price.toFixed(2)} each
                  </span>
                )}
                {isLowStock && (
                  <div className="flex items-center gap-1.5 text-orange-600 text-sm font-medium mt-1">
                    <AlertCircle size={14} />
                    <span>Low Stock: Only {product.stock} left</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={adding || isOutOfStock}
                className={`flex-1 w-full sm:w-auto py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : adding 
                      ? 'bg-green-600 text-white scale-[0.98]' 
                      : 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] shadow-xl hover:shadow-2xl'
                }`}
              >
                {isOutOfStock ? (
                  <>
                    <AlertCircle size={24} className="mr-2" />
                    Out of Stock
                  </>
                ) : adding ? (
                  <>
                    <Check size={24} className="mr-2" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            
            <div className="mt-8 flex gap-4 text-sm">
              {isOutOfStock ? (
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  Out of Stock
                </div>
              ) : (
                <div className={`flex items-center gap-2 font-medium ${isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  {isLowStock ? 'Order soon' : 'In Stock'}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                Free Shipping
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-gray-100 pt-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={18} fill="currentColor" className={i > Math.round(product.rating) ? "text-gray-200" : ""} />
                  ))}
                </div>
                <span className="text-gray-500 font-medium">{product.rating} out of 5</span>
              </div>
            </div>
            <button className="px-6 py-2.5 border border-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-50 hover:border-black hover:text-black transition-colors self-start md:self-auto">
              Write a Review
            </button>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full bg-white shadow-sm" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.user}</h4>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    "{review.content}"
                  </p>
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    <ThumbsUp size={14} /> Helpful
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
             </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-100 pt-16 mt-16 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map(related => (
                <ProductCard 
                  key={related.id} 
                  product={related} 
                  onAddToCart={onAddToCart}
                  onClick={(p) => navigate(`/product/${p.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setShowLightbox(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setShowLightbox(false)}
          >
            <X size={32} />
          </button>
          <img 
            src={activeImage} 
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          />
        </div>
      )}
    </>
  );
};