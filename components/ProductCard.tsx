import React from 'react';
import { Product } from '../types';
import { Star, Plus, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  const isOutOfStock = product.stock === 0;

  return (
    <div 
      className={`group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${isOutOfStock ? 'opacity-80' : ''}`}
      onClick={() => onClick(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover object-center transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
          loading="lazy"
        />
        
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur text-black px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <AlertCircle size={12} /> Out of Stock
            </span>
          </div>
        ) : (
          <button 
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{product.category}</p>
          <div className="flex items-center text-yellow-400 text-xs">
            <Star size={12} fill="currentColor" />
            <span className="text-gray-400 ml-1">{product.rating}</span>
          </div>
        </div>
        <h3 className={`font-medium text-gray-900 text-lg mb-1 truncate ${isOutOfStock ? 'text-gray-500' : ''}`}>{product.name}</h3>
        <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};